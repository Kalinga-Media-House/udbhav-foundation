/**
 * @file events.ts
 * @description Domain type definitions for events in the UDBHAV Foundation platform.
 */

import type { Address, GeoLocation } from '../base';
import type { EventId, ProgramId, MediaId, UserId } from '../branded';
import type { StatusEnum, VisibilityEnum, EventTypeEnum } from '../enums';
import type { ISODate } from '../utilities';

/**
 * Raw database entity representation for an Event.
 */
export interface EventEntity {
  id: string;
  program_id: string;
  event_code: string;
  slug: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  status: string;
  visibility: string;
  event_type: string;
  venue_name: string | null;
  address_line1: string | null;
  address_line2: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  country: string | null;
  latitude: number | null;
  longitude: number | null;
  start_time: string | null;
  end_time: string | null;
  max_attendees: number | null;
  registered_count: number;
  is_featured: boolean;
  cover_image_id: string | null;
  metadata: Record<string, unknown>;
  created_by: string | null;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
}

/**
 * Domain model representation for an Event with branded types and enums.
 */
export interface Event {
  id: EventId;
  programId: ProgramId;
  eventCode: string;
  slug: string;
  title: string;
  subtitle?: string | null;
  description?: string | null;
  status: StatusEnum;
  visibility: VisibilityEnum;
  eventType: EventTypeEnum;
  venueName?: string | null;
  address?: Address | null;
  location?: GeoLocation | null;
  startTime?: ISODate | null;
  endTime?: ISODate | null;
  maxAttendees?: number | null;
  registeredCount: number;
  isFeatured: boolean;
  coverImageId?: MediaId | null;
  metadata: Record<string, unknown>;
  createdBy?: UserId | null;
  updatedBy?: UserId | null;
  createdAt: ISODate;
  updatedAt: ISODate;
  isDeleted: boolean;
}

/**
 * View model representation for rendering Event details in user interfaces.
 */
export interface EventViewModel {
  id: string;
  programId: string;
  programTitle?: string;
  eventCode: string;
  slug: string;
  title: string;
  subtitle?: string | null;
  description?: string | null;
  statusLabel: string;
  eventTypeLabel: string;
  venueName?: string | null;
  formattedAddress?: string;
  formattedStartTime?: string;
  formattedEndTime?: string;
  isFull: boolean;
  spotsRemaining?: number | null;
  registeredCount: number;
  isFeatured: boolean;
  coverImageUrl?: string | null;
}

/**
 * Data Transfer Object (DTO) for creating a new Event.
 */
export interface EventCreateDTO {
  programId: string;
  title: string;
  subtitle?: string | null;
  description?: string | null;
  status?: StatusEnum;
  visibility?: VisibilityEnum;
  eventType: EventTypeEnum;
  venueName?: string | null;
  addressLine1?: string | null;
  addressLine2?: string | null;
  city?: string | null;
  state?: string | null;
  postalCode?: string | null;
  country?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  startTime?: string | null;
  endTime?: string | null;
  maxAttendees?: number | null;
  isFeatured?: boolean;
  coverImageId?: string | null;
  metadata?: Record<string, unknown>;
}

/**
 * Data Transfer Object (DTO) for updating an existing Event.
 */
export interface EventUpdateDTO extends Partial<EventCreateDTO> {
  id: string;
}

/**
 * Data Transfer Object (DTO) for filtering and querying Events.
 */
export interface EventFilterDTO {
  programId?: string;
  eventType?: string;
  status?: string;
  isFeatured?: boolean;
  fromDate?: string;
  toDate?: string;
  q?: string;
}
