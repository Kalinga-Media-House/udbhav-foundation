/**
 * @file profiles.ts
 * @description Domain type definitions for user profiles in the UDBHAV Foundation platform.
 */

import type { ProfileId } from '../branded';
import type { RoleEnum } from '../enums';
import type { ISODate } from '../utilities';

/**
 * Raw database entity representation for a Profile.
 */
export interface ProfileEntity {
  id: string;
  email: string;
  role: string;
  first_name: string | null;
  last_name: string | null;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
}

/**
 * Domain model representation for a Profile with branded types and enums.
 */
export interface Profile {
  id: ProfileId;
  email: string;
  role: RoleEnum;
  firstName?: string | null;
  lastName?: string | null;
  createdAt: ISODate;
  updatedAt: ISODate;
  isDeleted: boolean;
}

/**
 * View model representation for rendering Profile details in user interfaces.
 */
export interface ProfileViewModel {
  id: string;
  email: string;
  role: string;
  roleLabel: string;
  firstName?: string | null;
  lastName?: string | null;
  fullName: string;
  avatarUrl?: string | null;
  memberSince: string;
}

/**
 * Data Transfer Object (DTO) for creating a new Profile.
 */
export interface ProfileCreateDTO {
  id?: string;
  email: string;
  role?: RoleEnum;
  firstName?: string | null;
  lastName?: string | null;
}

/**
 * Data Transfer Object (DTO) for updating an existing Profile.
 */
export interface ProfileUpdateDTO {
  id: string;
  role?: RoleEnum;
  firstName?: string | null;
  lastName?: string | null;
}

/**
 * Data Transfer Object (DTO) for filtering and querying Profiles.
 */
export interface ProfileFilterDTO {
  role?: string;
  q?: string;
}
