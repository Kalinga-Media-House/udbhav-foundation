import { z } from 'zod';

export const volunteerStatusEnum = z.enum([
  'Applied',
  'Pending Verification',
  'Verified',
  'Active',
  'Inactive',
  'Suspended',
  'Archived',
  'Pending',
  'Graduated',
  'Rejected',
  'Under Review',
  'Approved',
]);

export const createVolunteerSchema = z.object({
  profile_id: z.string().uuid(),
  volunteer_code: z.string().min(2).max(30).regex(/^[A-Z0-9-]+$/),
  status: volunteerStatusEnum.default('Active'),
  volunteer_type: z
    .enum(['Core', 'Event', 'Campus Ambassador', 'Mentor', 'Trainer', 'Medical', 'Disaster Relief', 'Technical'])
    .default('Event'),
  bio: z.string().max(2000).nullable().optional(),
  motivation: z.string().max(2000).nullable().optional(),
  availability: z.string().max(500).nullable().optional(),
  metadata: z.record(z.string(), z.unknown()).default({}),
});

export const updateVolunteerSchema = createVolunteerSchema
  .omit({ volunteer_code: true, profile_id: true })
  .partial();

export const approveVolunteerSchema = z.object({
  volunteer_id: z.string().uuid(),
});

export const reviewApplicationSchema = z.object({
  application_id: z.string().uuid(),
  status: z.enum(['reviewed', 'contacted', 'accepted', 'rejected']),
  notes: z.string().optional(),
});

export const assignProgramSchema = z.object({
  volunteer_id: z.string().uuid(),
  program_id: z.string().uuid(),
  role: z.string().min(1).default('Volunteer'),
  start_date: z.string().optional(),
});

export const assignEventSchema = z.object({
  volunteer_id: z.string().uuid(),
  event_id: z.string().uuid(),
  role: z.string().min(1).default('Event Staff'),
});

export const logVolunteerHoursSchema = z.object({
  volunteer_id: z.string().uuid(),
  program_id: z.string().uuid().optional(),
  event_id: z.string().uuid().optional(),
  hours: z.number().positive().max(500),
  notes: z.string().max(1000).optional(),
});

export const uploadCertificateSchema = z.object({
  volunteer_id: z.string().uuid(),
  title: z.string().min(1).max(200),
  media_file_id: z.string().uuid(),
  issue_date: z.string().optional(),
});

export type CreateVolunteerDTO = z.infer<typeof createVolunteerSchema>;
export type UpdateVolunteerDTO = z.infer<typeof updateVolunteerSchema>;
export type ReviewApplicationDTO = z.infer<typeof reviewApplicationSchema>;
export type AssignProgramDTO = z.infer<typeof assignProgramSchema>;
export type AssignEventDTO = z.infer<typeof assignEventSchema>;
export type LogVolunteerHoursDTO = z.infer<typeof logVolunteerHoursSchema>;
export type UploadCertificateDTO = z.infer<typeof uploadCertificateSchema>;

export const createVolunteerApplicationSchema = z.object({
  fullName: z.string().min(1, "Missing required fields or consent."),
  email: z.string().email("Invalid email address."),
  mobileNumber: z
    .union([z.string(), z.number()])
    .transform((val) => String(val).replace(/\D/g, ""))
    .refine((val) => val.length === 10, "Invalid Indian mobile number format."),
  age: z
    .union([
      z.number().int().positive(),
      z.string().regex(/^\d+$/).transform(Number),
    ])
    .nullable()
    .optional(),
  occupation: z.string().min(1, "Missing required fields or consent."),
  cityDistrict: z.string().min(1, "Missing required fields or consent."),
  state: z.string().min(1, "Missing required fields or consent."),
  preferredAreas: z
    .array(z.string())
    .min(1, "Missing required fields or consent."),
  skills: z
    .union([
      z.string(),
      z.array(z.string()).transform((arr) => arr.join(", ")),
    ])
    .nullable()
    .optional(),
  availability: z.string().min(1, "Missing required fields or consent."),
  motivation: z.string().min(1, "Missing required fields or consent."),
  consent: z.literal(true, {
    errorMap: () => ({ message: "Missing required fields or consent." }),
  }),
  profilePictureUrl: z.string().nullable().optional(),
});

export type CreateVolunteerApplicationDTO = z.infer<typeof createVolunteerApplicationSchema>;

export const updateVolunteerProfileSchema = z.object({
  id: z.string().uuid(),
  full_name: z.string().min(1).optional(),
  occupation: z.string().min(1).optional(),
  city_district: z.string().min(1).optional(),
  state: z.string().min(1).optional(),
  public_bio: z.string().nullable().optional(),
  volunteer_role: z.string().nullable().optional(),
  skills: z.string().nullable().optional(),
  profile_picture_url: z.string().nullable().optional(),
  is_publicly_visible: z.boolean().optional(),
  blood_group: z.preprocess(
    (val) => (val === "" ? null : val),
    z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown']).nullable().optional()
  ),
  notes: z.string().nullable().optional(),
});

export type UpdateVolunteerProfileDTO = z.infer<typeof updateVolunteerProfileSchema>;
