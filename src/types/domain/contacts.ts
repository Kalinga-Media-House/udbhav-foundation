/**
 * @file Contact and Enquiry domain type definitions.
 * @module types/domain/contacts
 */

import type { ContactId, ProfileId, EnquiryId, UserId } from '../branded';
import type { StatusEnum } from '../enums';
import type { ISODate } from '../utilities';

/**
 * Raw database entity representing a contact in the system.
 */
export interface ContactEntity {
  id: string;
  profile_id: string | null;
  full_name: string;
  organization: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string;
  website: string | null;
  social_links: Record<string, unknown>;
  preferred_contact_method: string;
  preferred_language: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
}

/**
 * Raw database entity representing an enquiry submitted by a contact.
 */
export interface EnquiryEntity {
  id: string;
  enquiry_number: string;
  contact_id: string;
  subject: string;
  message: string;
  department: string;
  status: string;
  priority: string;
  channel: string | null;
  assigned_to: string | null;
  assigned_by: string | null;
  assignment_time: string | null;
  resolved_by: string | null;
  resolved_at: string | null;
  first_response_time: number | null;
  ip_address: string | null;
  user_agent: string | null;
  metadata: Record<string, unknown>;
  created_by: string | null;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
}

/**
 * Domain model representing a contact with branded identifiers and formatted timestamps.
 */
export interface Contact {
  id: ContactId;
  profileId?: ProfileId | null;
  fullName: string;
  organization?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  country: string;
  website?: string | null;
  socialLinks: Record<string, unknown>;
  preferredContactMethod: string;
  preferredLanguage?: string | null;
  notes?: string | null;
  createdAt: ISODate;
  updatedAt: ISODate;
  isDeleted: boolean;
}

/**
 * Domain model representing an enquiry with branded identifiers and typed enums.
 */
export interface Enquiry {
  id: EnquiryId;
  enquiryNumber: string;
  contactId: ContactId;
  subject: string;
  message: string;
  department: string;
  status: StatusEnum;
  priority: string;
  channel?: string | null;
  assignedTo?: ProfileId | null;
  assignedBy?: ProfileId | null;
  assignmentTime?: ISODate | null;
  resolvedBy?: ProfileId | null;
  resolvedAt?: ISODate | null;
  firstResponseTime?: number | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  metadata: Record<string, unknown>;
  createdBy?: UserId | null;
  updatedBy?: UserId | null;
  createdAt: ISODate;
  updatedAt: ISODate;
  isDeleted: boolean;
}

/**
 * ViewModel for displaying contact summary details in the UI.
 */
export interface ContactViewModel {
  id: string;
  fullName: string;
  organization?: string | null;
  email?: string | null;
  phone?: string | null;
  locationSummary: string;
  preferredContactMethod: string;
  enquiryCount?: number;
  memberSince: string;
}

/**
 * ViewModel for displaying enquiry summary and status in the UI.
 */
export interface EnquiryViewModel {
  id: string;
  enquiryNumber: string;
  contactName: string;
  contactEmail?: string | null;
  contactPhone?: string | null;
  subject: string;
  message: string;
  department: string;
  statusLabel: string;
  priorityLabel: string;
  channelLabel?: string | null;
  assignedToName?: string | null;
  formattedCreatedAt: string;
  formattedResolvedAt?: string | null;
}

/**
 * Data Transfer Object for creating a new contact.
 */
export interface ContactCreateDTO {
  profileId?: string | null;
  fullName: string;
  organization?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string;
  website?: string | null;
  socialLinks?: Record<string, unknown>;
  preferredContactMethod?: string;
  preferredLanguage?: string | null;
  notes?: string | null;
}

/**
 * Data Transfer Object for updating an existing contact.
 */
export interface ContactUpdateDTO extends Partial<ContactCreateDTO> {
  id: string;
}

/**
 * Data Transfer Object for creating a new enquiry.
 */
export interface EnquiryCreateDTO {
  contactId: string;
  subject: string;
  message: string;
  department: string;
  priority?: string;
  channel?: string | null;
  metadata?: Record<string, unknown>;
}

/**
 * Data Transfer Object for updating an existing enquiry.
 */
export interface EnquiryUpdateDTO extends Partial<Omit<EnquiryCreateDTO, 'contactId'>> {
  id: string;
  status?: StatusEnum;
  assignedTo?: string | null;
}

/**
 * Data Transfer Object for resolving an enquiry.
 */
export interface EnquiryResolveDTO {
  id: string;
  resolutionNotes?: string;
}

/**
 * Filter options for querying contacts.
 */
export interface ContactFilterDTO {
  country?: string;
  preferredContactMethod?: string;
  q?: string;
}

/**
 * Filter options for querying enquiries.
 */
export interface EnquiryFilterDTO {
  department?: string;
  status?: string;
  priority?: string;
  assignedTo?: string;
  q?: string;
}
