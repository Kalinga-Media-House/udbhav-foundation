'use server';

import { revalidateTag } from 'next/cache';

import { handleAction, requireAuth, requirePermission, CacheTags } from '@/contracts/actions';
import type { ActionResult } from '@/contracts/actions';
import type { PaginatedResult } from '@/contracts/repositories';
import type { Pagination } from '@/types';


import type { ContactTypeRow, TagRow } from './repository';
import type { EnquiryRow, ContactRow, OrganizationRow, ContactNoteRow, ContactInteractionRow } from './repository';
import { contactsService } from './service';
import type { CreateContactTypeDTO, UpdateContactTypeDTO, CreateTagDTO, UpdateTagDTO } from './validators';
import type { CreateEnquiryDTO, CreateContactDTO, UpdateContactDTO, CreateOrganizationDTO, UpdateOrganizationDTO, MergeContactsDTO, AddNoteDTO, AddInteractionDTO } from './validators';

export async function submitEnquiry(contactDto: CreateContactDTO, enquiryDto: CreateEnquiryDTO): Promise<ActionResult<EnquiryRow>> {
  return handleAction('submitEnquiry', async () => {
    const contactResult = await contactsService.createContact(contactDto);
    if (!contactResult.success) throw new Error(contactResult.error ?? 'Contact creation failed');
    const enquiryResult = await contactsService.createEnquiry({ ...enquiryDto, contact_id: contactResult.data!.id }, null);
    if (!enquiryResult.success) throw new Error(enquiryResult.error ?? 'Enquiry creation failed');
    revalidateTag(CacheTags.contacts());
    return enquiryResult.data!;
  });
}

export async function assignEnquiry(id: string, assignedTo: string): Promise<ActionResult<EnquiryRow>> {
  return handleAction('assignEnquiry', async () => {
    const session = await requireAuth();
    requirePermission(session, 'contacts.assign');
    const result = await contactsService.assignEnquiry(id, assignedTo, session.id);
    if (!result.success) throw new Error(result.error ?? 'Assignment failed');
    revalidateTag(CacheTags.contacts());
    revalidateTag(CacheTags.enquiry(id));
    return result.data!;
  });
}

export async function resolveEnquiry(id: string): Promise<ActionResult<EnquiryRow>> {
  return handleAction('resolveEnquiry', async () => {
    const session = await requireAuth();
    requirePermission(session, 'contacts.resolve');
    const result = await contactsService.resolveEnquiry(id, session.id);
    if (!result.success) throw new Error(result.error ?? 'Resolution failed');
    revalidateTag(CacheTags.contacts());
    revalidateTag(CacheTags.enquiry(id));
    return result.data!;
  });
}

export async function listEnquiries(pagination: Pagination, filters?: Record<string, unknown>): Promise<ActionResult<PaginatedResult<EnquiryRow>>> {
  return handleAction('listEnquiries', async () => {
    const session = await requireAuth();
    requirePermission(session, 'contacts.read');
    const result = await contactsService.listEnquiries(pagination, filters);
    if (!result.success) throw new Error(result.error ?? 'List failed');
    return result.data!;
  });
}

export async function getContact(id: string): Promise<ActionResult<ContactRow>> {
  return handleAction('getContact', async () => {
    const session = await requireAuth();
    requirePermission(session, 'contacts.read');
    const result = await contactsService.getContact(id);
    if (!result.success) throw new Error(result.error ?? 'Failed to get contact');
    return result.data!;
  });
}

export async function listContacts(pagination: Pagination, filters?: Record<string, unknown>): Promise<ActionResult<PaginatedResult<ContactRow>>> {
  return handleAction('listContacts', async () => {
    const session = await requireAuth();
    requirePermission(session, 'contacts.read');
    const result = await contactsService.listContacts(pagination, filters);
    if (!result.success) throw new Error(result.error ?? 'Failed to list contacts');
    return result.data!;
  });
}

export async function createContact(dto: CreateContactDTO): Promise<ActionResult<ContactRow>> {
  return handleAction('createContact', async () => {
    const session = await requireAuth();
    requirePermission(session, 'contacts.write');
    const result = await contactsService.createContact(dto);
    if (!result.success) throw new Error(result.error ?? 'Failed to create contact');
    revalidateTag(CacheTags.contacts());
    return result.data!;
  });
}

export async function updateContact(id: string, dto: UpdateContactDTO): Promise<ActionResult<ContactRow>> {
  return handleAction('updateContact', async () => {
    const session = await requireAuth();
    requirePermission(session, 'contacts.write');
    const result = await contactsService.updateContact(id, dto);
    if (!result.success) throw new Error(result.error ?? 'Failed to update contact');
    revalidateTag(CacheTags.contacts());
    revalidateTag(CacheTags.contact(id));
    return result.data!;
  });
}

export async function getOrganization(id: string): Promise<ActionResult<OrganizationRow>> {
  return handleAction('getOrganization', async () => {
    const session = await requireAuth();
    requirePermission(session, 'organizations.read');
    const result = await contactsService.getOrganization(id);
    if (!result.success) throw new Error(result.error ?? 'Failed to get organization');
    return result.data!;
  });
}

export async function listOrganizations(pagination: Pagination, filters?: Record<string, unknown>): Promise<ActionResult<PaginatedResult<OrganizationRow>>> {
  return handleAction('listOrganizations', async () => {
    const session = await requireAuth();
    requirePermission(session, 'organizations.read');
    const result = await contactsService.listOrganizations(pagination, filters);
    if (!result.success) throw new Error(result.error ?? 'Failed to list organizations');
    return result.data!;
  });
}

export async function createOrganization(dto: CreateOrganizationDTO): Promise<ActionResult<OrganizationRow>> {
  return handleAction('createOrganization', async () => {
    const session = await requireAuth();
    requirePermission(session, 'organizations.write');
    const result = await contactsService.createOrganization(dto);
    if (!result.success) throw new Error(result.error ?? 'Failed to create organization');
    revalidateTag('organizations');
    return result.data!;
  });
}

export async function updateOrganization(id: string, dto: UpdateOrganizationDTO): Promise<ActionResult<OrganizationRow>> {
  return handleAction('updateOrganization', async () => {
    const session = await requireAuth();
    requirePermission(session, 'organizations.write');
    const result = await contactsService.updateOrganization(id, dto);
    if (!result.success) throw new Error(result.error ?? 'Failed to update organization');
    revalidateTag('organizations');
    return result.data!;
  });
}

export async function addContactNote(dto: AddNoteDTO): Promise<ActionResult<ContactNoteRow>> {
  return handleAction('addContactNote', async () => {
    const session = await requireAuth();
    requirePermission(session, 'contacts.write');
    const result = await contactsService.addContactNote(dto, session.id);
    if (!result.success) throw new Error(result.error ?? 'Failed to add contact note');
    revalidateTag(CacheTags.contact(dto.contact_id));
    return result.data!;
  });
}

export async function addContactInteraction(dto: AddInteractionDTO): Promise<ActionResult<ContactInteractionRow>> {
  return handleAction('addContactInteraction', async () => {
    const session = await requireAuth();
    requirePermission(session, 'contacts.write');
    const result = await contactsService.addContactInteraction(dto, session.id);
    if (!result.success) throw new Error(result.error ?? 'Failed to add contact interaction');
    revalidateTag(CacheTags.contact(dto.contact_id));
    return result.data!;
  });
}

export async function mergeContacts(dto: MergeContactsDTO): Promise<ActionResult<boolean>> {
  return handleAction('mergeContacts', async () => {
    const session = await requireAuth();
    requirePermission(session, 'contacts.delete'); // require delete permission for merge
    const result = await contactsService.mergeContacts(dto, session.id);
    if (!result.success) throw new Error(result.error ?? 'Failed to merge contacts');
    revalidateTag(CacheTags.contacts());
    revalidateTag(CacheTags.contact(dto.surviving_contact_id));
    revalidateTag(CacheTags.contact(dto.deleted_contact_id));
    return result.data!;
  });
}


export async function listContactTypes(): Promise<ActionResult<ContactTypeRow[]>> {
  return handleAction('listContactTypes', async () => {
    const session = await requireAuth();
    requirePermission(session, 'contacts.read');
    const result = await contactsService.listContactTypes();
    if (!result.success) throw new Error(result.error ?? 'Failed');
    return result.data!;
  });
}

export async function createContactType(dto: CreateContactTypeDTO): Promise<ActionResult<ContactTypeRow>> {
  return handleAction('createContactType', async () => {
    const session = await requireAuth();
    requirePermission(session, 'settings.write');
    const result = await contactsService.createContactType(dto);
    if (!result.success) throw new Error(result.error ?? 'Failed');
    revalidateTag('contact-types');
    return result.data!;
  });
}

export async function updateContactType(id: string, dto: UpdateContactTypeDTO): Promise<ActionResult<ContactTypeRow>> {
  return handleAction('updateContactType', async () => {
    const session = await requireAuth();
    requirePermission(session, 'settings.write');
    const result = await contactsService.updateContactType(id, dto);
    if (!result.success) throw new Error(result.error ?? 'Failed');
    revalidateTag('contact-types');
    return result.data!;
  });
}

export async function listTags(): Promise<ActionResult<TagRow[]>> {
  return handleAction('listTags', async () => {
    const session = await requireAuth();
    requirePermission(session, 'contacts.read');
    const result = await contactsService.listTags();
    if (!result.success) throw new Error(result.error ?? 'Failed');
    return result.data!;
  });
}

export async function createTag(dto: CreateTagDTO): Promise<ActionResult<TagRow>> {
  return handleAction('createTag', async () => {
    const session = await requireAuth();
    requirePermission(session, 'settings.write');
    const result = await contactsService.createTag(dto);
    if (!result.success) throw new Error(result.error ?? 'Failed');
    revalidateTag('tags');
    return result.data!;
  });
}

export async function updateTag(id: string, dto: UpdateTagDTO): Promise<ActionResult<TagRow>> {
  return handleAction('updateTag', async () => {
    const session = await requireAuth();
    requirePermission(session, 'settings.write');
    const result = await contactsService.updateTag(id, dto);
    if (!result.success) throw new Error(result.error ?? 'Failed');
    revalidateTag('tags');
    return result.data!;
  });
}

export async function listInteractions(pagination: Pagination, filters?: Record<string, unknown>): Promise<ActionResult<PaginatedResult<ContactInteractionRow>>> {
  return handleAction('listInteractions', async () => {
    const session = await requireAuth();
    requirePermission(session, 'contacts.read');
    const result = await contactsService.listInteractions(pagination, filters);
    if (!result.success) throw new Error(result.error ?? 'Failed');
    return result.data!;
  });
}
