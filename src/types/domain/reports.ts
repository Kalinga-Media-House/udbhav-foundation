/**
 * @file Report domain type definitions.
 * @module types/domain/reports
 */

import type { ProfileId } from '../branded';
import type { ReportTypeEnum, ExportFormatEnum, StatusEnum } from '../enums';
import type { ISODate } from '../utilities';

/**
 * Raw database entity representing a generated report.
 */
export interface ReportEntity {
  id: string;
  title: string;
  report_type: string;
  export_format: string;
  generated_by: string;
  file_url: string | null;
  parameters: Record<string, unknown>;
  status: string;
  created_at: string;
}

/**
 * Domain model representing a report with branded identifiers and typed enums.
 */
export interface Report {
  id: string;
  title: string;
  reportType: ReportTypeEnum;
  exportFormat: ExportFormatEnum;
  generatedBy: ProfileId;
  fileUrl?: string | null;
  parameters: Record<string, unknown>;
  status: StatusEnum;
  createdAt: ISODate;
}

/**
 * ViewModel for displaying report summary details in the UI.
 */
export interface ReportViewModel {
  id: string;
  title: string;
  reportTypeLabel: string;
  exportFormat: string;
  generatedByName: string;
  fileUrl?: string | null;
  statusLabel: string;
  formattedCreatedAt: string;
}

/**
 * Data Transfer Object for requesting a new report generation.
 */
export interface ReportGenerateDTO {
  title: string;
  reportType: ReportTypeEnum;
  exportFormat: ExportFormatEnum;
  parameters?: Record<string, unknown>;
}

/**
 * Filter options for querying reports.
 */
export interface ReportFilterDTO {
  reportType?: string;
  status?: string;
  generatedBy?: string;
}
