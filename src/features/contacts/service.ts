import type { PaginatedResult } from '@/contracts/repositories';
import { ok, fail, fromRepo } from '@/contracts/services';
import type { ServiceResult } from '@/contracts/services';
import type { Pagination, ID } from '@/types';

import { contactsRepository } from './repository';
import type { ContactTypeRow, TagRow } from './repository';
import type { EnquiryRow, ContactRow, ContactCreate, OrganizationRow, OrganizationCreate, ContactNoteRow, ContactInteractionRow } from './repository';
import { createContactTypeSchema, updateContactTypeSchema, createTagSchema, updateTagSchema } from './validators';
import { createEnquirySchema, createContactSchema, updateContactSchema, createOrganizationSchema, updateOrganizationSchema, mergeContactsSchema, addNoteSchema, addInteractionSchema } from './validators';
import type { CreateContactTypeDTO, UpdateContactTypeDTO, CreateTagDTO, UpdateTagDTO } from './validators';
import type { CreateEnquiryDTO, CreateContactDTO, UpdateContactDTO, CreateOrganizationDTO, UpdateOrganizationDTO, MergeContactsDTO, AddNoteDTO, AddInteractionDTO } from './validators';

export class ContactsService {
  async getEnquiry(id: ID): Promise<ServiceResult<EnquiryRow>> {
    return fromRepo(await contactsRepository.findEnquiryById(id));
  }

  async listEnquiries(pagination: Pagination, filters?: Record<string, unknown>): Promise<ServiceResult<PaginatedResult<EnquiryRow>>> {
    return ok(await contactsRepository.listEnquiries({ pagination, filters }));
  }

  async createEnquiry(dto: CreateEnquiryDTO, userId: ID | null): Promise<ServiceResult<EnquiryRow>> {
    const parsed = createEnquirySchema.safeParse(dto);
    if (!parsed.success) return fail(parsed.error.issues.map((e: any) => e.message).join(', '));
    return fromRepo(
      await contactsRepository.createEnquiry({
        ...parsed.data,
        channel: parsed.data.channel ?? null,
        ip_address: parsed.data.ip_address ?? null,
        user_agent: parsed.data.user_agent ?? null,
        created_by: userId,
        updated_by: userId,
        assigned_to: null, assigned_by: null, assignment_time: null, resolved_by: null, resolved_at: null, first_response_time: null,
      } as any)
    );
  }

  async assignEnquiry(id: ID, assignedTo: ID, assignedBy: ID): Promise<ServiceResult<EnquiryRow>> {
    return fromRepo(await contactsRepository.assignEnquiry(id, assignedTo, assignedBy));
  }

  async resolveEnquiry(id: ID, userId: ID): Promise<ServiceResult<EnquiryRow>> {
    return fromRepo(await contactsRepository.updateEnquiryStatus(id, 'Resolved', userId));
  }

  async searchEnquiries(query: string, pagination: Pagination): Promise<ServiceResult<PaginatedResult<EnquiryRow>>> {
    return ok(await contactsRepository.searchEnquiries(query, pagination));
  }

  async getContact(id: ID): Promise<ServiceResult<ContactRow>> {
    return fromRepo(await contactsRepository.getContact(id));
  }

  async listContacts(pagination: Pagination, filters?: Record<string, unknown>): Promise<ServiceResult<PaginatedResult<ContactRow>>> {
    return ok(await contactsRepository.listContacts({ pagination, filters }));
  }

  async createContact(dto: CreateContactDTO): Promise<ServiceResult<ContactRow>> {
    const parsed = createContactSchema.safeParse(dto);
    if (!parsed.success) return fail(parsed.error.issues.map((e: any) => e.message).join(', '));
    const contactData: ContactCreate = {
      profile_id: null,
      full_name: parsed.data.full_name,
      organization_id: parsed.data.organization_id ?? null,
      designation: parsed.data.designation ?? null,
      email: parsed.data.email ?? null,
      phone: parsed.data.phone ?? null,
      alternate_phone: parsed.data.alternate_phone ?? null,
      address: parsed.data.address ?? null,
      city: parsed.data.city ?? null,
      district: parsed.data.district ?? null,
      state: parsed.data.state ?? null,
      country: parsed.data.country,
      website: null,
      social_links: {},
      preferred_contact_method: parsed.data.preferred_contact_method,
      preferred_language: parsed.data.preferred_language ?? null,
      photo_media_id: null,
      status: 'Active',
      notes: parsed.data.notes ?? null,
    };
    return fromRepo(await contactsRepository.createContact(contactData));
  }

  async updateContact(id: ID, dto: UpdateContactDTO): Promise<ServiceResult<ContactRow>> {
    const parsed = updateContactSchema.safeParse(dto);
    if (!parsed.success) return fail(parsed.error.issues.map((e: any) => e.message).join(', '));
    return fromRepo(await contactsRepository.updateContact(id, parsed.data));
  }

  async getOrganization(id: ID): Promise<ServiceResult<OrganizationRow>> {
    return fromRepo(await contactsRepository.getOrganization(id));
  }

  async listOrganizations(pagination: Pagination, filters?: Record<string, unknown>): Promise<ServiceResult<PaginatedResult<OrganizationRow>>> {
    return ok(await contactsRepository.listOrganizations({ pagination, filters }));
  }

  async createOrganization(dto: CreateOrganizationDTO): Promise<ServiceResult<OrganizationRow>> {
    const parsed = createOrganizationSchema.safeParse(dto);
    if (!parsed.success) return fail(parsed.error.issues.map((e: any) => e.message).join(', '));
    const orgData: OrganizationCreate = {
      parent_organization_id: parsed.data.parent_organization_id ?? null,
      name: parsed.data.name,
      organization_type: parsed.data.organization_type,
      website: parsed.data.website ?? null,
      email: parsed.data.email ?? null,
      phone: parsed.data.phone ?? null,
      address: parsed.data.address ?? null,
      district: parsed.data.district ?? null,
      state: parsed.data.state ?? null,
      country: parsed.data.country,
      logo_media_id: null,
      status: parsed.data.status,
    };
    return fromRepo(await contactsRepository.createOrganization(orgData));
  }

  async updateOrganization(id: ID, dto: UpdateOrganizationDTO): Promise<ServiceResult<OrganizationRow>> {
    const parsed = updateOrganizationSchema.safeParse(dto);
    if (!parsed.success) return fail(parsed.error.issues.map((e: any) => e.message).join(', '));
    return fromRepo(await contactsRepository.updateOrganization(id, parsed.data));
  }

  async addContactNote(dto: AddNoteDTO, userId: ID): Promise<ServiceResult<ContactNoteRow>> {
    const parsed = addNoteSchema.safeParse(dto);
    if (!parsed.success) return fail(parsed.error.issues.map((e: any) => e.message).join(', '));
    return fromRepo(await contactsRepository.createContactNote({
      contact_id: parsed.data.contact_id,
      note_content: parsed.data.note_content,
      is_pinned: parsed.data.is_pinned,
      note_type: parsed.data.note_type,
      created_by: userId,
    }));
  }

  async addContactInteraction(dto: AddInteractionDTO, userId: ID): Promise<ServiceResult<ContactInteractionRow>> {
    const parsed = addInteractionSchema.safeParse(dto);
    if (!parsed.success) return fail(parsed.error.issues.map((e: any) => e.message).join(', '));
    return fromRepo(await contactsRepository.createContactInteraction({
      contact_id: parsed.data.contact_id,
      interaction_type: parsed.data.interaction_type,
      description: parsed.data.description,
      interaction_date: parsed.data.interaction_date || new Date().toISOString(),
      created_by: userId,
    }));
  }

  async mergeContacts(dto: MergeContactsDTO, userId: ID): Promise<ServiceResult<boolean>> {
    const parsed = mergeContactsSchema.safeParse(dto);
    if (!parsed.success) return fail(parsed.error.issues.map((e: any) => e.message).join(', '));
    return fromRepo(await contactsRepository.mergeContacts(
      parsed.data.surviving_contact_id,
      parsed.data.deleted_contact_id,
      parsed.data.reason || 'User initiated merge',
      userId
    ));
  }

  // Contact Types
  async listContactTypes(): Promise<ServiceResult<ContactTypeRow[]>> {
    return fromRepo(await contactsRepository.listContactTypes());
  }
  
  async createContactType(dto: CreateContactTypeDTO): Promise<ServiceResult<ContactTypeRow>> {
    const parsed = createContactTypeSchema.safeParse(dto);
    if (!parsed.success) return fail(parsed.error.issues.map((e: any) => e.message).join(', '));
    return fromRepo(await contactsRepository.createContactType(parsed.data as any));
  }

  async updateContactType(id: ID, dto: UpdateContactTypeDTO): Promise<ServiceResult<ContactTypeRow>> {
    const parsed = updateContactTypeSchema.safeParse(dto);
    if (!parsed.success) return fail(parsed.error.issues.map((e: any) => e.message).join(', '));
    return fromRepo(await contactsRepository.updateContactType(id, parsed.data as any));
  }

  // Tags
  async listTags(): Promise<ServiceResult<TagRow[]>> {
    return fromRepo(await contactsRepository.listTags());
  }

  async createTag(dto: CreateTagDTO): Promise<ServiceResult<TagRow>> {
    const parsed = createTagSchema.safeParse(dto);
    if (!parsed.success) return fail(parsed.error.issues.map((e: any) => e.message).join(', '));
    return fromRepo(await contactsRepository.createTag(parsed.data as any));
  }

  async updateTag(id: ID, dto: UpdateTagDTO): Promise<ServiceResult<TagRow>> {
    const parsed = updateTagSchema.safeParse(dto);
    if (!parsed.success) return fail(parsed.error.issues.map((e: any) => e.message).join(', '));
    return fromRepo(await contactsRepository.updateTag(id, parsed.data as any));
  }

  // Interactions Global
  async listInteractions(pagination: Pagination, filters?: Record<string, unknown>): Promise<ServiceResult<PaginatedResult<ContactInteractionRow>>> {
    return fromRepo(await contactsRepository.listInteractions({ pagination, filters }));
  }
}

export const contactsService = new ContactsService();

