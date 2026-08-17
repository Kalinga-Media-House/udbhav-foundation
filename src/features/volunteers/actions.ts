'use server';

import { revalidateTag } from 'next/cache';

import { handleAction, requireAuth, requirePermission, CacheTags } from '@/contracts/actions';
import type { ActionResult } from '@/contracts/actions';
import type { PaginatedResult } from '@/contracts/repositories';
import type { Pagination } from '@/types';

import type {
  VolunteerRow,
  VolunteerApplicationRow,
  ProgramVolunteerRow,
  EventVolunteerRow,
  VolunteerDocumentRow,
  VolunteerDashboardData,
} from './repository';
import { volunteersService } from './service';
import type {
  CreateVolunteerDTO,
  UpdateVolunteerDTO,
  ReviewApplicationDTO,
  AssignProgramDTO,
  AssignEventDTO,
  LogVolunteerHoursDTO,
  UploadCertificateDTO,
  UpdateVolunteerProfileDTO,
} from './validators';

/**
 * Server action to register a new volunteer.
 */
export async function registerVolunteer(dto: CreateVolunteerDTO): Promise<ActionResult<VolunteerRow>> {
  return handleAction('registerVolunteer', async () => {
    const session = await requireAuth();
    const result = await volunteersService.register(dto, session.id);
    if (!result.success) throw new Error(result.error ?? 'Registration failed');
    (revalidateTag as any)(CacheTags.volunteers());
    return result.data!;
  });
}

/**
 * Server action to approve a volunteer application.
 * Requires `volunteers.approve` permission.
 */
export async function approveVolunteer(id: string): Promise<ActionResult<VolunteerRow>> {
  return handleAction('approveVolunteer', async () => {
    const session = await requireAuth();
    requirePermission(session, 'volunteers.approve');
    const result = await volunteersService.approve(id, session.id);
    if (!result.success) throw new Error(result.error ?? 'Approval failed');
    (revalidateTag as any)(CacheTags.volunteers());
    (revalidateTag as any)(CacheTags.volunteer(id));
    return result.data!;
  });
}

/**
 * Server action to update volunteer details.
 * Requires `volunteers.update` permission.
 */
export async function updateVolunteer(id: string, dto: UpdateVolunteerDTO): Promise<ActionResult<VolunteerRow>> {
  return handleAction('updateVolunteer', async () => {
    const session = await requireAuth();
    requirePermission(session, 'volunteers.update');
    const result = await volunteersService.update(id, dto, session.id);
    if (!result.success) throw new Error(result.error ?? 'Update failed');
    (revalidateTag as any)(CacheTags.volunteers());
    (revalidateTag as any)(CacheTags.volunteer(id));
    return result.data!;
  });
}

/**
 * Server action to list volunteers with pagination and filtering.
 */
export async function listVolunteers(pagination: Pagination, filters?: Record<string, unknown>): Promise<ActionResult<PaginatedResult<VolunteerRow>>> {
  return handleAction('listVolunteers', async () => {
    const result = await volunteersService.list(pagination, filters);
    if (!result.success) throw new Error(result.error ?? 'List failed');
    return result.data!;
  });
}

/**
 * Server action to list volunteer applications for admin queue.
 * Requires volunteers.manage permission.
 */
export async function listVolunteerApplications(pagination: Pagination, status?: string): Promise<ActionResult<PaginatedResult<VolunteerApplicationRow>>> {
  return handleAction('listVolunteerApplications', async () => {
    const session = await requireAuth();
    requirePermission(session, 'volunteers.manage');
    const result = await volunteersService.listApplications(pagination, status);
    if (!result.success) throw new Error(result.error ?? 'Failed to list volunteer applications');
    return result.data!;
  });
}

/**
 * Server action to review (approve/reject) a volunteer application.
 * Requires volunteers.manage permission.
 */
export async function reviewVolunteerApplication(dto: ReviewApplicationDTO): Promise<ActionResult<VolunteerApplicationRow>> {
  return handleAction('reviewVolunteerApplication', async () => {
    const session = await requireAuth();
    requirePermission(session, 'volunteers.manage');
    const result = await volunteersService.reviewApplication(dto, session.id);
    if (!result.success) throw new Error(result.error ?? 'Failed to review application');
    (revalidateTag as any)(CacheTags.volunteers());
    return result.data!;
  });
}

/**
 * Server action to update volunteer profile from admin panel.
 * Requires volunteers.manage permission.
 */
export async function updateVolunteerProfile(dto: UpdateVolunteerProfileDTO): Promise<ActionResult<VolunteerApplicationRow>> {
  return handleAction('updateVolunteerProfile', async () => {
    const session = await requireAuth();
    requirePermission(session, 'volunteers.manage');
    const result = await volunteersService.updateApplicationProfile(dto.id, dto, session.id);
    if (!result.success) throw new Error(result.error ?? 'Failed to update profile');
    (revalidateTag as any)(CacheTags.volunteers());
    return result.data!;
  });
}

/**
 * Server action to get a volunteer by public code.
 * Public read access.
 */
export async function getVolunteerByCode(code: string): Promise<ActionResult<VolunteerRow>> {
  return handleAction('getVolunteerByCode', async () => {
    const result = await volunteersService.getByCode(code);
    if (!result.success) throw new Error(result.error ?? 'Volunteer not found');
    return result.data!;
  });
}

/**
 * Server action to list publicly visible approved/active volunteers.
 * Public read access.
 */
export async function listPublicVolunteers(pagination: Pagination, filters?: Record<string, unknown>): Promise<ActionResult<PaginatedResult<VolunteerRow>>> {
  return handleAction('listPublicVolunteers', async () => {
    const result = await volunteersService.listPublic(pagination, filters);
    if (!result.success) throw new Error(result.error ?? 'Failed to fetch public volunteers');
    return result.data!;
  });
}

/**
 * Server action to assign a volunteer to a program.
 * Requires volunteers.manage permission.
 */
export async function assignVolunteerToProgram(dto: AssignProgramDTO): Promise<ActionResult<ProgramVolunteerRow>> {
  return handleAction('assignVolunteerToProgram', async () => {
    const session = await requireAuth();
    requirePermission(session, 'volunteers.manage');
    const result = await volunteersService.assignToProgram(dto);
    if (!result.success) throw new Error(result.error ?? 'Failed to assign program');
    (revalidateTag as any)(CacheTags.volunteers());
    return result.data!;
  });
}

/**
 * Server action to assign a volunteer to an event.
 * Requires volunteers.manage permission.
 */
export async function assignVolunteerToEvent(dto: AssignEventDTO): Promise<ActionResult<EventVolunteerRow>> {
  return handleAction('assignVolunteerToEvent', async () => {
    const session = await requireAuth();
    requirePermission(session, 'volunteers.manage');
    const result = await volunteersService.assignToEvent(dto);
    if (!result.success) throw new Error(result.error ?? 'Failed to assign event');
    (revalidateTag as any)(CacheTags.volunteers());
    return result.data!;
  });
}

/**
 * Server action to log volunteer hours.
 * Requires volunteers.manage permission.
 */
export async function logVolunteerActivityHours(dto: LogVolunteerHoursDTO): Promise<ActionResult<VolunteerRow>> {
  return handleAction('logVolunteerActivityHours', async () => {
    const session = await requireAuth();
    requirePermission(session, 'volunteers.manage');
    const result = await volunteersService.logHours(dto);
    if (!result.success) throw new Error(result.error ?? 'Failed to log hours');
    (revalidateTag as any)(CacheTags.volunteers());
    return result.data!;
  });
}

/**
 * Server action to upload a certificate for a volunteer.
 * Requires volunteers.manage permission.
 */
export async function uploadVolunteerCertificate(dto: UploadCertificateDTO): Promise<ActionResult<VolunteerDocumentRow>> {
  return handleAction('uploadVolunteerCertificate', async () => {
    const session = await requireAuth();
    requirePermission(session, 'volunteers.manage');
    const result = await volunteersService.uploadCertificate(dto);
    if (!result.success) throw new Error(result.error ?? 'Failed to upload certificate');
    (revalidateTag as any)(CacheTags.volunteers());
    return result.data!;
  });
}

/**
 * Server action for authenticated volunteers to load their own dashboard data.
 */
export async function getVolunteerDashboardData(): Promise<ActionResult<VolunteerDashboardData>> {
  return handleAction('getVolunteerDashboardData', async () => {
    const session = await requireAuth();
    const result = await volunteersService.getDashboard(session.id);
    if (!result.success) throw new Error(result.error ?? 'Failed to load volunteer dashboard');
    return result.data!;
  });
}

/**
 * Server action to export volunteer data for CSV.
 * Requires volunteers.manage permission.
 * Excludes sensitive information unless authorized.
 */
export async function exportVolunteersCSV(filters?: Record<string, unknown>): Promise<ActionResult<VolunteerApplicationRow[]>> {
  return handleAction('exportVolunteersCSV', async () => {
    const session = await requireAuth();
    requirePermission(session, 'volunteers.manage');
    const result = await volunteersService.export(filters);
    if (!result.success) throw new Error(result.error ?? 'Failed to export volunteers');
    return result.data!;
  });
}
