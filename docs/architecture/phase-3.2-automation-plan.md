# Phase 3.2: Automation & Notifications Implementation Plan

## Goal Description
Implement **Phase 3.2: Automation** as a robust, long-term, and extensible infrastructure. This phase moves beyond feature-specific implementations by introducing an Event-Driven Architecture, universal notifications (Supabase Realtime), provider abstractions, and Cloudflare R2-backed PDF tax receipts.

## User Review Required
> [!IMPORTANT]
> Please review the architectural pivots below (e.g., Event Dispatcher, Abstract Providers, Universal Notifications). Once you confirm this architectural blueprint aligns with your long-term vision, we will begin implementation.

---

## 1. Provider Abstraction & Email Infrastructure
We will not couple business logic directly to Resend, Razorpay, or Cloudflare R2.
- **Email Abstraction:** Implement an interface in `src/lib/email/provider.ts`.
- **Resend Adapter:** Implement the Resend specific logic in `src/lib/email/resend.ts`.
- **Usage:** Business logic will only call a generic `sendEmail(...)` function, allowing the underlying provider to be seamlessly swapped to AWS SES or SendGrid in the future without changing application code.

## 2. Universal Notification System
Rather than an Admin-only system, we will design a robust schema supporting future notifications for all users (admins, volunteers, donors, users, reviewers).
- **Schema (`public.notifications`)**:
  - `id`, `user_id`, `type`, `category`, `priority`, `title`, `message`, `icon`, `action_url`, `metadata`, `is_read`, `expires_at`, `created_at`
- **Realtime Delivery**: We will use **Supabase Realtime** for instant delivery across the platform without polling.

## 3. Event-Driven Automation & Background Processing
Business logic will no longer directly trigger emails or notifications.
- **Event Dispatcher (`src/features/automation/events/`)**: Business modules will emit events (e.g., `DONATION_COMPLETED`).
- **Handlers (`src/features/automation/handlers/`)**: Dedicated handlers for Email, Notification, Analytics, Audit Log, and Webhooks will listen for these events.
- **Background Processing / Queue (`src/features/automation/queue/`)**: The architecture will be designed such that heavy tasks (PDF generation, bulk emails) can be processed outside the critical HTTP request path.

## 4. PDF Receipt Strategy (Cloudflare R2 Storage)
To ensure audit compliance, CSR reporting, and reproducibility, PDFs will not be generated solely in-memory.
- **Workflow**:
  1. Generate PDF -> 2. Upload to Cloudflare R2 -> 3. Store Metadata & URL in DB -> 4. Email Donor.
- **Schema (`public.tax_receipts`)**:
  - `receipt_number`, `donation_id`, `issued_at`, `issued_by`, `r2_url`, `checksum`, `version`

## 5. Automation Module Structure
The feature will be cleanly separated into the following structure:
```text
src/features/automation/
    events/
    handlers/
    email/
    pdf/
    notifications/
    queue/
```

## 6. Email Templates (React Email)
We will create a comprehensive library of templates sharing a common Foundation branding layout:
- Welcome
- Email Verification
- Password Reset
- Donation Receipt
- Donation Thank You
- Volunteer Accepted
- Volunteer Rejected
- Contact Confirmation
- Admin Alert
- Program Registration
- Event Registration
- Newsletter

---

## Verification Plan (Final Checklist)
Before Phase 3.2 is closed, the following must be verified:
- [ ] `npm run lint` & `npm run typecheck` & `npm run build`
- [ ] Database migrations deployed and RLS verified.
- [ ] Email delivery via Resend (sandbox/test key).
- [ ] PDF generation output is valid.
- [ ] R2 upload successful and URL stored in DB.
- [ ] Supabase Realtime notification delivery updates the UI immediately.
- [ ] Notification badge updates accurately.
- [ ] Donor receipt retrieval (via R2 URL).
- [ ] Retry/failure handling validated.
- [ ] Audit logging confirms events triggered.
