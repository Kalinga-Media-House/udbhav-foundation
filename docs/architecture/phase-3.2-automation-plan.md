# Phase 3.2: Automation & Notifications Implementation Plan

## Goal Description
Implement **Phase 3.2: Automation** as a robust, long-term, and extensible infrastructure. This phase moves beyond feature-specific implementations by introducing an Event-Driven Architecture, universal notifications (Supabase Realtime), provider abstractions, and Cloudflare R2-backed PDF tax receipts.

## User Review Required
> [!IMPORTANT]
> Please review the architectural pivots below (e.g., Event Dispatcher, Abstract Providers, Universal Notifications). Once you confirm this architectural blueprint aligns with your long-term vision, we will begin implementation.

---

## Final Architecture Decisions (Approved)

### 1. Provider Abstraction & Email Infrastructure
- **Email Abstraction:** Implement an interface in `src/lib/email/provider.ts` and adapters (e.g. `src/lib/email/resend.ts`) configured via environment variables.
- **Provider Independence:** No provider-specific logic should leak into business services.
- **Email Delivery Logging:** Create `public.email_logs` (`id`, `recipient`, `template`, `provider`, `provider_message_id`, `status`, `sent_at`, `error_message`, `retry_count`) for permanent debugging and auditing.

### 2. Universal Notification System
- **Schema (`public.notifications`)**:
  - Extensible fields: `id`, `user_id`, `type`, `category` (Info, Success, Warning, Error, Approval, Reminder, System), `priority`, `severity`, `title`, `message`, `icon`, `source_module`, `action_url`, `metadata`, `is_read`, `expires_at`, `created_at`.
- **Realtime Delivery**: Use **Supabase Realtime** for instant push (no polling).
- **Notification Preferences**: Create `public.user_notification_preferences` supporting toggle flags for Email, In-App, Realtime, SMS, and Webhook.

### 3. Event-Driven Automation & Background Processing
- **Generic Event Bus (`src/features/automation/events/`)**: Common API for all modules to emit events (`DONATION_COMPLETED`, `VOLUNTEER_APPROVED`, etc.).
- **Handlers (`src/features/automation/handlers/`)**: Completely independent listeners for Email, Notification, Analytics, Audit Log, and Webhooks.
- **Automation Audit Trail**: Create `public.automation_audit_logs` (`event_name`, `triggered_by`, `handler`, `status`, `started_at`, `completed_at`, `execution_time`, `error`).
- **Retry & Queue Infrastructure (`src/features/automation/queue/`)**: 
  - Create `public.background_jobs` (`attempt`, `max_attempts`, `next_retry_at`, `last_error`).
  - Architecture must be decoupled so BullMQ/Inngest/Trigger.dev can be integrated later with minimal refactoring.

### 4. PDF Receipt Strategy (Cloudflare R2 Storage)
- **Workflow**: Generate PDF -> Upload to Cloudflare R2 -> Store Metadata & URL in DB -> Email Donor.
- **Schema (`public.tax_receipts`)**: `receipt_number`, `donation_id`, `issued_at`, `issued_by`, `r2_url`, `checksum`, `version`.
- **Template Versioning**: PDF templates and email layouts will support version numbers for legal and branding historical accuracy.

### 5. Automation Module Structure
```text
src/features/automation/
    events/
    handlers/
    email/
    pdf/
    notifications/
    queue/
```

### 6. Email Templates (React Email)
Comprehensive library sharing a common Foundation branding layout, supporting versioning:
- Welcome, Email Verification, Password Reset, Donation Receipt, Donation Thank You, Volunteer Accepted/Rejected, Contact Confirmation, Admin Alert, Program/Event Registration, Newsletter.

---

## Verification Plan (Final Checklist)
- [ ] Multiple concurrent notifications delivery.
- [ ] Duplicate event prevention and idempotent webhook execution.
- [ ] Failed email recovery and retry validation.
- [ ] Audit log validation.
- [ ] Notification cleanup (expiry).
- [ ] PDF generation and integrity verification.
- [ ] Cloudflare R2 file accessibility.
- [ ] Supabase Realtime reconnect behavior.
- [ ] `npm run lint` & `npm run typecheck` & `npm run build`.
