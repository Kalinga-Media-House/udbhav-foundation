# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased] - 2026-07-28
### Added
- **Phase 2.8: Foundation Index** (Programs & Initiatives Archive).
- `index_initiatives` and `index_initiative_gallery` tables for storing historical data separate from operational Programs.
- Server-side Search, Pagination, and Sorting for `/index` page.
- Visual breadcrumbs and JSON-LD `BreadcrumbList` for the Foundation Index detail pages.
- Admin UI for managing initiatives with a 6-step wizard and integrated media uploads (cover and gallery).
- Reusable URL state driven fetching mechanism using `searchParams`.

### Changed
- Migrated `/index` from a client-side filtering approach to a server-side `searchParams` pattern for better performance and scalable SEO.
- Admin Initiative Manager integrated with the global Cloudflare R2 `uploadMedia` pipeline.

### Fixed
- Addressed TypeScript compilation errors related to `galleryUrls` state and `public_url` resolution in the Admin Wizard.
- Fixed duplicate JSON-LD schema objects on detail pages.
