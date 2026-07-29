/**
 * @file volunteers.ts
 * @description Domain type definitions for volunteer management in the UDBHAV Foundation platform.
 */

import type { VolunteerId, ProfileId, UserId } from '../branded';
import type { VolunteerStatusEnum } from '../enums';
import type { ISODate } from '../utilities';

/**
 * Raw database entity representation for a Volunteer Profile.
 */
export interface VolunteerProfileEntity {
  id: string;
  profile_id: string;
  volunteer_code: string;
  status: string;
  skills: string[];
  interests: string[];
  availability: string;
  total_hours_served: number;
  events_attended_count: number;
  emergency_contact_name: string | null;
  emergency_contact_phone: string | null;
  notes: string | null;
  created_by: string | null;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
}

/**
 * Raw database entity representation for an Event Volunteer assignment.
 */
export interface EventVolunteerEntity {
  id: string;
  event_id: string;
  volunteer_profile_id: string;
  role: string;
  status: string;
  hours_awarded: number;
  check_in_time: string | null;
  check_out_time: string | null;
  feedback: string | null;
  created_by: string | null;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
}

/**
 * Domain model representation for a Volunteer with branded types and enums.
 */
export interface Volunteer {
  id: VolunteerId;
  profileId: ProfileId;
  volunteerCode: string;
  status: VolunteerStatusEnum;
  skills: string[];
  interests: string[];
  availability: string;
  totalHoursServed: number;
  eventsAttendedCount: number;
  emergencyContact?: { name: string; phone: string } | null;
  notes?: string | null;
  createdBy?: UserId | null;
  updatedBy?: UserId | null;
  createdAt: ISODate;
  updatedAt: ISODate;
  isDeleted: boolean;
}

/**
 * View model representation for rendering Volunteer profile details in user interfaces.
 */
export interface VolunteerViewModel {
  id: string;
  profileId: string;
  fullName: string;
  email: string;
  avatarUrl?: string | null;
  volunteerCode: string;
  statusLabel: string;
  skills: string[];
  interests: string[];
  availabilityLabel: string;
  totalHoursServed: number;
  eventsAttendedCount: number;
  emergencyContactName?: string | null;
  emergencyContactPhone?: string | null;
  memberSince: string;
}

/**
 * Data Transfer Object (DTO) for creating a new Volunteer profile.
 */
export interface VolunteerCreateDTO {
  profileId: string;
  skills?: string[];
  interests?: string[];
  availability?: string;
  emergencyContactName?: string | null;
  emergencyContactPhone?: string | null;
  notes?: string | null;
}

/**
 * Data Transfer Object (DTO) for updating an existing Volunteer profile.
 */
export interface VolunteerUpdateDTO extends Partial<Omit<VolunteerCreateDTO, 'profileId'>> {
  id: string;
  status?: VolunteerStatusEnum;
  totalHoursServed?: number;
  eventsAttendedCount?: number;
}

/**
 * Data Transfer Object (DTO) for filtering and querying Volunteers.
 */
export interface VolunteerFilterDTO {
  status?: string;
  skill?: string;
  interest?: string;
  q?: string;
}
