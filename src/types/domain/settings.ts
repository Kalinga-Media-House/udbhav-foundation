/**
 * @file System setting domain type definitions.
 * @module types/domain/settings
 */

import type { ISODate } from '../utilities';

/**
 * Raw database entity representing a configuration or system setting.
 */
export interface SystemSettingEntity {
  id: string;
  setting_key: string;
  setting_value: unknown;
  setting_group: string;
  description: string | null;
  is_public: boolean;
  created_by: string | null;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
}

/**
 * Domain model representing a system setting with formatted timestamps.
 */
export interface SystemSetting {
  id: string;
  settingKey: string;
  settingValue: unknown;
  settingGroup: string;
  description?: string | null;
  isPublic: boolean;
  createdBy?: string | null;
  updatedBy?: string | null;
  createdAt: ISODate;
  updatedAt: ISODate;
  isDeleted: boolean;
}

/**
 * ViewModel for displaying and editing system settings in administrative interfaces.
 */
export interface SystemSettingViewModel {
  id: string;
  settingKey: string;
  settingValue: unknown;
  settingGroup: string;
  description?: string | null;
  isPublic: boolean;
  formattedUpdatedAt: string;
}

/**
 * Data Transfer Object for updating or creating a system setting.
 */
export interface SystemSettingUpdateDTO {
  settingKey: string;
  settingValue: unknown;
  settingGroup?: string;
  description?: string | null;
  isPublic?: boolean;
}
