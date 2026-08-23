'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { requireAuth, requireSuperAdminAuth, handleAction } from '@/contracts/actions';
import { administratorsRepository } from './repository';
import { revalidatePath } from 'next/cache';
import crypto from 'crypto';

export interface AdminInvitePayload {
  email: string;
  firstName: string;
  lastName?: string;
  role: 'admin' | 'super-admin';
}

export const inviteAdministrator = async (payload: AdminInvitePayload) => {
  return handleAction('inviteAdministrator', async () => {
    const session = await requireAuth();
    requireSuperAdminAuth(session);

    // Validate role input server-side (prevent client from sending arbitrary role slugs)
    if (payload.role !== 'admin' && payload.role !== 'super-admin') {
      throw new Error('Invalid role. Must be "admin" or "super-admin".');
    }

    // Use service-role client for all admin operations (bypasses RLS as intended
    // for server-side Super Admin actions). This file is 'use server' and
    // createAdminClient() has a browser-side throw guard.
    const adminClient = createAdminClient();

    let userId: string;

    // Use NEXT_PUBLIC_APP_URL so invitations redirect to the correct domain
    // (production: https://udbhavfoundation.in, dev: http://localhost:3000)
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    // 1. Try to invite new user; if they already exist, look up their existing identity
    const { data: authData, error: authError } = await adminClient.auth.admin.inviteUserByEmail(
      payload.email,
      { redirectTo: `${appUrl}/login/update-password` }
    );

    if (authError) {
      // Check if the user already exists in auth.users
      const { data: existingUsers, error: listError } = await adminClient.auth.admin.listUsers();
      if (listError) {
        throw new Error(`Failed to check existing users: ${listError.message}`);
      }
      const existingUser = existingUsers.users.find(
        (u) => u.email?.toLowerCase() === payload.email.toLowerCase()
      );
      if (!existingUser) {
        throw new Error(`Auth Invite Failed: ${authError.message}`);
      }
      userId = existingUser.id;
    } else {
      userId = authData.user.id;
    }

    // 2. Ensure profile exists (upsert — preserves existing profile data for existing users)
    const slug = `${payload.firstName.toLowerCase().replace(/[^a-z0-9]/g, '')}-${crypto.randomBytes(4).toString('hex')}`;

    const { error: profileError } = await (adminClient.from('profiles') as any).upsert({
      id: userId,
      first_name: payload.firstName,
      last_name: payload.lastName || null,
      primary_email: payload.email,
      slug: slug,
      status: 'active'
    }, { onConflict: 'id', ignoreDuplicates: false });

    if (profileError) {
      throw new Error(`Profile Creation Failed: ${profileError.message}`);
    }

    // 3. Assign role — deactivate any existing roles first, then upsert the new one
    const role = await administratorsRepository.getRoleBySlug(payload.role);

    await (adminClient.from('user_roles') as any)
      .update({ is_active: false })
      .eq('user_id', userId);

    const { error: roleError } = await (adminClient.from('user_roles') as any).upsert({
      user_id: userId,
      role_id: role.id,
      is_active: true,
      assigned_by: session.id
    }, { onConflict: 'user_id,role_id' });

    if (roleError) {
      throw new Error(`Role Assignment Failed: ${roleError.message}`);
    }

    // 4. Audit Log
    await (adminClient.from('activity_logs') as any).insert({
      actor_id: session.id,
      action: 'INVITE',
      category: 'Authorization',
      module: 'administrators',
      severity: 'warning',
      description: `Invited new ${payload.role}: ${payload.email}`,
      entity_type: 'profile',
      entity_id: userId
    });

    revalidatePath('/admin/administrators');
    return true;
  });
};

export const updateAdministratorRole = async (userId: string, newRoleSlug: 'admin' | 'super-admin') => {
  return handleAction('updateAdministratorRole', async () => {
    const session = await requireAuth();
    requireSuperAdminAuth(session);

    // Validate role input server-side
    if (newRoleSlug !== 'admin' && newRoleSlug !== 'super-admin') {
      throw new Error('Invalid role. Must be "admin" or "super-admin".');
    }

    if (userId === session.id && newRoleSlug !== 'super-admin') {
      throw new Error("You cannot demote yourself.");
    }

    const adminClient = createAdminClient();
    const role = await administratorsRepository.getRoleBySlug(newRoleSlug);

    // If demoting a super-admin, check if they are the last one
    if (newRoleSlug === 'admin') {
      const superAdminRole = await administratorsRepository.getRoleBySlug('super-admin');
      const { data: superAdmins } = await (adminClient.from('user_roles') as any)
        .select('user_id')
        .eq('is_active', true)
        .eq('role_id', superAdminRole.id);

      if (superAdmins && superAdmins.length <= 1 && superAdmins.some((r: any) => r.user_id === userId)) {
        throw new Error("At least one active Super Admin must remain.");
      }
    }

    // Deactivate old roles
    await (adminClient.from('user_roles') as any)
      .update({ is_active: false })
      .eq('user_id', userId);

    // Upsert new role
    const { error: roleError } = await (adminClient.from('user_roles') as any).upsert({
      user_id: userId,
      role_id: role.id,
      is_active: true,
      assigned_by: session.id
    }, { onConflict: 'user_id,role_id' });

    if (roleError) {
      throw new Error(`Role Update Failed: ${roleError.message}`);
    }

    await (adminClient.from('activity_logs') as any).insert({
      actor_id: session.id,
      action: 'UPDATE_ROLE',
      category: 'Authorization',
      module: 'administrators',
      severity: 'warning',
      description: `Changed role to ${newRoleSlug} for user ${userId}`,
      entity_type: 'profile',
      entity_id: userId
    });

    revalidatePath('/admin/administrators');
    return true;
  });
};

export const deactivateAdministrator = async (userId: string) => {
  return handleAction('deactivateAdministrator', async () => {
    const session = await requireAuth();
    requireSuperAdminAuth(session);

    if (userId === session.id) {
      throw new Error("You cannot deactivate yourself.");
    }

    const adminClient = createAdminClient();

    // Check if they are the last super admin
    const superAdminRole = await administratorsRepository.getRoleBySlug('super-admin');
    const { data: userRole } = await (adminClient.from('user_roles') as any)
      .select('role_id')
      .eq('user_id', userId)
      .eq('is_active', true)
      .eq('role_id', superAdminRole.id)
      .maybeSingle();

    if (userRole) {
      const { data: superAdmins } = await (adminClient.from('user_roles') as any)
        .select('user_id')
        .eq('is_active', true)
        .eq('role_id', superAdminRole.id);

      if (superAdmins && superAdmins.length <= 1) {
        throw new Error("At least one active Super Admin must remain.");
      }
    }

    const { error } = await (adminClient.from('user_roles') as any)
      .update({ is_active: false })
      .eq('user_id', userId);

    if (error) {
      throw new Error(`Deactivation Failed: ${error.message}`);
    }

    await (adminClient.from('activity_logs') as any).insert({
      actor_id: session.id,
      action: 'DEACTIVATE',
      category: 'Authorization',
      module: 'administrators',
      severity: 'critical',
      description: `Deactivated administrator access for user ${userId}`,
      entity_type: 'profile',
      entity_id: userId
    });

    revalidatePath('/admin/administrators');
    return true;
  });
};

export const reactivateAdministrator = async (userId: string, roleSlug: 'admin' | 'super-admin') => {
  return handleAction('reactivateAdministrator', async () => {
    const session = await requireAuth();
    requireSuperAdminAuth(session);

    // Validate role input server-side
    if (roleSlug !== 'admin' && roleSlug !== 'super-admin') {
      throw new Error('Invalid role. Must be "admin" or "super-admin".');
    }

    const adminClient = createAdminClient();
    const role = await administratorsRepository.getRoleBySlug(roleSlug);

    const { error } = await (adminClient.from('user_roles') as any)
      .update({ is_active: true })
      .eq('user_id', userId)
      .eq('role_id', role.id);

    if (error) {
      throw new Error(`Reactivation Failed: ${error.message}`);
    }

    await (adminClient.from('activity_logs') as any).insert({
      actor_id: session.id,
      action: 'REACTIVATE',
      category: 'Authorization',
      module: 'administrators',
      severity: 'warning',
      description: `Reactivated administrator access for user ${userId}`,
      entity_type: 'profile',
      entity_id: userId
    });

    revalidatePath('/admin/administrators');
    return true;
  });
};

export const resendAdministratorInvitation = async (userId: string, email: string) => {
  return handleAction('resendAdministratorInvitation', async () => {
    const session = await requireAuth();
    requireSuperAdminAuth(session);

    const adminClient = createAdminClient();
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const redirectTo = `${appUrl}/login/update-password`;

    // Mask email for safe logging
    const maskedEmail = email.replace(/(.{2})(.*)(@.*)/, '$1***$3');

    // 1. Verify the Auth user exists
    const { data: userData, error: userError } = await adminClient.auth.admin.getUserById(userId);
    if (userError || !userData?.user) {
      console.error(`[resendInvitation] Auth user not found for ${maskedEmail}`, userError?.message);
      throw new Error('Administrator account not found in authentication system.');
    }

    const user = userData.user;
    const isConfirmed = !!user.email_confirmed_at;

    console.log(`[resendInvitation] User ${maskedEmail}: confirmed=${isConfirmed}, redirectTo=${redirectTo}`);

    let sendError: string | null = null;

    if (isConfirmed) {
      // User already confirmed — send a password recovery email.
      // auth.resetPasswordForEmail() actually sends an email (unlike generateLink).
      const { error } = await adminClient.auth.resetPasswordForEmail(email, {
        redirectTo,
      });
      if (error) {
        console.error(`[resendInvitation] resetPasswordForEmail failed for ${maskedEmail}:`, error.message);
        sendError = error.message;
      } else {
        console.log(`[resendInvitation] Password recovery email sent to ${maskedEmail}`);
      }
    } else {
      // User not yet confirmed — resend the invitation email.
      // inviteUserByEmail() actually sends an email (unlike generateLink).
      const { error } = await adminClient.auth.admin.inviteUserByEmail(email, {
        redirectTo,
      });
      if (error) {
        console.error(`[resendInvitation] inviteUserByEmail failed for ${maskedEmail}:`, error.message);
        sendError = error.message;
      } else {
        console.log(`[resendInvitation] Invitation email sent to ${maskedEmail}`);
      }
    }

    if (sendError) {
      // Check for rate limiting
      if (sendError.toLowerCase().includes('rate') || sendError.toLowerCase().includes('limit')) {
        throw new Error('Email sending is temporarily limited. Please wait a few minutes and try again.');
      }
      throw new Error(`Failed to send access email: ${sendError}`);
    }

    // Audit Log
    await (adminClient.from('activity_logs') as any).insert({
      actor_id: session.id,
      action: 'RESEND_INVITATION',
      category: 'Authorization',
      module: 'administrators',
      severity: 'info',
      description: `${isConfirmed ? 'Sent password recovery email' : 'Resent invitation email'} to ${maskedEmail}`,
      entity_type: 'profile',
      entity_id: userId
    });

    revalidatePath('/admin/administrators');
    return {
      sent: true,
      type: isConfirmed ? 'recovery' : 'invite',
      message: isConfirmed
        ? 'Password recovery email sent. Please check inbox and spam folder.'
        : 'Invitation email sent. Please check inbox and spam folder.'
    };
  });
};
