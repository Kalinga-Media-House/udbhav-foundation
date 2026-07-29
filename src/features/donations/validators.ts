import { z } from 'zod';

import { slugValidator } from '@/validators';

/** Zod validation schema for creating a donation campaign. */
export const createCampaignSchema = z.object({
  campaign_code: z.string().min(2).max(20).regex(/^[A-Z0-9-]+$/),
  slug: slugValidator,
  title: z.string().min(3).max(200),
  subtitle: z.string().max(300).nullable().optional(),
  description: z.string().max(10000).nullable().optional(),
  goal_amount: z.number().min(0).default(0),
  currency: z.string().default('INR'),
  cover_image_id: z.string().uuid().nullable().optional(),
  program_id: z.string().uuid().nullable().optional(),
  start_date: z.string().datetime().nullable().optional(),
  end_date: z.string().datetime().nullable().optional(),
  status: z.enum(['Draft', 'Active', 'Paused', 'Completed', 'Cancelled', 'Archived']).default('Draft'),
  visibility: z.enum(['public', 'private', 'internal']).default('public'),
  is_featured: z.boolean().default(false),
  priority: z.number().int().min(0).default(0),
  metadata: z.record(z.string(), z.unknown()).default({}),
});

/** Zod validation schema for updating a donation campaign. */
export const updateCampaignSchema = createCampaignSchema.partial().omit({ campaign_code: true });

/** Zod validation schema for creating a donation. */
export const createDonationSchema = z.object({
  donation_number: z.string().min(1),
  contact_id: z.string().uuid(),
  campaign_id: z.string().uuid().nullable().optional(),
  program_id: z.string().uuid().nullable().optional(),
  event_id: z.string().uuid().nullable().optional(),
  donation_type: z.enum(['One Time', 'Monthly', 'Quarterly', 'Half Yearly', 'Yearly', 'Campaign', 'Program', 'Emergency', 'CSR', 'Institutional', 'Memorial', 'Tribute']).default('One Time'),
  amount: z.number().positive('Amount must be positive'),
  currency: z.string().default('INR'),
  purpose: z.string().max(500).nullable().optional(),
  payment_method: z.string().max(50).nullable().optional(),
  provider: z.enum(['Razorpay', 'Cashfree', 'Stripe', 'PayU', 'Offline', 'Bank Transfer', 'Cheque', 'UPI', 'Cash']).default('Razorpay'),
  is_80g_eligible: z.boolean().default(false),
  metadata: z.record(z.string(), z.unknown()).default({}),
});

/** DTO type inferred from createCampaignSchema. */
export type CreateCampaignDTO = z.infer<typeof createCampaignSchema>;

/** DTO type inferred from updateCampaignSchema. */
export type UpdateCampaignDTO = z.infer<typeof updateCampaignSchema>;

/** DTO type inferred from createDonationSchema. */
export type CreateDonationDTO = z.infer<typeof createDonationSchema>;
