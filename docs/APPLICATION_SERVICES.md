# UDBHAV Foundation — Application Services Architecture

> Generated for Phase 4.1. This document defines the backend service layer between the Next.js UI and the Supabase/PostgreSQL database.

---

## Architecture Overview

```
┌──────────────────────────────────────────────────────────┐
│                    Next.js UI Layer                       │
│              (Pages, Components, Hooks)                   │
└───────────────────────┬──────────────────────────────────┘
                        │ 'use server' boundary
┌───────────────────────▼──────────────────────────────────┐
│                   Server Actions                          │
│   handleAction() → requireAuth() → Service → revalidate  │
└───────────────────────┬──────────────────────────────────┘
                        │
┌───────────────────────▼──────────────────────────────────┐
│                   Service Layer                           │
│         Business Logic, Validation (Zod), ok/fail         │
└───────────────────────┬──────────────────────────────────┘
                        │
┌───────────────────────▼──────────────────────────────────┐
│                 Repository Layer                          │
│          Supabase queries, error wrapping                 │
└───────────────────────┬──────────────────────────────────┘
                        │
┌───────────────────────▼──────────────────────────────────┐
│              Supabase / PostgreSQL / R2                    │
│            18 Migrations, RLS, Triggers                   │
└──────────────────────────────────────────────────────────┘
```

---

## Folder Structure

```
src/
├── contracts/                     # Shared interfaces & helpers
│   ├── repositories.ts            # IReadRepository, IWriteRepository, ISearchableRepository
│   ├── services.ts                # ServiceResult, ok(), fail(), fromRepo()
│   ├── actions.ts                 # handleAction(), requireAuth(), CacheTags
│   └── index.ts                   # Barrel export
│
├── features/                      # Feature-first modules
│   ├── programs/                  # Programs module
│   │   ├── repository.ts          # ProgramsRepository (Supabase queries only)
│   │   ├── service.ts             # ProgramsService (business logic + Zod)
│   │   ├── validators.ts          # Zod schemas & DTO types
│   │   ├── actions.ts             # Server Actions ('use server')
│   │   └── index.ts               # Barrel export
│   ├── events/
│   ├── volunteers/
│   ├── news/
│   ├── gallery/
│   ├── donations/
│   ├── contacts/
│   ├── media/
│   ├── profiles/
│   ├── notifications/
│   ├── dashboard/
│   └── index.ts                   # Unified namespace export
│
├── errors/                        # Centralized error hierarchy
│   └── index.ts                   # AppError, ValidationError, AuthenticationError, etc.
│
├── validators/                    # Shared Zod primitives
│   └── index.ts                   # uuid, email, slug, phone, pagination, file
│
├── types/                         # Shared TypeScript types
│   └── index.ts                   # ApiResponse, Pagination, UserSession, etc.
│
├── lib/                           # Infrastructure
│   ├── supabase/                  # Supabase client factories
│   ├── storage/                   # Cloudflare R2 client
│   └── logger/                    # Structured logging
│
├── config/                        # Environment validation
│   ├── env.ts
│   ├── public-env.ts
│   └── server-env.ts
│
└── constants/                     # Application-wide constants
    ├── roles.ts
    ├── permissions.ts
    └── routes.ts
```

---

## Layer Responsibilities

| Layer | Responsibility | Imports From |
|-------|---------------|-------------|
| **Server Actions** | Auth gate, permission check, cache revalidation | Services, Contracts |
| **Services** | Zod validation, business rules, orchestration | Repositories, Contracts |
| **Repositories** | Raw Supabase queries, error wrapping | Supabase Client, Errors |
| **Contracts** | Interfaces, result types, auth helpers | Types, Errors, Supabase |

---

## Dependency Graph (One-Way Only)

```
UI → Actions → Services → Repositories → Supabase
                  ↓              ↓
              Validators      Errors
                  ↓
              Contracts
```

> **Rule**: No reverse imports. Repositories never import from Services. Services never import from Actions.

---

## Request Lifecycle

```
1. User clicks "Create Program" in the UI
2. React calls `createProgram(dto)` server action
3. handleAction() wraps the call in try/catch
4. requireAuth() validates the session via Supabase
5. requirePermission() checks `programs.create`
6. programsService.create() validates DTO via Zod
7. programsRepository.create() inserts row via Supabase
8. Database triggers fire (audit, search vector)
9. revalidateTag('programs') busts the cache
10. ActionResult<ProgramRow> returns to the UI
```

---

## Upload Lifecycle

```
1. User selects file in <input type="file">
2. Client creates FormData, calls `uploadMedia(formData)`
3. Server Action extracts file Buffer
4. mediaService.upload() calls R2 uploadFile()
5. R2 returns { key, url, size }
6. mediaRepository.create() inserts metadata into media_files
7. Database audit trigger fires
8. revalidateTag('media')
9. ActionResult<MediaFileRow> returns to UI
```

---

## Error Handling Flow

```
AppError (base)
├── ValidationError (400)
├── AuthenticationError (401)
├── AuthorizationError (403)
├── DatabaseError (500, non-operational)
├── StorageError (500, non-operational)
├── NetworkError (502)
└── ConfigurationError (500, fatal)

handleAction() catches ALL errors and returns:
{ success: false, data: null, error: "safe message" }
```

---

## Caching Strategy

| Tag | Invalidated By |
|-----|---------------|
| `programs` | createProgram, updateProgram, deleteProgram |
| `program-{id}` | updateProgram, deleteProgram |
| `events` | createEvent, updateEvent, deleteEvent |
| `news` | createArticle, publishArticle, deleteArticle |
| `gallery` | createAlbum, deleteAlbum, addGalleryItem |
| `donations` | createDonation |
| `campaigns` | createCampaign, updateCampaign |
| `contacts` | submitEnquiry, assignEnquiry, resolveEnquiry |
| `notifications-{userId}` | markNotificationRead, markAllRead |
| `media` | uploadMedia, deleteMedia |
| `profile-{id}` | updateMyProfile |

---

## Feature Module Reference

| Module | Repository | Service | Actions | Key DTOs |
|--------|-----------|---------|---------|----------|
| Programs | `ProgramsRepository` | `ProgramsService` | create, update, delete, list, search | `CreateProgramDTO` |
| Events | `EventsRepository` | `EventsService` | create, update, delete, list, search | `CreateEventDTO` |
| Volunteers | `VolunteersRepository` | `VolunteersService` | register, approve, update, list | `CreateVolunteerDTO` |
| News | `NewsRepository` | `NewsService` | create, update, publish, delete, list | `CreateArticleDTO` |
| Gallery | `GalleryRepository` | `GalleryService` | create, update, delete, addItem, list | `CreateAlbumDTO` |
| Donations | `DonationsRepository` | `DonationsService` | createDonation, createCampaign, list | `CreateDonationDTO` |
| Contacts | `ContactsRepository` | `ContactsService` | submitEnquiry, assign, resolve, list | `CreateEnquiryDTO` |
| Media | `MediaRepository` | `MediaService` | upload, delete | FormData |
| Profiles | — | `ProfilesService` | getMyProfile, updateMyProfile | `Partial<ProfileRow>` |
| Notifications | — | `NotificationsService` | list, markRead, markAllRead | — |
| Dashboard | — | `DashboardService` | admin, volunteer, donor, notifications | — |
