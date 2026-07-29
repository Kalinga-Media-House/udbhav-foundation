import type { Address } from '../base';
import type {
  CampaignId,
  DonationId,
  MediaId,
  ProfileId,
  ProgramId,
  UserId,
} from '../branded';
import type {
  DonationTypeEnum,
  PaymentStatusEnum,
  StatusEnum,
  VisibilityEnum,
} from '../enums';
import type { ISODate } from '../utilities';

/**
 * Represents a donation database entity.
 */
export interface DonationEntity {
  id: string;
  donation_number: string;
  donor_id: string;
  amount: number;
  currency: string;
  status: string;
  payment_method: string | null;
  provider: string;
  gateway_transaction_id: string | null;
  gateway_order_id: string | null;
  donation_type: string;
  program_id: string | null;
  campaign_id: string | null;
  notes: string | null;
  receipt_number: string | null;
  receipt_issued_at: string | null;
  is_80g_eligible: boolean;
  is_anonymous: boolean;
  paid_at: string | null;
  metadata: Record<string, unknown>;
  created_by: string | null;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
}

/**
 * Represents a donation campaign database entity.
 */
export interface DonationCampaignEntity {
  id: string;
  campaign_code: string;
  slug: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  goal_amount: number;
  raised_amount: number;
  currency: string;
  start_date: string | null;
  end_date: string | null;
  status: string;
  visibility: string;
  cover_image_id: string | null;
  program_id: string | null;
  is_featured: boolean;
  donor_count: number;
  metadata: Record<string, unknown>;
  created_by: string | null;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
}

/**
 * Represents a donor database entity.
 */
export interface DonorEntity {
  id: string;
  profile_id: string | null;
  first_name: string | null;
  last_name: string | null;
  organization_name: string | null;
  email: string;
  phone: string | null;
  pan_number: string | null;
  address_line1: string | null;
  address_line2: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  country: string | null;
  is_anonymous: boolean;
  total_donated: number;
  donation_count: number;
  first_donated_at: string | null;
  last_donated_at: string | null;
  created_by: string | null;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
}

/**
 * Domain model representing a donation with branded identifiers and typed enums.
 */
export interface Donation {
  id: DonationId;
  donationNumber: string;
  donorId: string;
  amount: number;
  currency: string;
  status: PaymentStatusEnum;
  paymentMethod?: string | null;
  provider: string;
  gatewayTransactionId?: string | null;
  gatewayOrderId?: string | null;
  donationType: DonationTypeEnum;
  programId?: ProgramId | null;
  campaignId?: CampaignId | null;
  notes?: string | null;
  receiptNumber?: string | null;
  receiptIssuedAt?: ISODate | null;
  is80gEligible: boolean;
  isAnonymous: boolean;
  paidAt?: ISODate | null;
  metadata: Record<string, unknown>;
  createdBy?: UserId | null;
  updatedBy?: UserId | null;
  createdAt: ISODate;
  updatedAt: ISODate;
  isDeleted: boolean;
}

/**
 * Domain model representing a donation campaign with branded identifiers and typed enums.
 */
export interface DonationCampaign {
  id: CampaignId;
  campaignCode: string;
  slug: string;
  title: string;
  subtitle?: string | null;
  description?: string | null;
  goalAmount: number;
  raisedAmount: number;
  currency: string;
  startDate?: ISODate | null;
  endDate?: ISODate | null;
  status: StatusEnum;
  visibility: VisibilityEnum;
  coverImageId?: MediaId | null;
  programId?: ProgramId | null;
  isFeatured: boolean;
  donorCount: number;
  metadata: Record<string, unknown>;
  createdBy?: UserId | null;
  updatedBy?: UserId | null;
  createdAt: ISODate;
  updatedAt: ISODate;
  isDeleted: boolean;
}

/**
 * Domain model representing a donor with branded identifiers and address objects.
 */
export interface Donor {
  id: string;
  profileId?: ProfileId | null;
  firstName?: string | null;
  lastName?: string | null;
  organizationName?: string | null;
  email: string;
  phone?: string | null;
  panNumber?: string | null;
  address?: Address | null;
  isAnonymous: boolean;
  totalDonated: number;
  donationCount: number;
  firstDonatedAt?: ISODate | null;
  lastDonatedAt?: ISODate | null;
  createdBy?: UserId | null;
  updatedBy?: UserId | null;
  createdAt: ISODate;
  updatedAt: ISODate;
  isDeleted: boolean;
}

/**
 * View model formatted for presentation layers displaying donations.
 */
export interface DonationViewModel {
  id: string;
  donationNumber: string;
  formattedAmount: string;
  donorName: string;
  donorEmail: string;
  statusLabel: string;
  paymentMethodLabel?: string | null;
  donationTypeLabel: string;
  programTitle?: string | null;
  campaignTitle?: string | null;
  receiptNumber?: string | null;
  formattedPaidAt?: string | null;
  is80gEligible: boolean;
}

/**
 * View model formatted for presentation layers displaying donation campaigns.
 */
export interface DonationCampaignViewModel {
  id: string;
  campaignCode: string;
  slug: string;
  title: string;
  subtitle?: string | null;
  description?: string | null;
  formattedGoalAmount: string;
  formattedRaisedAmount: string;
  progressPercentage: number;
  statusLabel: string;
  coverImageUrl?: string | null;
  programTitle?: string | null;
  donorCount: number;
  daysRemaining?: number | null;
}

/**
 * View model formatted for presentation layers displaying donors.
 */
export interface DonorViewModel {
  id: string;
  fullName: string;
  organizationName?: string | null;
  email: string;
  phone?: string | null;
  isAnonymous: boolean;
  formattedTotalDonated: string;
  donationCount: number;
  formattedLastDonatedAt?: string | null;
}

/**
 * Data Transfer Object for creating a new donation.
 */
export interface DonationCreateDTO {
  donorId: string;
  amount: number;
  currency?: string;
  donationType: DonationTypeEnum;
  programId?: string | null;
  campaignId?: string | null;
  paymentMethod?: string | null;
  provider?: string;
  notes?: string | null;
  is80gEligible?: boolean;
  isAnonymous?: boolean;
  metadata?: Record<string, unknown>;
}

/**
 * Data Transfer Object for updating an existing donation.
 */
export interface DonationUpdateDTO extends Partial<DonationCreateDTO> {
  id: string;
  status?: PaymentStatusEnum;
  gatewayTransactionId?: string | null;
  gatewayOrderId?: string | null;
  receiptNumber?: string | null;
  receiptIssuedAt?: string | null;
  paidAt?: string | null;
}

/**
 * Data Transfer Object for creating a new donation campaign.
 */
export interface DonationCampaignCreateDTO {
  title: string;
  subtitle?: string | null;
  description?: string | null;
  goalAmount: number;
  currency?: string;
  startDate?: string | null;
  endDate?: string | null;
  status?: StatusEnum;
  visibility?: VisibilityEnum;
  coverImageId?: string | null;
  programId?: string | null;
  isFeatured?: boolean;
  metadata?: Record<string, unknown>;
}

/**
 * Data Transfer Object for updating an existing donation campaign.
 */
export interface DonationCampaignUpdateDTO extends Partial<DonationCampaignCreateDTO> {
  id: string;
  raisedAmount?: number;
  donorCount?: number;
}

/**
 * Data Transfer Object for creating a new donor profile.
 */
export interface DonorCreateDTO {
  profileId?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  organizationName?: string | null;
  email: string;
  phone?: string | null;
  panNumber?: string | null;
  addressLine1?: string | null;
  addressLine2?: string | null;
  city?: string | null;
  state?: string | null;
  postalCode?: string | null;
  country?: string | null;
  isAnonymous?: boolean;
}

/**
 * Data Transfer Object for updating an existing donor profile.
 */
export interface DonorUpdateDTO extends Partial<DonorCreateDTO> {
  id: string;
}

/**
 * Data Transfer Object for filtering and searching donations.
 */
export interface DonationFilterDTO {
  status?: string;
  donationType?: string;
  programId?: string;
  campaignId?: string;
  donorId?: string;
  fromDate?: string;
  toDate?: string;
  q?: string;
}
