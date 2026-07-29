# Database Schema

The database uses PostgreSQL via Supabase. Below are the key tables introduced or modified during Phase 2.8.

## Foundation Index

### `index_initiatives`
Stores the historical archive of UDBHAV Foundation's initiatives. Separate from operational `programmes` to support a storytelling and magazine-like archive format.

**Columns:**
- `id` (UUID, Primary Key)
- `title` (Text)
- `slug` (Text, Unique)
- `initiative_type` (Text)
- `cover_media_id` (UUID, Foreign Key to `media_files`)
- `short_summary` (Text)
- `description` (Text)
- `year` (Integer)
- `location`, `beneficiaries`, `volunteers`, `chief_guest`, `outcome`, `duration`, `partner_name` (Text, Nullable)
- `status` (Text: 'Draft', 'Published', 'Archived')
- `seo_keywords` (Text Array)
- `is_deleted` (Boolean, Soft delete flag)

**Relationships:**
- `cover_media_id` -> `media_files(id)`

**Indexes:**
- `idx_index_initiatives_slug` (slug)
- `idx_index_initiatives_year` (year)
- `idx_index_initiatives_type` (initiative_type)
- `idx_index_initiatives_status` (status)

**RLS Policies:**
- Public: SELECT where `status = 'Published'` and `is_deleted = false`.
- Admin: ALL operations.

### `index_initiative_gallery`
Join table connecting initiatives to multiple media files for the photo gallery.

**Columns:**
- `id` (UUID, Primary Key)
- `initiative_id` (UUID, Foreign Key to `index_initiatives`)
- `media_id` (UUID, Foreign Key to `media_files`)
- `display_order` (Integer)

**Relationships:**
- `initiative_id` -> `index_initiatives(id)` ON DELETE CASCADE
- `media_id` -> `media_files(id)` ON DELETE CASCADE

**Indexes:**
- `idx_index_initiative_gallery_init_id` (initiative_id)

**RLS Policies:**
- Public: SELECT if the parent initiative is Published and not deleted.
- Admin: ALL operations.
