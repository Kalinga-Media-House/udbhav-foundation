import { z } from 'zod';

import { emailValidator } from '@/validators';

export const createEnquirySchema = z.object({
  enquiry_number: z.string().min(1),
  contact_id: z.string().uuid(),
  subject: z.string().min(3).max(300),
  message: z.string().min(10).max(10000),
  department: z.string().default('General'),
  category: z.string().default('Other'),
  priority: z.enum(['Low', 'Normal', 'High', 'Urgent', 'Critical']).default('Normal'),
  status: z.string().default('Open'),
  source: z.string().default('Website'),
  channel: z.string().max(50).nullable().optional(),
  ip_address: z.string().max(45).nullable().optional(),
  user_agent: z.string().max(500).nullable().optional(),
  metadata: z.record(z.string(), z.unknown()).default({}),
});

export const createContactSchema = z.object({
  full_name: z.string().min(2, 'Name is required').max(200),
  organization_id: z.string().uuid().nullable().optional(),
  designation: z.string().max(100).nullable().optional(),
  email: emailValidator.nullable().optional().or(z.literal('')),
  phone: z.string().max(20).nullable().optional().or(z.literal('')),
  alternate_phone: z.string().max(20).nullable().optional().or(z.literal('')),
  address: z.string().nullable().optional(),
  city: z.string().max(100).nullable().optional(),
  district: z.string().max(100).nullable().optional(),
  state: z.string().max(100).nullable().optional(),
  country: z.string().default('India'),
  preferred_contact_method: z.string().default('Email'),
  preferred_language: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
  contact_type_ids: z.array(z.string().uuid()).default([]),
  tag_ids: z.array(z.string().uuid()).default([]),
});

export const updateContactSchema = createContactSchema.extend({
  id: z.string().uuid(),
  status: z.enum(['Active', 'Inactive', 'Blocked', 'Merged']).optional(),
});

export const createOrganizationSchema = z.object({
  name: z.string().min(2, 'Organization name is required').max(255),
  organization_type: z.string().min(1),
  parent_organization_id: z.string().uuid().nullable().optional(),
  website: z.string().url().nullable().optional().or(z.literal('')),
  email: emailValidator.nullable().optional().or(z.literal('')),
  phone: z.string().max(20).nullable().optional().or(z.literal('')),
  address: z.string().nullable().optional(),
  district: z.string().max(100).nullable().optional(),
  state: z.string().max(100).nullable().optional(),
  country: z.string().default('India'),
  status: z.enum(['Active', 'Inactive']).default('Active'),
});

export const updateOrganizationSchema = createOrganizationSchema.extend({
  id: z.string().uuid(),
});

export const mergeContactsSchema = z.object({
  surviving_contact_id: z.string().uuid(),
  deleted_contact_id: z.string().uuid(),
  reason: z.string().optional(),
});

export const addNoteSchema = z.object({
  contact_id: z.string().uuid(),
  note_content: z.string().min(1, 'Note content cannot be empty'),
  is_pinned: z.boolean().default(false),
  note_type: z.enum(['General', 'Meeting', 'Call', 'Internal']).default('General'),
});

export const addInteractionSchema = z.object({
  contact_id: z.string().uuid(),
  interaction_type: z.string().min(1),
  description: z.string().min(1),
  interaction_date: z.string().datetime().optional(),
});

export type CreateEnquiryDTO = z.infer<typeof createEnquirySchema>;
export type CreateContactDTO = z.infer<typeof createContactSchema>;
export type UpdateContactDTO = z.infer<typeof updateContactSchema>;
export type CreateOrganizationDTO = z.infer<typeof createOrganizationSchema>;
export type UpdateOrganizationDTO = z.infer<typeof updateOrganizationSchema>;
export type MergeContactsDTO = z.infer<typeof mergeContactsSchema>;
export type AddNoteDTO = z.infer<typeof addNoteSchema>;
export type AddInteractionDTO = z.infer<typeof addInteractionSchema>;

export const createContactTypeSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  icon: z.string().nullable().optional(),
  color: z.string().nullable().optional(),
  display_order: z.number().default(0),
  is_active: z.boolean().default(true),
});

export const updateContactTypeSchema = createContactTypeSchema.extend({
  id: z.string().uuid(),
});

export const createTagSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  color: z.string().nullable().optional(),
  icon: z.string().nullable().optional(),
  display_order: z.number().default(0),
  is_active: z.boolean().default(true),
});

export const updateTagSchema = createTagSchema.extend({
  id: z.string().uuid(),
});

export type CreateContactTypeDTO = z.infer<typeof createContactTypeSchema>;
export type UpdateContactTypeDTO = z.infer<typeof updateContactTypeSchema>;
export type CreateTagDTO = z.infer<typeof createTagSchema>;
export type UpdateTagDTO = z.infer<typeof updateTagSchema>;
