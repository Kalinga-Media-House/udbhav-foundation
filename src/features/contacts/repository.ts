import type { PaginatedResult, RepositoryResult, FilterMap } from '@/contracts/repositories';
import { DatabaseError } from '@/errors';
import { serverLogger } from '@/lib/logger/server-logger';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { Pagination, ID } from '@/types';

export type EnquiryRow = {
  id: string;
  enquiry_number: string;
  contact_id: string;
  subject: string;
  message: string;
  department: string;
  category: string;
  priority: string;
  status: string;
  source: string;
  channel: string | null;
  assigned_to: string | null;
  assigned_by: string | null;
  assignment_time: string | null;
  resolved_by: string | null;
  resolved_at: string | null;
  first_response_time: string | null;
  expected_resolution: string | null;
  escalation_level: number;
  ip_address: string | null;
  user_agent: string | null;
  metadata: Record<string, unknown>;
  created_by: string | null;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
};

export type EnquiryCreate = Omit<
  EnquiryRow,
  'id' | 'created_at' | 'updated_at' | 'is_deleted' | 'expected_resolution' | 'escalation_level'
>;

export type OrganizationRow = {
  id: string;
  org_number: string;
  parent_organization_id: string | null;
  name: string;
  organization_type: string;
  website: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  district: string | null;
  state: string | null;
  country: string | null;
  logo_media_id: string | null;
  status: string;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
};

export type ContactTypeRow = {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  color: string | null;
  display_order: number;
  is_active: boolean;
};

export type ContactRow = {
  id: string;
  contact_number: string;
  profile_id: string | null;
  full_name: string;
  organization_id: string | null;
  designation: string | null;
  email: string | null;
  phone: string | null;
  alternate_phone: string | null;
  address: string | null;
  city: string | null;
  district: string | null;
  state: string | null;
  country: string | null;
  website: string | null;
  social_links: Record<string, unknown>;
  preferred_contact_method: string | null;
  preferred_language: string | null;
  photo_media_id: string | null;
  status: string;
  is_deleted: boolean;
  notes: string | null;
  created_by: string | null;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
};

export type ContactInteractionRow = {
  id: string;
  contact_id: string;
  interaction_type: string;
  description: string;
  interaction_date: string;
  created_by: string | null;
  created_at: string;
};

export type ContactRelationshipRow = {
  id: string;
  contact_id: string;
  contact_type_id: string;
  started_at: string;
  ended_at: string | null;
  status: string;
  created_by: string | null;
};

export type LinkedRecordRow = {
  id: string;
  contact_id: string;
  module_name: string;
  record_type: string;
  record_id: string;
  created_at: string;
};

export type ContactNoteRow = {
  id: string;
  contact_id: string;
  note_content: string;
  is_pinned: boolean;
  note_type: string;
  created_by: string | null;
  created_at: string;
};

export type ContactCreate = Omit<
  ContactRow,
  'id' | 'contact_number' | 'is_deleted' | 'created_at' | 'updated_at' | 'created_by' | 'updated_by'
>;

export type OrganizationCreate = Omit<
  OrganizationRow,
  'id' | 'org_number' | 'is_deleted' | 'created_at' | 'updated_at'
>;


export type TagRow = {
  id: string;
  name: string;
  slug: string;
  color: string | null;
  icon: string | null;
  display_order: number;
  is_active: boolean;
};

export type ContactTypeCreate = Omit<ContactTypeRow, 'id'>;
export type TagCreate = Omit<TagRow, 'id'>;

export class ContactsRepository {
  async findEnquiryById(id: ID): Promise<RepositoryResult<EnquiryRow>> {
    try {
      const supabase = await createServerSupabaseClient();
      const { data, error } = await supabase.from('enquiries').select('*').eq('id', id).eq('is_deleted', false).single();
      if (error) throw new DatabaseError(error.message);
      return { data, error: null };
    } catch (error) {
      serverLogger.error('ContactsRepository.findEnquiryById failed', error as Error);
      return { data: null, error: error as Error };
    }
  }

  async listEnquiries(params: { pagination: Pagination; filters?: FilterMap }): Promise<PaginatedResult<EnquiryRow>> {
    const { pagination, filters } = params;
    const supabase = await createServerSupabaseClient();
    let query = supabase.from('enquiries').select('*', { count: 'exact' }).eq('is_deleted', false);
    if (filters?.status) query = query.eq('status', filters.status as string);
    if (filters?.department) query = query.eq('department', filters.department as string);
    if (filters?.priority) query = query.eq('priority', filters.priority as string);
    if (filters?.assigned_to) query = query.eq('assigned_to', filters.assigned_to as string);
    query = query.order('created_at', { ascending: false });
    const from = (pagination.page - 1) * pagination.limit;
    query = query.range(from, from + pagination.limit - 1);
    const { data, count, error } = await query;
    if (error) serverLogger.error('ContactsRepository.listEnquiries failed', new DatabaseError(error.message));
    return { data: data ?? [], total: count ?? 0, page: pagination.page, limit: pagination.limit };
  }

  async createEnquiry(data: EnquiryCreate): Promise<RepositoryResult<EnquiryRow>> {
    try {
      const supabase = await createServerSupabaseClient();
      const { data: row, error } = await (supabase.from('enquiries') as any).insert(data as any).select().single();
      if (error) throw new DatabaseError(error.message);
      return { data: row, error: null };
    } catch (error) {
      serverLogger.error('ContactsRepository.createEnquiry failed', error as Error);
      return { data: null, error: error as Error };
    }
  }

  async updateEnquiryStatus(id: ID, status: string, userId: ID): Promise<RepositoryResult<EnquiryRow>> {
    try {
      const supabase = await createServerSupabaseClient();
      const updates: Record<string, unknown> = { status, updated_by: userId };
      if (status === 'Resolved') {
        updates.resolved_by = userId;
        updates.resolved_at = new Date().toISOString();
      }
      const { data: row, error } = await (supabase.from('enquiries') as any).update(updates).eq('id', id).select().single();
      if (error) throw new DatabaseError(error.message);
      return { data: row, error: null };
    } catch (error) {
      serverLogger.error('ContactsRepository.updateEnquiryStatus failed', error as Error);
      return { data: null, error: error as Error };
    }
  }

  async assignEnquiry(id: ID, assignedTo: ID, assignedBy: ID): Promise<RepositoryResult<EnquiryRow>> {
    try {
      const supabase = await createServerSupabaseClient();
      const { data: row, error } = await (supabase.from('enquiries') as any).update({
        assigned_to: assignedTo,
        assigned_by: assignedBy,
        assignment_time: new Date().toISOString(),
        status: 'Assigned',
      }).eq('id', id).select().single();
      if (error) throw new DatabaseError(error.message);
      return { data: row, error: null };
    } catch (error) {
      serverLogger.error('ContactsRepository.assignEnquiry failed', error as Error);
      return { data: null, error: error as Error };
    }
  }

  async searchEnquiries(query: string, pagination: Pagination): Promise<PaginatedResult<EnquiryRow>> {
    const supabase = await createServerSupabaseClient();
    const from = (pagination.page - 1) * pagination.limit;
    const { data, count, error } = await supabase.from('enquiries').select('*', { count: 'exact' })
      .eq('is_deleted', false).textSearch('search_vector', query, { type: 'websearch' })
      .range(from, from + pagination.limit - 1);
    if (error) serverLogger.error('ContactsRepository.searchEnquiries failed', new DatabaseError(error.message));
    return { data: data ?? [], total: count ?? 0, page: pagination.page, limit: pagination.limit };
  }

  async createContact(data: ContactCreate): Promise<RepositoryResult<ContactRow>> {
    try {
      const supabase = await createServerSupabaseClient();
      const { data: row, error } = await (supabase.from('contacts') as any).insert(data as any).select().single();
      if (error) throw new DatabaseError(error.message);
      return { data: row, error: null };
    } catch (error) {
      serverLogger.error('ContactsRepository.createContact failed', error as Error);
      return { data: null, error: error as Error };
    }
  }

  async updateContact(id: ID, data: Partial<ContactRow>): Promise<RepositoryResult<ContactRow>> {
    try {
      const supabase = await createServerSupabaseClient();
      const { data: row, error } = await (supabase.from('contacts') as any).update(data as any).eq('id', id).select().single();
      if (error) throw new DatabaseError(error.message);
      return { data: row, error: null };
    } catch (error) {
      serverLogger.error('ContactsRepository.updateContact failed', error as Error);
      return { data: null, error: error as Error };
    }
  }

  async getContact(id: ID): Promise<RepositoryResult<ContactRow>> {
    try {
      const supabase = await createServerSupabaseClient();
      const { data, error } = await supabase.from('contacts').select('*').eq('id', id).eq('is_deleted', false).single();
      if (error) throw new DatabaseError(error.message);
      return { data, error: null };
    } catch (error) {
      serverLogger.error('ContactsRepository.getContact failed', error as Error);
      return { data: null, error: error as Error };
    }
  }

  async listContacts(params: { pagination: Pagination; filters?: FilterMap }): Promise<PaginatedResult<ContactRow>> {
    const { pagination, filters } = params;
    const supabase = await createServerSupabaseClient();
    let query = supabase.from('contacts').select('*', { count: 'exact' }).eq('is_deleted', false);
    if (filters?.status) query = query.eq('status', filters.status as string);
    if (filters?.organization_id) query = query.eq('organization_id', filters.organization_id as string);
    query = query.order('created_at', { ascending: false });
    const from = (pagination.page - 1) * pagination.limit;
    query = query.range(from, from + pagination.limit - 1);
    const { data, count, error } = await query;
    if (error) serverLogger.error('ContactsRepository.listContacts failed', new DatabaseError(error.message));
    return { data: data ?? [], total: count ?? 0, page: pagination.page, limit: pagination.limit };
  }

  async createOrganization(data: OrganizationCreate): Promise<RepositoryResult<OrganizationRow>> {
    try {
      const supabase = await createServerSupabaseClient();
      const { data: row, error } = await (supabase.from('organizations') as any).insert(data as any).select().single();
      if (error) throw new DatabaseError(error.message);
      return { data: row, error: null };
    } catch (error) {
      serverLogger.error('ContactsRepository.createOrganization failed', error as Error);
      return { data: null, error: error as Error };
    }
  }

  async updateOrganization(id: ID, data: Partial<OrganizationRow>): Promise<RepositoryResult<OrganizationRow>> {
    try {
      const supabase = await createServerSupabaseClient();
      const { data: row, error } = await (supabase.from('organizations') as any).update(data as any).eq('id', id).select().single();
      if (error) throw new DatabaseError(error.message);
      return { data: row, error: null };
    } catch (error) {
      serverLogger.error('ContactsRepository.updateOrganization failed', error as Error);
      return { data: null, error: error as Error };
    }
  }

  async getOrganization(id: ID): Promise<RepositoryResult<OrganizationRow>> {
    try {
      const supabase = await createServerSupabaseClient();
      const { data, error } = await supabase.from('organizations').select('*').eq('id', id).eq('is_deleted', false).single();
      if (error) throw new DatabaseError(error.message);
      return { data, error: null };
    } catch (error) {
      serverLogger.error('ContactsRepository.getOrganization failed', error as Error);
      return { data: null, error: error as Error };
    }
  }

  async listOrganizations(params: { pagination: Pagination; filters?: FilterMap }): Promise<PaginatedResult<OrganizationRow>> {
    const { pagination, filters } = params;
    const supabase = await createServerSupabaseClient();
    let query = supabase.from('organizations').select('*', { count: 'exact' }).eq('is_deleted', false);
    if (filters?.status) query = query.eq('status', filters.status as string);
    query = query.order('created_at', { ascending: false });
    const from = (pagination.page - 1) * pagination.limit;
    query = query.range(from, from + pagination.limit - 1);
    const { data, count, error } = await query;
    if (error) serverLogger.error('ContactsRepository.listOrganizations failed', new DatabaseError(error.message));
    return { data: data ?? [], total: count ?? 0, page: pagination.page, limit: pagination.limit };
  }

  async createContactNote(data: Omit<ContactNoteRow, 'id' | 'created_at'>): Promise<RepositoryResult<ContactNoteRow>> {
    try {
      const supabase = await createServerSupabaseClient();
      const { data: row, error } = await (supabase.from('contact_notes') as any).insert(data as any).select().single();
      if (error) throw new DatabaseError(error.message);
      return { data: row, error: null };
    } catch (error) {
      serverLogger.error('ContactsRepository.createContactNote failed', error as Error);
      return { data: null, error: error as Error };
    }
  }

  async createContactInteraction(data: Omit<ContactInteractionRow, 'id' | 'created_at'>): Promise<RepositoryResult<ContactInteractionRow>> {
    try {
      const supabase = await createServerSupabaseClient();
      const { data: row, error } = await (supabase.from('contact_interactions') as any).insert(data as any).select().single();
      if (error) throw new DatabaseError(error.message);
      return { data: row, error: null };
    } catch (error) {
      serverLogger.error('ContactsRepository.createContactInteraction failed', error as Error);
      return { data: null, error: error as Error };
    }
  }

  async mergeContacts(survivingId: ID, deletedId: ID, reason: string, userId: ID): Promise<RepositoryResult<boolean>> {
    try {
      const supabase = await createServerSupabaseClient();
      // Reparent foreign keys
      const tablesToUpdate = [
        'donations',
        'event_attendance',
        'program_members',
        'volunteers',
        'enquiries',
        'contact_notes',
        'contact_interactions',
        'linked_records',
        'contact_relationships'
      ];

      for (const table of tablesToUpdate) {
        await (supabase.from(table) as any).update({ contact_id: survivingId }).eq('contact_id', deletedId);
      }

      // Record in contact_merge_history
      await (supabase.from('contact_merge_history') as any).insert({
        surviving_contact_id: survivingId,
        deleted_contact_id: deletedId,
        reason: reason || 'Merged',
        merged_by: userId,
      });

      // Soft delete the deleted contact
      const { error } = await (supabase.from('contacts') as any).update({
        is_deleted: true,
        status: 'Merged',
        updated_by: userId,
      }).eq('id', deletedId);

      if (error) throw new DatabaseError(error.message);

      return { data: true, error: null };
    } catch (error) {
      serverLogger.error('ContactsRepository.mergeContacts failed', error as Error);
      return { data: null, error: error as Error };
    }
  }

  // Contact Types CRUD
  async listContactTypes(): Promise<RepositoryResult<ContactTypeRow[]>> {
    try {
      const supabase = await createServerSupabaseClient();
      const { data, error } = await (supabase.from('contact_types') as any).select('*').order('display_order', { ascending: true });
      if (error) return { data: null, error: new Error(error.message) };
      return { data: data as ContactTypeRow[], error: null };
    } catch (err: any) {
      serverLogger.error('Failed to list contact types', err);
      return { data: null, error: new Error('Database error') };
    }
  }

  async createContactType(data: ContactTypeCreate): Promise<RepositoryResult<ContactTypeRow>> {
    try {
      const supabase = await createServerSupabaseClient();
      const { data: created, error } = await (supabase.from('contact_types') as any).insert(data as any).select().single();
      if (error) return { data: null, error: new Error(error.message) };
      return { data: created as ContactTypeRow, error: null };
    } catch (err: any) {
      serverLogger.error('Failed to create contact type', err);
      return { data: null, error: new Error('Database error') };
    }
  }

  async updateContactType(id: ID, data: Partial<ContactTypeCreate>): Promise<RepositoryResult<ContactTypeRow>> {
    try {
      const supabase = await createServerSupabaseClient();
      const { data: updated, error } = await (supabase.from('contact_types') as any).update(data as any).eq('id', id).select().single();
      if (error) return { data: null, error: new Error(error.message) };
      return { data: updated as ContactTypeRow, error: null };
    } catch (err: any) {
      serverLogger.error('Failed to update contact type', err);
      return { data: null, error: new Error('Database error') };
    }
  }

  // Tags CRUD
  async listTags(): Promise<RepositoryResult<TagRow[]>> {
    try {
      const supabase = await createServerSupabaseClient();
      const { data, error } = await (supabase.from('tags') as any).select('*').order('display_order', { ascending: true });
      if (error) return { data: null, error: new Error(error.message) };
      return { data: data as TagRow[], error: null };
    } catch (err: any) {
      serverLogger.error('Failed to list tags', err);
      return { data: null, error: new Error('Database error') };
    }
  }

  async createTag(data: TagCreate): Promise<RepositoryResult<TagRow>> {
    try {
      const supabase = await createServerSupabaseClient();
      const { data: created, error } = await (supabase.from('tags') as any).insert(data as any).select().single();
      if (error) return { data: null, error: new Error(error.message) };
      return { data: created as TagRow, error: null };
    } catch (err: any) {
      serverLogger.error('Failed to create tag', err);
      return { data: null, error: new Error('Database error') };
    }
  }

  async updateTag(id: ID, data: Partial<TagCreate>): Promise<RepositoryResult<TagRow>> {
    try {
      const supabase = await createServerSupabaseClient();
      const { data: updated, error } = await (supabase.from('tags') as any).update(data as any).eq('id', id).select().single();
      if (error) return { data: null, error: new Error(error.message) };
      return { data: updated as TagRow, error: null };
    } catch (err: any) {
      serverLogger.error('Failed to update tag', err);
      return { data: null, error: new Error('Database error') };
    }
  }

  // Interactions Global List
  async listInteractions(params: { pagination: Pagination, filters?: Record<string, unknown> }): Promise<RepositoryResult<PaginatedResult<ContactInteractionRow>>> {
    try {
      const supabase = await createServerSupabaseClient();
      const { pagination } = params;
      let query = (supabase.from('contact_interactions') as any).select('*, contacts!inner(full_name, contact_number)', { count: 'exact' });
      
      const { page, limit } = pagination;
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      
      query = query.order('interaction_date', { ascending: false }).range(from, to);
      
      const { data, error, count } = await query;
      if (error) return { data: null, error: new Error(error.message) };
      
      return {
        data: { data: data as any[], total: count ?? 0, page, limit },
        error: null
      };
    } catch (err: any) {
      serverLogger.error('Failed to list interactions', err);
      return { data: null, error: new Error('Database error') };
    }
  }
}

export const contactsRepository = new ContactsRepository();

