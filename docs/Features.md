# Feature Modules

The UDBHAV Foundation Enterprise Platform is composed of several independent, highly cohesive feature modules located in `src/features/*`.

## Completed Features

### 1. Programs (`/src/features/programs`)
- Operational programs currently active in the foundation.
- Manages Program Events, Impacts, and programmatic logic.

### 2. Events (`/src/features/events`)
- Standalone events calendar and event details management.

### 3. Gallery & Media (`/src/features/media` & `/src/features/gallery`)
- Centralized Cloudflare R2 pipeline.
- `uploadMedia` server action used platform-wide.

### 4. News & Stories (`/src/features/news`)
- Blog, Podcast, and Press Release CMS.

### 5. Volunteers (`/src/features/volunteers`)
- Application processing, dashboard access, and user role management.

### 6. Foundation Index (`/src/features/index`)
- **Phase 2.8 Completed.**
- Historical Programs & Initiatives Archive.
- Independent from operational Programs; designed for storytelling, digital booklet aesthetics, and rich media galleries.
- URL-driven Server Side Pagination and Search.

## Pending Features
- **Contacts & CRM** (Phase 2.9)
- **Donations & Payment Gateway** (Phase 2.10)
