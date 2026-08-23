/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { 
  AlertTriangle,
  CheckCircle2, 
  Loader2,
  Mail,
  Search, 
  Shield, 
  ShieldCheck, 
  UserPlus, 
  XCircle
} from 'lucide-react';
import React, { useState, useTransition } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  inviteAdministrator, 
  updateAdministratorRole, 
  deactivateAdministrator,
  reactivateAdministrator,
  resendAdministratorInvitation,
  AdminInvitePayload
} from '@/features/administrators/actions';
import { AdministratorRow } from '@/features/administrators/repository';

interface AdminListClientProps {
  initialAdmins: AdministratorRow[];
  currentUserId: string;
}

export function AdminListClient({ initialAdmins, currentUserId }: AdminListClientProps) {
  const [admins] = useState<AdministratorRow[]>(initialAdmins);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<'all' | 'admin' | 'super-admin'>('all');
  const [isPending, startTransition] = useTransition();

  // Modal states
  const [showInviteModal, setShowInviteModal] = useState(false);

  // Invite Form State
  const [inviteForm, setInviteForm] = useState<AdminInvitePayload>({
    email: '',
    firstName: '',
    lastName: '',
    role: 'admin'
  });
  const [error, setError] = useState<string | null>(null);

  const filteredAdmins = admins.filter(admin => {
    const matchesSearch = 
      admin.profile.display_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.profile.primary_email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || admin.role_slug === filterRole;
    return matchesSearch && matchesRole;
  });

  const stats = {
    total: admins.length,
    active: admins.filter(a => a.is_active).length,
    admins: admins.filter(a => a.role_slug === 'admin').length,
    superAdmins: admins.filter(a => a.role_slug === 'super-admin').length,
  };

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await inviteAdministrator(inviteForm);
      if (!result.success) {
        setError(result.error || 'Failed to invite administrator.');
        return;
      }
      setShowInviteModal(false);
      setInviteForm({ email: '', firstName: '', lastName: '', role: 'admin' });
      window.location.reload();
    });
  };

  const handleRoleChange = (userId: string, newRole: 'admin' | 'super-admin') => {
    const label = newRole === 'super-admin' ? 'Super Admin' : 'Admin';
    const message = newRole === 'super-admin'
      ? `Promote this user to Super Admin? Super Admins have full access to manage other administrators and all settings.`
      : `Demote this user to Admin? They will lose Super Admin privileges.`;
    if (!confirm(message)) return;

    startTransition(async () => {
      const result = await updateAdministratorRole(userId, newRole);
      if (!result.success) {
        alert(result.error || `Failed to change role to ${label}.`);
        return;
      }
      window.location.reload();
    });
  };

  const handleDeactivate = (userId: string) => {
    if (!confirm('Deactivate this administrator?\n\nThey will immediately lose administrator access.')) return;

    startTransition(async () => {
      const result = await deactivateAdministrator(userId);
      if (!result.success) {
        alert(result.error || 'Failed to deactivate administrator.');
        return;
      }
      window.location.reload();
    });
  };

  const handleReactivate = (userId: string, roleSlug: 'admin' | 'super-admin') => {
    if (!confirm('Reactivate this administrator?')) return;

    startTransition(async () => {
      const result = await reactivateAdministrator(userId, roleSlug);
      if (!result.success) {
        alert(result.error || 'Failed to reactivate administrator.');
        return;
      }
      window.location.reload();
    });
  };

  const handleResendInvitation = (userId: string, email: string) => {
    if (!confirm(`Send a fresh access/setup link to ${email}?`)) return;

    startTransition(async () => {
      const result = await resendAdministratorInvitation(userId, email);
      if (!result.success) {
        alert(result.error || 'Failed to send access email. Please try again.');
        return;
      }
      const msg = (result.data as any)?.message || 'Email sent. Please check inbox and spam folder.';
      alert(msg);
    });
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <p className="text-sm font-medium text-gray-500 mb-1">Total Administrators</p>
          <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <p className="text-sm font-medium text-gray-500 mb-1">Active</p>
          <p className="text-3xl font-bold text-green-600">{stats.active}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <p className="text-sm font-medium text-gray-500 mb-1">Admins</p>
          <p className="text-3xl font-bold text-indigo-600">{stats.admins}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <p className="text-sm font-medium text-gray-500 mb-1">Super Admins</p>
          <p className="text-3xl font-bold text-purple-600">{stats.superAdmins}</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input 
              placeholder="Search administrators..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 w-full sm:w-64"
            />
          </div>
          <select
            className="h-10 px-3 py-2 bg-white border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value as any)}
          >
            <option value="all">All Roles</option>
            <option value="admin">Admins</option>
            <option value="super-admin">Super Admins</option>
          </select>
        </div>
        
        <Button onClick={() => setShowInviteModal(true)} className="w-full sm:w-auto flex items-center gap-2">
          <UserPlus className="w-4 h-4" /> Add Administrator
        </Button>
      </div>

      {/* List */}
      <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50/50 text-xs uppercase font-semibold text-gray-500 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">Name & Email</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Created</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredAdmins.map((admin) => (
                <tr key={admin.user_id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                        {admin.profile.display_name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{admin.profile.display_name}</div>
                        <div className="text-gray-500 text-xs">{admin.profile.primary_email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                      admin.role_slug === 'super-admin' 
                        ? 'bg-purple-50 text-purple-700 border-purple-200' 
                        : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                    }`}>
                      {admin.role_slug === 'super-admin' ? <ShieldCheck className="w-3.5 h-3.5" /> : <Shield className="w-3.5 h-3.5" />}
                      {admin.role_slug === 'super-admin' ? 'Super Admin' : 'Admin'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {admin.is_active ? (
                      <span className="inline-flex items-center gap-1.5 text-green-600 text-xs font-medium">
                        <CheckCircle2 className="w-4 h-4" /> Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-gray-400 text-xs font-medium">
                        <XCircle className="w-4 h-4" /> Inactive
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {new Date(admin.assigned_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      {admin.is_active ? (
                        <>
                          <Button 
                            variant="outline" 
                            size="sm"
                            disabled={isPending || (admin.user_id === currentUserId && admin.role_slug === 'super-admin')}
                            onClick={() => handleRoleChange(admin.user_id, admin.role_slug === 'admin' ? 'super-admin' : 'admin')}
                          >
                            {admin.role_slug === 'admin' ? 'Promote' : 'Demote'}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-blue-600 border-blue-200 hover:bg-blue-50"
                            disabled={isPending || admin.user_id === currentUserId}
                            onClick={() => handleResendInvitation(admin.user_id, admin.profile.primary_email)}
                          >
                            <Mail className="h-3.5 w-3.5 mr-1" />
                            Resend Invite
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-red-600 border-red-200 hover:bg-red-50"
                            disabled={isPending || admin.user_id === currentUserId}
                            onClick={() => handleDeactivate(admin.user_id)}
                          >
                            Deactivate
                          </Button>
                        </>
                      ) : (
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-green-600 border-green-200 hover:bg-green-50"
                          disabled={isPending}
                          onClick={() => handleReactivate(admin.user_id, admin.role_slug as any)}
                        >
                          Reactivate
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              
              {filteredAdmins.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No administrators found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Add Administrator</h2>
              <button 
                onClick={() => { setShowInviteModal(false); setError(null); }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleInviteSubmit} className="p-6 space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm flex gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <p>{error}</p>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">First Name <span className="text-red-500">*</span></label>
                  <Input 
                    required 
                    value={inviteForm.firstName} 
                    onChange={e => setInviteForm({...inviteForm, firstName: e.target.value})} 
                    placeholder="Jane"
                    disabled={isPending}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Last Name</label>
                  <Input 
                    value={inviteForm.lastName} 
                    onChange={e => setInviteForm({...inviteForm, lastName: e.target.value})} 
                    placeholder="Doe"
                    disabled={isPending}
                  />
                </div>
              </div>
              
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Email Address <span className="text-red-500">*</span></label>
                <Input 
                  required 
                  type="email"
                  value={inviteForm.email} 
                  onChange={e => setInviteForm({...inviteForm, email: e.target.value})} 
                  placeholder="jane.doe@example.com"
                  disabled={isPending}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Role <span className="text-red-500">*</span></label>
                <select 
                  className="w-full h-10 px-3 py-2 bg-white border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  value={inviteForm.role}
                  onChange={e => setInviteForm({...inviteForm, role: e.target.value as any})}
                  disabled={isPending}
                >
                  <option value="admin">Administrator</option>
                  <option value="super-admin">Super Admin</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  {inviteForm.role === 'super-admin' 
                    ? 'Super Admins have full access to manage other administrators and all settings.'
                    : 'Administrators have access to content management and website operations.'}
                </p>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                <Button type="button" variant="outline" onClick={() => { setShowInviteModal(false); setError(null); }} disabled={isPending}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Send Invitation
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
