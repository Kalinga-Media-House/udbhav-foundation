import type { IWriteRepository, ISearchableRepository, PaginatedResult, RepositoryResult, SortConfig, FilterMap } from '@/contracts/repositories';
import { DatabaseError } from '@/errors';
import { serverLogger } from "@/lib/logger/server-logger";
import { createAdminClient } from '@/lib/supabase/admin';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { Pagination, ID } from '@/types';
import type { Database } from '@/types/database/database.generated';

export type VolunteerRow = Database['public']['Tables']['volunteers']['Row'] & {
  total_hours?: number;
  event_count?: number;
  bio?: string | null;
  motivation?: string | null;
  availability?: string | null;
};

export type VolunteerCreate = Database['public']['Tables']['volunteers']['Insert'];
export type VolunteerUpdate = Database['public']['Tables']['volunteers']['Update'];

export type VolunteerApplicationRow = {
  id: string;
  full_name: string;
  email: string;
  mobile_number: string;
  age: number | null;
  occupation: string;
  city_district: string;
  state: string;
  preferred_areas: string[];
  skills: string | null;
  availability: string;
  motivation: string;
  consent: boolean;
  status: string;
  notes: string | null;
  profile_picture_url: string | null;
  blood_group: string | null;
  public_bio: string | null;
  volunteer_role: string | null;
  is_publicly_visible: boolean;
  reviewed_at: string | null;
  created_at: string;
  updated_at: string;
};

export type VolunteerApplicationCreate = Omit<VolunteerApplicationRow, 'id' | 'created_at'>;

export type ProgramVolunteerRow = {
  id: string;
  program_id: string;
  volunteer_id: string;
  role: string;
  status: string;
  start_date: string;
  end_date?: string | null;
  hours_contributed: number;
  created_at: string;
};

export type EventVolunteerRow = {
  id: string;
  event_id: string;
  volunteer_id: string;
  role: string;
  hours_logged: number;
  attendance_status: string;
  created_at: string;
};

export type VolunteerDocumentRow = {
  id: string;
  volunteer_id: string;
  document_type: string;
  media_file_id: string;
  issue_date: string | null;
  verification_status: string;
  created_at: string;
};

export type VolunteerDashboardData = {
  volunteer: VolunteerRow;
  profile: Record<string, unknown> | null;
  programs: ProgramVolunteerRow[];
  events: EventVolunteerRow[];
  certificates: VolunteerDocumentRow[];
  totalHours: number;
};

export class VolunteersRepository implements IWriteRepository<VolunteerRow, VolunteerCreate, VolunteerUpdate>, ISearchableRepository<VolunteerRow> {
  /**
   * Finds a volunteer record by its unique ID.
   * @param id - The unique identifier of the volunteer.
   * @returns A promise resolving to the repository result containing the volunteer row.
   */
  async findById(id: ID): Promise<RepositoryResult<VolunteerRow>> {
    try {
      const supabase = await createServerSupabaseClient();
      const { data, error } = await supabase.from('volunteers').select('*').eq('id', id).eq('is_deleted', false).single();
      if (error) throw new DatabaseError(error.message);
      return { data, error: null };
    } catch (error) {
      serverLogger.error('VolunteersRepository.findById failed', error as Error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Finds a volunteer record by profile ID.
   * @param profileId - The profile ID associated with the volunteer.
   * @returns A promise resolving to the repository result containing the volunteer row.
   */
  async findByProfile(profileId: ID): Promise<RepositoryResult<VolunteerRow>> {
    try {
      const supabase = await createServerSupabaseClient();
      const { data, error } = await supabase.from('volunteers').select('*').eq('profile_id', profileId).eq('is_deleted', false).single();
      if (error) throw new DatabaseError(error.message);
      return { data, error: null };
    } catch (error) {
      serverLogger.error('VolunteersRepository.findByProfile failed', error as Error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Retrieves a paginated list of volunteer records filtered and sorted according to query options.
   * @param params - Object containing pagination, sorting, and filtering parameters.
   * @returns A promise resolving to a paginated result of volunteer rows.
   */
  async findMany(params: { pagination: Pagination; sort?: SortConfig; filters?: FilterMap }): Promise<PaginatedResult<VolunteerRow>> {
    const { pagination, sort, filters } = params;
    const supabase = await createServerSupabaseClient();
    let query = supabase.from('volunteers').select('*', { count: 'exact' }).eq('is_deleted', false);
    if (filters?.status) query = query.eq('status', filters.status as any);
    if (filters?.volunteer_type) query = (query as any).eq('volunteer_type', filters.volunteer_type as string);
    const sortCol = sort?.column ?? 'created_at';
    query = query.order(sortCol, { ascending: sort?.order === 'asc' });
    const from = (pagination.page - 1) * pagination.limit;
    query = query.range(from, from + pagination.limit - 1);
    const { data, count, error } = await query;
    if (error) serverLogger.error('VolunteersRepository.findMany failed', new DatabaseError(error.message));
    return { data: data ?? [], total: count ?? 0, page: pagination.page, limit: pagination.limit };
  }

  /**
   * Creates a new volunteer record in the database.
   * @param data - The data required to create a new volunteer.
   * @returns A promise resolving to the repository result containing the newly created volunteer row.
   */
  async create(data: VolunteerCreate): Promise<RepositoryResult<VolunteerRow>> {
    try {
      const supabase = await createServerSupabaseClient();
      const { data: row, error } = await (supabase.from('volunteers') as any).insert(data as any).select().single();
      if (error) throw new DatabaseError(error.message);
      return { data: row, error: null };
    } catch (error) {
      serverLogger.error('VolunteersRepository.create failed', error as Error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Updates an existing volunteer record by ID.
   * @param id - The ID of the volunteer to update.
   * @param data - Partial fields to update in the volunteer record.
   * @returns A promise resolving to the repository result containing the updated volunteer row.
   */
  async update(id: ID, data: VolunteerUpdate): Promise<RepositoryResult<VolunteerRow>> {
    try {
      const supabase = await createServerSupabaseClient();
      const { data: row, error } = await (supabase.from('volunteers') as any).update(data as any).eq('id', id).eq('is_deleted', false).select().single();
      if (error) throw new DatabaseError(error.message);
      return { data: row, error: null };
    } catch (error) {
      serverLogger.error('VolunteersRepository.update failed', error as Error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Soft deletes a volunteer record by marking it as deleted.
   * @param id - The ID of the volunteer record to soft delete.
   * @param deletedBy - The user ID performing the soft deletion.
   * @returns A promise resolving to the repository result containing the soft-deleted volunteer row.
   */
  async softDelete(id: ID, deletedBy: ID): Promise<RepositoryResult<VolunteerRow>> {
    try {
      const supabase = await createServerSupabaseClient();
      const { data: row, error } = await (supabase.from('volunteers') as any).update({ is_deleted: true, deleted_by: deletedBy, deleted_at: new Date().toISOString() } as any).eq('id', id).select().single();
      if (error) throw new DatabaseError(error.message);
      return { data: row, error: null };
    } catch (error) {
      serverLogger.error('VolunteersRepository.softDelete failed', error as Error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Restores a soft-deleted volunteer record.
   * @param id - The ID of the volunteer record to restore.
   * @returns A promise resolving to the repository result containing the restored volunteer row.
   */
  async restore(id: ID): Promise<RepositoryResult<VolunteerRow>> {
    try {
      const supabase = await createServerSupabaseClient();
      const { data: row, error } = await (supabase.from('volunteers') as any).update({ is_deleted: false, deleted_at: null, deleted_by: null } as any).eq('id', id).select().single();
      if (error) throw new DatabaseError(error.message);
      return { data: row, error: null };
    } catch (error) {
      serverLogger.error('VolunteersRepository.restore failed', error as Error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Performs full-text search across volunteer records.
   * @param query - The search query string.
   * @param pagination - Pagination details for search results.
   * @returns A promise resolving to a paginated result of volunteer rows matching search criteria.
   */
  async search(query: string, pagination: Pagination): Promise<PaginatedResult<VolunteerRow>> {
    const supabase = await createServerSupabaseClient();
    const from = (pagination.page - 1) * pagination.limit;
    const { data, count, error } = await supabase.from('volunteers').select('*', { count: 'exact' }).eq('is_deleted', false).textSearch('search_vector', query, { type: 'websearch' }).range(from, from + pagination.limit - 1);
    if (error) serverLogger.error('VolunteersRepository.search failed', new DatabaseError(error.message));
    return { data: data ?? [], total: count ?? 0, page: pagination.page, limit: pagination.limit };
  }

  /**
   * Checks if a volunteer application already exists with the given mobile number or email.
   * Uses createAdminClient to bypass RLS for the lookup.
   * @param mobileNumber - Normalized 10-digit mobile number.
   * @param email - Normalized lowercase email.
   * @returns The existing application row if found, null otherwise.
   */
  async findExistingApplication(mobileNumber: string, email: string): Promise<VolunteerApplicationRow | null> {
    try {
      const supabase = createAdminClient();
      const { data, error } = await (supabase as any)
        .from('volunteer_applications')
        .select('*')
        .or(`mobile_number.eq.${mobileNumber},email.eq.${email}`)
        .limit(1)
        .maybeSingle();
      if (error) {
        serverLogger.error('VolunteersRepository.findExistingApplication failed', new DatabaseError(error.message));
        return null;
      }
      return data || null;
    } catch (error) {
      serverLogger.error('VolunteersRepository.findExistingApplication failed', error as Error);
      return null;
    }
  }

  /**
   * Submits a new volunteer application from the public website.
   * Uses createAdminClient to reliably insert applications regardless of RLS context.
   * Handles unique constraint violations gracefully for race-condition protection.
   * @param data - The volunteer application data.
   * @returns A promise resolving to the repository result containing the created application row.
   */
  async createApplication(data: VolunteerApplicationCreate): Promise<RepositoryResult<VolunteerApplicationRow>> {
    try {
      const supabase = createAdminClient();
      const { data: row, error } = await (supabase as any).from('volunteer_applications').insert(data as any).select().single();
      if (error) {
        // Detect unique constraint violation (PostgreSQL error code 23505)
        if (error.code === '23505' || error.message?.includes('duplicate key') || error.message?.includes('unique constraint')) {
          throw new DatabaseError('DUPLICATE_APPLICATION');
        }
        throw new DatabaseError(error.message);
      }
      return { data: row, error: null };
    } catch (error) {
      serverLogger.error('VolunteersRepository.createApplication failed', error as Error);
      return { data: null, error: error as Error };
    }
  }

  async listApplications(params: { pagination: Pagination; status?: string }): Promise<PaginatedResult<VolunteerApplicationRow>> {
    const { pagination, status } = params;
    const supabase = createAdminClient();
    let query = (supabase as any).from('volunteer_applications').select('*', { count: 'exact' });
    if (status && status !== 'all') {
      query = query.eq('status', status);
    }
    query = query.order('created_at', { ascending: false });
    const from = (pagination.page - 1) * pagination.limit;
    query = query.range(from, from + pagination.limit - 1);
    const { data, count, error } = await query;
    if (error) serverLogger.error('VolunteersRepository.listApplications failed', new DatabaseError(error.message));
    return { data: data ?? [], total: count ?? 0, page: pagination.page, limit: pagination.limit };
  }

  async updateApplicationStatus(id: ID, status: string, notes?: string): Promise<RepositoryResult<VolunteerApplicationRow>> {
    try {
      const supabase = createAdminClient();
      const updateData: Record<string, unknown> = { status };
      if (notes !== undefined) updateData.notes = notes;
      const { data: row, error } = await (supabase as any).from('volunteer_applications')
        .update(updateData as any)
        .eq('id', id)
        .select()
        .single();
      if (error) throw new DatabaseError(error.message);
      return { data: row, error: null };
    } catch (error) {
      serverLogger.error('VolunteersRepository.updateApplicationStatus failed', error as Error);
      return { data: null, error: error as Error };
    }
  }

  async updateApplicationProfile(id: ID, data: Partial<VolunteerApplicationRow>): Promise<RepositoryResult<VolunteerApplicationRow>> {
    try {
      const supabase = createAdminClient();
      const { data: row, error } = await (supabase as any).from('volunteer_applications')
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      if (error) throw new DatabaseError(error.message);
      return { data: row, error: null };
    } catch (error) {
      serverLogger.error('VolunteersRepository.updateApplicationProfile failed', error as Error);
      return { data: null, error: error as Error };
    }
  }

  async listPublicProfiles(params: { pagination: Pagination; filters?: Record<string, unknown> }): Promise<PaginatedResult<Partial<VolunteerApplicationRow>>> {
    const { pagination, filters } = params;
    const supabase = createAdminClient();
    let query = (supabase as any)
      .from('volunteer_applications')
      .select('id, full_name, profile_picture_url, occupation, city_district, state, preferred_areas, skills, public_bio, volunteer_role', { count: 'exact' })
      .eq('status', 'accepted')
      .eq('is_publicly_visible', true);

    if (filters?.search && typeof filters.search === 'string') {
      const q = filters.search;
      query = query.or(`full_name.ilike.%${q}%,occupation.ilike.%${q}%,skills.ilike.%${q}%,volunteer_role.ilike.%${q}%,city_district.ilike.%${q}%,state.ilike.%${q}%`);
    }

    query = query.order('created_at', { ascending: false });
    const from = (pagination.page - 1) * pagination.limit;
    query = query.range(from, from + pagination.limit - 1);
    
    const { data, count, error } = await query;
    if (error) serverLogger.error('VolunteersRepository.listPublicProfiles failed', new DatabaseError(error.message));
    return { data: data ?? [], total: count ?? 0, page: pagination.page, limit: pagination.limit };
  }

  async exportApplications(filters?: Record<string, unknown>): Promise<RepositoryResult<VolunteerApplicationRow[]>> {
    try {
      const supabase = createAdminClient();
      let query = (supabase as any)
        .from('volunteer_applications')
        .select('*');

      if (filters?.status && filters.status !== 'all') {
        query = query.eq('status', filters.status as string);
      }

      const { data, error } = await query.order('created_at', { ascending: false });
      if (error) throw new DatabaseError(error.message);
      return { data: data ?? [], error: null };
    } catch (error) {
      serverLogger.error('VolunteersRepository.exportApplications failed', error as Error);
      return { data: null, error: error as Error };
    }
  }

  async generateVolunteerCode(): Promise<string> {
    const year = new Date().getFullYear();
    const randomSuffix = String(Math.floor(Math.random() * 9000) + 1000);
    return `UDV-${year}-${randomSuffix}`;
  }

  async findByCode(code: string): Promise<RepositoryResult<VolunteerRow>> {
    try {
      const supabase = await createServerSupabaseClient();
      const { data, error } = await supabase
        .from('volunteers')
        .select('*')
        .eq('volunteer_code', code)
        .eq('is_deleted', false)
        .single();
      if (error) throw new DatabaseError(error.message);
      return { data, error: null };
    } catch (error) {
      serverLogger.error('VolunteersRepository.findByCode failed', error as Error);
      return { data: null, error: error as Error };
    }
  }

  async listPublicVolunteers(params: { pagination: Pagination; filters?: Record<string, unknown> }): Promise<PaginatedResult<VolunteerRow>> {
    const { pagination, filters } = params;
    const supabase = await createServerSupabaseClient();
    let query = supabase
      .from('volunteers')
      .select('*', { count: 'exact' })
      .eq('is_deleted', false)
      .in('status', ['Active', 'Verified']);

    if (filters?.volunteer_type && filters.volunteer_type !== 'all') {
      query = (query as any).eq('volunteer_type', filters.volunteer_type as string);
    }
    if (filters?.search && typeof filters.search === 'string') {
      query = query.ilike('bio', `%${filters.search}%`);
    }

    query = query.order('created_at', { ascending: false });
    const from = (pagination.page - 1) * pagination.limit;
    query = query.range(from, from + pagination.limit - 1);
    const { data, count, error } = await query;
    if (error) serverLogger.error('VolunteersRepository.listPublicVolunteers failed', new DatabaseError(error.message));
    return { data: data ?? [], total: count ?? 0, page: pagination.page, limit: pagination.limit };
  }

  async assignProgram(data: { program_id: string; volunteer_id: string; role: string; start_date?: string }): Promise<RepositoryResult<ProgramVolunteerRow>> {
    try {
      const supabase = createAdminClient();
      const rowData = {
        program_id: data.program_id,
        volunteer_id: data.volunteer_id,
        role: data.role || 'Volunteer',
        status: 'active',
        start_date: data.start_date || new Date().toISOString().split('T')[0],
        hours_contributed: 0,
      };
      const { data: row, error } = await (supabase.from('program_volunteers') as any)
        .insert(rowData as any)
        .select()
        .single();
      if (error) throw new DatabaseError(error.message);
      return { data: row, error: null };
    } catch (error) {
      serverLogger.error('VolunteersRepository.assignProgram failed', error as Error);
      return { data: null, error: error as Error };
    }
  }

  async assignEvent(data: { event_id: string; volunteer_id: string; role: string }): Promise<RepositoryResult<EventVolunteerRow>> {
    try {
      const supabase = createAdminClient();
      const rowData = {
        event_id: data.event_id,
        volunteer_id: data.volunteer_id,
        role: data.role || 'Event Staff',
        attendance_status: 'scheduled',
        hours_logged: 0,
      };
      const { data: row, error } = await (supabase.from('event_volunteers') as any)
        .insert(rowData as any)
        .select()
        .single();
      if (error) throw new DatabaseError(error.message);
      return { data: row, error: null };
    } catch (error) {
      serverLogger.error('VolunteersRepository.assignEvent failed', error as Error);
      return { data: null, error: error as Error };
    }
  }

  async logHours(data: { volunteer_id: string; program_id?: string; event_id?: string; hours: number; notes?: string }): Promise<RepositoryResult<VolunteerRow>> {
    try {
      const supabase = createAdminClient();
      if (data.program_id) {
        const { data: existing } = await (supabase.from('program_volunteers') as any)
          .select('id, hours_contributed')
          .eq('program_id', data.program_id)
          .eq('volunteer_id', data.volunteer_id)
          .single();
        if (existing) {
          await (supabase.from('program_volunteers') as any)
            .update({ hours_contributed: (existing.hours_contributed || 0) + data.hours } as any)
            .eq('id', existing.id);
        }
      }
      if (data.event_id) {
        const { data: existing } = await (supabase.from('event_volunteers') as any)
          .select('id, hours_logged')
          .eq('event_id', data.event_id)
          .eq('volunteer_id', data.volunteer_id)
          .single();
        if (existing) {
          await (supabase.from('event_volunteers') as any)
            .update({ hours_logged: (existing.hours_logged || 0) + data.hours, attendance_status: 'present' } as any)
            .eq('id', existing.id);
        }
      }
      const { data: vol } = await (supabase.from('volunteers') as any)
        .select('*')
        .eq('id', data.volunteer_id)
        .single();
      if (!vol) throw new DatabaseError('Volunteer not found');

      const volAny = vol as any;
      const existingLogs = Array.isArray(volAny.metadata?.activity_logs) ? volAny.metadata.activity_logs : [];
      const newLog = {
        id: crypto.randomUUID(),
        hours: data.hours,
        program_id: data.program_id || null,
        event_id: data.event_id || null,
        notes: data.notes || 'Volunteer hours logged',
        created_at: new Date().toISOString(),
      };
      const updatedLogs = [newLog, ...existingLogs];
      const totalHours = (volAny.total_hours || 0) + data.hours;

      const { data: updatedVol, error } = await (supabase.from('volunteers') as any)
        .update({
          total_hours: totalHours,
          metadata: { ...volAny.metadata, activity_logs: updatedLogs },
        } as any)
        .eq('id', data.volunteer_id)
        .select()
        .single();
      if (error) throw new DatabaseError(error.message);
      return { data: updatedVol, error: null };
    } catch (error) {
      serverLogger.error('VolunteersRepository.logHours failed', error as Error);
      return { data: null, error: error as Error };
    }
  }

  async addCertificate(data: { volunteer_id: string; title: string; media_file_id: string; issue_date?: string }): Promise<RepositoryResult<VolunteerDocumentRow>> {
    try {
      const supabase = createAdminClient();
      const rowData = {
        volunteer_id: data.volunteer_id,
        document_type: 'Certificate',
        media_file_id: data.media_file_id,
        issue_date: data.issue_date || new Date().toISOString().split('T')[0],
        verification_status: 'verified',
      };
      const { data: row, error } = await (supabase.from('volunteer_documents') as any)
        .insert(rowData as any)
        .select()
        .single();
      if (error) throw new DatabaseError(error.message);
      return { data: row, error: null };
    } catch (error) {
      serverLogger.error('VolunteersRepository.addCertificate failed', error as Error);
      return { data: null, error: error as Error };
    }
  }

  async getDashboardData(userId: string): Promise<RepositoryResult<VolunteerDashboardData>> {
    try {
      const supabase = await createServerSupabaseClient();
      let volRes = await (supabase.from('volunteers') as any)
        .select('*')
        .eq('profile_id', userId)
        .eq('is_deleted', false)
        .single();

      if (volRes.error || !volRes.data) {
        volRes = await (supabase.from('volunteers') as any)
          .select('*')
          .eq('id', userId)
          .eq('is_deleted', false)
          .single();
      }

      if (volRes.error || !volRes.data) {
        throw new DatabaseError('Volunteer profile not found');
      }

      const volunteer = volRes.data as any;
      const [profileRes, programsRes, eventsRes, certsRes] = await Promise.all([
        (supabase.from('profiles') as any).select('*').eq('id', volunteer.profile_id).single(),
        (supabase.from('program_volunteers') as any).select('*').eq('volunteer_id', volunteer.id),
        (supabase.from('event_volunteers') as any).select('*').eq('volunteer_id', volunteer.id),
        (supabase.from('volunteer_documents') as any).select('*').eq('volunteer_id', volunteer.id).eq('document_type', 'Certificate'),
      ]);

      const totalHours = volunteer.total_hours || 0;
      return {
        data: {
          volunteer,
          profile: profileRes.data || null,
          programs: programsRes.data || [],
          events: eventsRes.data || [],
          certificates: certsRes.data || [],
          totalHours,
        },
        error: null,
      };
    } catch (error) {
      serverLogger.error('VolunteersRepository.getDashboardData failed', error as Error);
      return { data: null, error: error as Error };
    }
  }

  async exportVolunteers(filters?: Record<string, unknown>): Promise<RepositoryResult<VolunteerRow[]>> {
    try {
      const supabase = createAdminClient();
      let query = supabase
        .from('volunteers')
        .select('id, volunteer_code, status, biography, created_at')
        .eq('is_deleted', false);

      if (filters?.status && filters.status !== 'all') {
        query = (query as any).eq('status', filters.status as string);
      }
      if (filters?.volunteer_type && filters.volunteer_type !== 'all') {
        query = (query as any).eq('volunteer_type', filters.volunteer_type as string);
      }

      const { data, error } = await query.order('created_at', { ascending: false });
      if (error) throw new DatabaseError(error.message);
      return { data: (data as any) ?? [], error: null };
    } catch (error) {
      serverLogger.error('VolunteersRepository.exportVolunteers failed', error as Error);
      return { data: null, error: error as Error };
    }
  }
}

export const volunteersRepository = new VolunteersRepository();

