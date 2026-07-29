/**
 * @file programs.ts
 * @description Domain type definitions for programs in the UDBHAV Foundation platform.
 */

import type { ProgramId, MediaId, UserId } from '../branded';
import type { ProgramRow } from '../database';
import type { StatusEnum, VisibilityEnum } from '../enums';
import type { ISODate } from '../utilities';

/**
 * Type alias for database row representation of a Program.
 */
export type ProgramDatabaseRow = ProgramRow;

/**
 * Raw database entity representation for a Program.
 */
export interface ProgramEntity {
  id: string;
  program_code: string;
  slug: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  status: string;
  visibility: string;
  cover_image_id: string | null;
  start_date: string | null;
  end_date: string | null;
  is_featured: boolean;
  display_order: number;
  metadata: Record<string, unknown>;
  created_by: string | null;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
}

/**
 * Domain model representation for a Program with branded types and enums.
 */
export interface Program {
  id: ProgramId;
  programCode: string;
  slug: string;
  title: string;
  subtitle?: string | null;
  description?: string | null;
  status: StatusEnum;
  visibility: VisibilityEnum;
  coverImageId?: MediaId | null;
  startDate?: ISODate | null;
  endDate?: ISODate | null;
  isFeatured: boolean;
  displayOrder: number;
  metadata: Record<string, unknown>;
  createdBy?: UserId | null;
  updatedBy?: UserId | null;
  createdAt: ISODate;
  updatedAt: ISODate;
  isDeleted: boolean;
}

/**
 * View model representation for rendering Program details in user interfaces.
 */
export interface ProgramViewModel {
  id: string;
  programCode: string;
  slug: string;
  title: string;
  subtitle?: string | null;
  description?: string | null;
  statusLabel: string;
  visibilityLabel: string;
  coverImageUrl?: string | null;
  formattedStartDate?: string;
  formattedEndDate?: string;
  isFeatured: boolean;
  displayOrder: number;
  excerpt?: string;
}

/**
 * Data Transfer Object (DTO) for creating a new Program.
 */
export interface ProgramCreateDTO {
  title: string;
  subtitle?: string | null;
  description?: string | null;
  status?: StatusEnum;
  visibility?: VisibilityEnum;
  coverImageId?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  isFeatured?: boolean;
  displayOrder?: number;
  metadata?: Record<string, unknown>;
}

/**
 * Data Transfer Object (DTO) for updating an existing Program.
 */
export interface ProgramUpdateDTO extends Partial<ProgramCreateDTO> {
  id: string;
}

/**
 * Data Transfer Object (DTO) for filtering and querying Programs.
 */
export interface ProgramFilterDTO {
  status?: string;
  visibility?: string;
  isFeatured?: boolean;
  q?: string;
}
