/**
 * General status enumeration for various business entities.
 */
export enum StatusEnum {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
  PENDING = 'Pending',
  APPROVED = 'Approved',
  REJECTED = 'Rejected',
  COMPLETED = 'Completed',
  CANCELLED = 'Cancelled',
  DRAFT = 'Draft',
  PAUSED = 'Paused',
  ARCHIVED = 'Archived',
}

/**
 * Types of donations received by the foundation.
 */
export enum DonationTypeEnum {
  PROGRAM = 'Program',
  CAMPAIGN = 'Campaign',
  ONE_TIME = 'One Time',
  MONTHLY = 'Monthly',
  QUARTERLY = 'Quarterly',
  HALF_YEARLY = 'Half Yearly',
  YEARLY = 'Yearly',
  EMERGENCY = 'Emergency',
  CSR = 'CSR',
  INSTITUTIONAL = 'Institutional',
  MEMORIAL = 'Memorial',
  TRIBUTE = 'Tribute',
}

/**
 * Notification types for system and user messaging.
 */
export enum NotificationTypeEnum {
  SYSTEM = 'System',
  PROGRAM = 'Program',
  EVENT = 'Event',
  DONATION = 'Donation',
  VOLUNTEER = 'Volunteer',
  SECURITY = 'Security',
  USER = 'User',
  REMINDER = 'Reminder',
  ANNOUNCEMENT = 'Announcement',
}

/**
 * Status enumeration for volunteers.
 */
export enum VolunteerStatusEnum {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
  PENDING = 'Pending',
  REJECTED = 'Rejected',
  ON_LEAVE = 'On Leave',
  SUSPENDED = 'Suspended',
  ALUMNI = 'Alumni',
}

/**
 * Payment status enumeration for transactions and donations.
 */
export enum PaymentStatusEnum {
  PENDING = 'Pending',
  SUCCESS = 'Success',
  FAILED = 'Failed',
  REFUNDED = 'Refunded',
  CANCELLED = 'Cancelled',
}

/**
 * Types of reports generated within the platform.
 */
export enum ReportTypeEnum {
  FINANCIAL = 'Financial',
  IMPACT = 'Impact',
  VOLUNTEER = 'Volunteer',
  EVENT = 'Event',
  DONATION = 'Donation',
  CUSTOM = 'Custom',
}

/**
 * Supported file formats for data export.
 */
export enum ExportFormatEnum {
  CSV = 'CSV',
  PDF = 'PDF',
  XLSX = 'XLSX',
  JSON = 'JSON',
}

/**
 * Application runtime environment enumeration.
 */
export enum EnvironmentEnum {
  DEVELOPMENT = 'development',
  STAGING = 'staging',
  PRODUCTION = 'production',
}

/**
 * Feature flag enumeration for progressive enhancement and experiments.
 */
export enum FeatureFlagEnum {
  NEW_DONATION_FLOW = 'new_donation_flow',
  AI_SEARCH = 'ai_search',
  VOLUNTEER_GAMIFICATION = 'volunteer_gamification',
}
