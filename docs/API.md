# API Documentation

The platform uses Next.js Server Actions exclusively. There are no traditional `/api/*` REST endpoints for internal CRUD. All data fetching and mutations happen via Server Components and Server Actions in `src/features/*/actions.ts`.

## Foundation Index Actions (`src/features/index/actions.ts`)

### `listIndexInitiatives(params)`
- **Purpose**: Fetch paginated, searchable, sortable list of initiatives.
- **Input**: `{ page, limit, search, year, category, sort }`
- **Output**: `Promise<ActionResult<PaginatedResult<IndexInitiativeRow>>>`
- **Authentication**: None (Public).
- **Permissions**: Returns only Published items for public users.
- **Error cases**: Returns `{ success: false, error: string }`.

### `getIndexInitiativeBySlug(slug)`
- **Purpose**: Fetch a single initiative with full media gallery included.
- **Input**: `slug: string`
- **Output**: `Promise<ActionResult<IndexInitiativeWithMedia>>`
- **Authentication**: None (Public).

### `createIndexInitiative(dto)`
- **Purpose**: Create a new index initiative.
- **Input**: `CreateIndexInitiativeDTO` (Title, Slug, Category, cover_media_id, etc.)
- **Output**: `Promise<ActionResult<IndexInitiativeRow>>`
- **Authentication**: Required (Admin).
- **Permissions**: Requires 'settings.manage' role.

### `updateIndexInitiative(id, dto)`
- **Purpose**: Update an existing index initiative.
- **Input**: `id: string`, `UpdateIndexInitiativeDTO`
- **Output**: `Promise<ActionResult<IndexInitiativeRow>>`
- **Authentication**: Required (Admin).
- **Permissions**: Requires 'settings.manage' role.

### `manageIndexInitiativeGallery(id, dto)`
- **Purpose**: Sync the photo gallery for an initiative. Overwrites existing relationships.
- **Input**: `id: string`, `ManageInitiativeGalleryDTO` ({ media_ids: string[] })
- **Output**: `Promise<ActionResult<boolean>>`
- **Authentication**: Required (Admin).
- **Permissions**: Requires 'settings.manage' role.

### `deleteIndexInitiative(id)`
- **Purpose**: Soft delete an initiative.
- **Input**: `id: string`
- **Output**: `Promise<ActionResult<IndexInitiativeRow>>`
- **Authentication**: Required (Admin).
- **Permissions**: Requires 'settings.manage' role.

## Media Pipeline Actions (`src/features/media/actions.ts`)

### `uploadMedia(formData)`
- **Purpose**: Unified R2 upload handler.
- **Input**: `FormData` containing a `file` Blob.
- **Output**: `Promise<ActionResult<MediaFileRow>>` (Contains `public_url` and `id`).
- **Authentication**: Required.
- **Permissions**: Requires 'media.upload' capability.
