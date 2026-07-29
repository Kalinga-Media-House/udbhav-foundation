import type { PaginatedResult } from '@/contracts/repositories';
import { ok, fail, fromRepo } from '@/contracts/services';
import type { ServiceResult } from '@/contracts/services';
import { createAdminClient } from '@/lib/supabase/admin';
import type { Pagination, ID } from '@/types';

import { volunteersRepository } from './repository';
import type {
  VolunteerRow,
  VolunteerCreate,
  VolunteerApplicationRow,
  VolunteerApplicationCreate,
  ProgramVolunteerRow,
  EventVolunteerRow,
  VolunteerDocumentRow,
  VolunteerDashboardData,
} from './repository';
import {
  createVolunteerSchema,
  updateVolunteerSchema,
  createVolunteerApplicationSchema,
  reviewApplicationSchema,
  assignProgramSchema,
  assignEventSchema,
  logVolunteerHoursSchema,
  uploadCertificateSchema,
} from './validators';
import type { CreateVolunteerDTO, UpdateVolunteerDTO } from './validators';

export class VolunteersService {
  /**
   * Retrieves a volunteer record by ID.
   * @param id - The volunteer ID.
   * @returns Service result containing the volunteer row or error.
   */
  async getById(id: ID): Promise<ServiceResult<VolunteerRow>> {
    return fromRepo(await volunteersRepository.findById(id));
  }

  /**
   * Retrieves a volunteer record by profile ID.
   * @param profileId - The profile ID.
   * @returns Service result containing the volunteer row or error.
   */
  async getByProfile(profileId: ID): Promise<ServiceResult<VolunteerRow>> {
    return fromRepo(await volunteersRepository.findByProfile(profileId));
  }

  /**
   * Retrieves a paginated list of volunteers.
   * @param pagination - Pagination settings.
   * @param filters - Optional criteria for filtering volunteers.
   * @returns Service result with paginated volunteer list.
   */
  async list(pagination: Pagination, filters?: Record<string, unknown>): Promise<ServiceResult<PaginatedResult<VolunteerRow>>> {
    return ok(await volunteersRepository.findMany({ pagination, filters }));
  }

  /**
   * Registers a new volunteer after validating input data.
   * @param dto - Volunteer creation payload.
   * @param userId - ID of the creating user.
   * @returns Service result containing the created volunteer.
   */
  async register(dto: CreateVolunteerDTO, userId: ID): Promise<ServiceResult<VolunteerRow>> {
    const parsed = createVolunteerSchema.safeParse(dto);
    if (!parsed.success) return fail(parsed.error.issues.map((e: { message: string }) => e.message).join(', '));
    return fromRepo(await volunteersRepository.create({ ...parsed.data, created_by: userId, updated_by: userId } as VolunteerCreate));
  }

  /**
   * Approves a pending volunteer application.
   * @param id - Volunteer ID to approve.
   * @param userId - ID of the approving user.
   * @returns Service result containing the updated volunteer.
   */
  async approve(id: ID, userId: ID): Promise<ServiceResult<VolunteerRow>> {
    return fromRepo(await volunteersRepository.update(id, { status: 'Active', updated_by: userId }));
  }

  /**
   * Updates an existing volunteer record after validating input.
   * @param id - Volunteer ID to update.
   * @param dto - Partial volunteer fields to update.
   * @param userId - ID of the user executing the update.
   * @returns Service result containing the updated volunteer.
   */
  async update(id: ID, dto: UpdateVolunteerDTO, userId: ID): Promise<ServiceResult<VolunteerRow>> {
    const parsed = updateVolunteerSchema.safeParse(dto);
    if (!parsed.success) return fail(parsed.error.issues.map((e: { message: string }) => e.message).join(', '));
    return fromRepo(await volunteersRepository.update(id, { ...parsed.data, updated_by: userId }));
  }

  /**
   * Removes (soft deletes) a volunteer record.
   * @param id - Volunteer ID to remove.
   * @param userId - ID of the user performing removal.
   * @returns Service result with deleted volunteer row.
   */
  async remove(id: ID, userId: ID): Promise<ServiceResult<VolunteerRow>> {
    return fromRepo(await volunteersRepository.softDelete(id, userId));
  }

  /**
   * Searches volunteers matching full-text search criteria.
   * @param query - The search text query.
   * @param pagination - Pagination details.
   * @returns Service result with paginated matching volunteers.
   */
  async search(query: string, pagination: Pagination): Promise<ServiceResult<PaginatedResult<VolunteerRow>>> {
    return ok(await volunteersRepository.search(query, pagination));
  }

  /**
   * Submits a new volunteer application after validating input data.
   * @param dto - Volunteer application payload from public form.
   * @returns Service result containing the created application or error.
   */
  async submitApplication(dto: unknown): Promise<ServiceResult<VolunteerApplicationRow>> {
    const parsed = createVolunteerApplicationSchema.safeParse(dto);
    if (!parsed.success) return fail(parsed.error.issues.map((e: { message: string }) => e.message).join(', '));
    const data = parsed.data;
    const applicationCreate: VolunteerApplicationCreate = {
      full_name: data.fullName,
      email: data.email,
      mobile_number: data.mobileNumber,
      age: data.age ?? null,
      occupation: data.occupation,
      city_district: data.cityDistrict,
      state: data.state,
      preferred_areas: data.preferredAreas,
      skills: data.skills ?? null,
      availability: data.availability,
      motivation: data.motivation,
      consent: data.consent,
      status: 'pending',
    };
    const result = await volunteersRepository.createApplication(applicationCreate);
    if (result.data) {
      await this.notifyByEmail(
        data.email,
        'Application Submitted',
        'We have received your volunteer application. Our team will review it shortly.',
        'application_submitted',
        '/volunteers'
      );
    }
    return fromRepo(result);
  }

  async listApplications(pagination: Pagination, status?: string): Promise<ServiceResult<PaginatedResult<VolunteerApplicationRow>>> {
    return ok(await volunteersRepository.listApplications({ pagination, status }));
  }

  async reviewApplication(dto: unknown, userId: string): Promise<ServiceResult<VolunteerApplicationRow>> {
    const parsed = reviewApplicationSchema.safeParse(dto);
    if (!parsed.success) return fail(parsed.error.issues.map((e: { message: string }) => e.message).join(', '));
    const { application_id, status, notes } = parsed.data;

    const appRes = await volunteersRepository.updateApplicationStatus(application_id, status, notes);
    if (appRes.error || !appRes.data) return fromRepo(appRes);

    const application = appRes.data;

    if (status === 'accepted') {
      const supabase = createAdminClient();
      const { data: profile } = await (supabase.from('profiles') as any)
        .select('id, email')
        .eq('email', application.email)
        .single();

      if (profile) {
        const { data: existingVol } = await (supabase.from('volunteers') as any)
          .select('id')
          .eq('profile_id', profile.id)
          .single();

        if (!existingVol) {
          const code = await volunteersRepository.generateVolunteerCode();
          const volCreate: VolunteerCreate = {
            profile_id: profile.id,
            volunteer_code: code,
            status: 'Active',
            bio: application.motivation,
            motivation: application.motivation,
            availability: application.availability,
            metadata: {
              skills: application.skills,
              preferred_areas: application.preferred_areas,
              city_district: application.city_district,
              state: application.state,
              occupation: application.occupation,
              application_id: application.id,
            },
            created_by: userId,
            updated_by: userId,
          };
          await volunteersRepository.create(volCreate);
        }

        await this.notifyUser(
          profile.id,
          'Application Approved',
          'Congratulations! Your volunteer application has been approved. You are now an active volunteer.',
          'application_approved',
          '/volunteers/dashboard'
        );
      }
    } else if (status === 'rejected') {
      await this.notifyByEmail(
        application.email,
        'Application Update',
        'Thank you for your interest in volunteering with UDBHAV Foundation. At this time, we are unable to accept your application.',
        'application_rejected',
        '/volunteers'
      );
    }

    return ok(application);
  }

  async getByCode(code: string): Promise<ServiceResult<VolunteerRow>> {
    return fromRepo(await volunteersRepository.findByCode(code));
  }

  async listPublic(pagination: Pagination, filters?: Record<string, unknown>): Promise<ServiceResult<PaginatedResult<VolunteerRow>>> {
    return ok(await volunteersRepository.listPublicVolunteers({ pagination, filters }));
  }

  async assignToProgram(dto: unknown): Promise<ServiceResult<ProgramVolunteerRow>> {
    const parsed = assignProgramSchema.safeParse(dto);
    if (!parsed.success) return fail(parsed.error.issues.map((e: { message: string }) => e.message).join(', '));
    const res = await volunteersRepository.assignProgram(parsed.data);
    if (res.data) {
      const volRes = await volunteersRepository.findById(parsed.data.volunteer_id);
      if (volRes.data?.profile_id) {
        await this.notifyUser(
          volRes.data.profile_id,
          'Assignment Notification',
          `You have been assigned to a new program as ${parsed.data.role}.`,
          'assignment_notification',
          '/volunteers/dashboard'
        );
      }
    }
    return fromRepo(res);
  }

  async assignToEvent(dto: unknown): Promise<ServiceResult<EventVolunteerRow>> {
    const parsed = assignEventSchema.safeParse(dto);
    if (!parsed.success) return fail(parsed.error.issues.map((e: { message: string }) => e.message).join(', '));
    const res = await volunteersRepository.assignEvent(parsed.data);
    if (res.data) {
      const volRes = await volunteersRepository.findById(parsed.data.volunteer_id);
      if (volRes.data?.profile_id) {
        await this.notifyUser(
          volRes.data.profile_id,
          'Assignment Notification',
          `You have been assigned to a new event as ${parsed.data.role}.`,
          'assignment_notification',
          '/volunteers/dashboard'
        );
      }
    }
    return fromRepo(res);
  }

  async logHours(dto: unknown): Promise<ServiceResult<VolunteerRow>> {
    const parsed = logVolunteerHoursSchema.safeParse(dto);
    if (!parsed.success) return fail(parsed.error.issues.map((e: { message: string }) => e.message).join(', '));
    const res = await volunteersRepository.logHours(parsed.data);
    if (res.data?.profile_id) {
      await this.notifyUser(
        res.data.profile_id,
        'Volunteer Hours Updated',
        `We have logged ${parsed.data.hours} volunteer hours to your profile.`,
        'hours_logged',
        '/volunteers/dashboard'
      );
    }
    return fromRepo(res);
  }

  async uploadCertificate(dto: unknown): Promise<ServiceResult<VolunteerDocumentRow>> {
    const parsed = uploadCertificateSchema.safeParse(dto);
    if (!parsed.success) return fail(parsed.error.issues.map((e: { message: string }) => e.message).join(', '));
    const res = await volunteersRepository.addCertificate(parsed.data);
    if (res.data) {
      const volRes = await volunteersRepository.findById(parsed.data.volunteer_id);
      if (volRes.data?.profile_id) {
        await this.notifyUser(
          volRes.data.profile_id,
          'Certificate Available',
          `A new certificate "${parsed.data.title}" is now available in your volunteer dashboard.`,
          'certificate_available',
          '/volunteers/dashboard'
        );
      }
    }
    return fromRepo(res);
  }

  async getDashboard(userId: string): Promise<ServiceResult<VolunteerDashboardData>> {
    return fromRepo(await volunteersRepository.getDashboardData(userId));
  }

  async export(filters?: Record<string, unknown>): Promise<ServiceResult<VolunteerRow[]>> {
    return fromRepo(await volunteersRepository.exportVolunteers(filters));
  }

  private async notifyUser(userId: string, title: string, message: string, type: string, actionUrl?: string): Promise<void> {
    try {
      const supabase = createAdminClient();
      await (supabase.from('notifications') as any).insert({
        id: crypto.randomUUID(),
        user_id: userId,
        type,
        title,
        message,
        action_url: actionUrl || null,
        created_at: new Date().toISOString(),
      } as any);
    } catch {
      // Non-blocking notification failure
    }
  }

  private async notifyByEmail(email: string, title: string, message: string, type: string, actionUrl?: string): Promise<void> {
    try {
      const supabase = createAdminClient();
      const { data: profile } = await (supabase.from('profiles') as any)
        .select('id')
        .eq('email', email)
        .single();
      if (profile?.id) {
        await this.notifyUser(profile.id, title, message, type, actionUrl);
      }
    } catch {
      // Non-blocking notification failure
    }
  }
}

export const volunteersService = new VolunteersService();

