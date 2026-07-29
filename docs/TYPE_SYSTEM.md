# UDBHAV Foundation Enterprise Type System Architecture

## 1. Architecture & Design Philosophy
The UDBHAV Foundation platform employs a strict, centralized, domain-driven type system located under `src/types/`. This architecture serves as the **Single Source of Truth** across all application layers, repositories, services, and server actions.

### Core Principles
- **Strict Typing Without Exceptions**: No `any`, implicit `any`, or unverified casts are permitted in domain code.
- **Domain-Driven 4-Tier Separation**: Every business entity is explicitly bounded into four representations:
  1. **Database Entity (`*Entity`)**: Direct representation of raw SQL PostgreSQL table schemas (snake_case, primitive attributes).
  2. **Domain Model (`*`)**: Rich application model with branded IDs, value objects (Address, SEO), and business invariants (camelCase).
  3. **View Model (`*ViewModel`)**: UI-optimized data structures with formatted strings, localized currency, and resolved relational names, stripped of sensitive internal audit metadata.
  4. **Data Transfer Objects (`*DTO`)**: Input payloads for mutations and queries (`*CreateDTO`, `*UpdateDTO`, `*FilterDTO`).
- **Branded Identifier Integrity**: All database primary keys are wrapped in nominal TypeScript branded types (`ProgramId`, `DonationId`, `ProfileId`) to eliminate accidental cross-entity ID assignment at compile time.
- **Zero Circular Dependencies**: Type files are structured hierarchically with strict dependency flow from low-level utilities to high-level domain models.

---

## 2. Directory & Namespace Structure
```
src/types/
├── utilities/       # Type helpers (Nullable, Optional, DeepPartial, Prettify, Brand)
├── branded/         # Nominal ID wrappers (ProgramId, EventId, DonationId, UserId)
├── base/            # Shared traits (EntityId, Timestamped, SoftDelete, Address, SEO)
├── enums/           # Const enums & union types across auth, content, and business
├── api/             # Route handler responses (ApiSuccess, ApiError, PaginatedResponse)
├── search/          # Pagination, cursor, sorting, and faceted search query definitions
├── permissions/     # RBAC evaluation context, claims, sessions, and policies
├── audit/           # Audit logs, activity trails, version history, and diff schemas
├── media/           # Cloudflare R2 object metadata, image/video assets, and signed URLs
├── database/        # Supabase CLI-style generated schemas (18 tables, views, RPCs)
├── domain/          # 13 enterprise domain modules (4-tier separation per module)
└── index.ts         # Unified barrel export with backward compatibility aliases
```

---

## 3. Type Dependency Hierarchy
To guarantee zero circular imports, modules may only import from layers above or at the same horizontal tier:

```
[Level 1] utilities/
   ▲
[Level 2] branded/ , base/
   ▲
[Level 3] enums/ , api/ , search/ , permissions/ , audit/ , media/
   ▲
[Level 4] database/
   ▲
[Level 5] domain/ (programs, events, donations, etc.)
   ▲
[Level 6] src/features/* , src/contracts/* , src/app/*
```

---

## 4. Naming Conventions & Rules
| Category | Convention / Suffix | Example |
| :--- | :--- | :--- |
| **Branded IDs** | PascalCase + `Id` | `ProgramId`, `DonationId`, `ProfileId` |
| **Enums** | PascalCase + `Enum` | `RoleEnum`, `StatusEnum`, `PaymentStatusEnum` |
| **Database Entity**| PascalCase + `Entity` | `ProgramEntity`, `DonationEntity` |
| **Domain Model** | PascalCase | `Program`, `Donation`, `Volunteer` |
| **View Model** | PascalCase + `ViewModel` | `ProgramViewModel`, `DonationViewModel` |
| **DTOs** | PascalCase + `CreateDTO` / `UpdateDTO` / `FilterDTO` | `ProgramCreateDTO`, `DonationFilterDTO` |

---

## 5. Supabase Database Type Regeneration Workflow
When database migrations change table structures, regenerate `database.generated.ts`:

```bash
# 1. Login to Supabase CLI (if remote) or link local Supabase instance
npx supabase login

# 2. Generate TypeScript types directly into our centralized folder
npx supabase gen types typescript --local > src/types/database/database.generated.ts

# 3. Verify compilation against domain models and repository wrappers
npm run typecheck
```

---

## 6. Usage Example: Building a Feature Service
When implementing a service method in `src/features/*`:

```typescript
import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { ProgramId, ProgramCreateDTO, ProgramEntity, Program } from '@/types';

export async function createProgramService(input: ProgramCreateDTO): Promise<Program> {
  const supabase = await createServerSupabaseClient();
  
  // 1. Map DTO to Database Insert payload (snake_case)
  const dbPayload = {
    title: input.title,
    subtitle: input.subtitle ?? null,
    description: input.description ?? null,
    status: input.status ?? 'Draft',
    visibility: input.visibility ?? 'public',
    is_featured: input.isFeatured ?? false,
    display_order: input.displayOrder ?? 0,
    metadata: input.metadata ?? {},
  };

  // 2. Perform persistence operation
  const { data, error } = await supabase
    .from('programs')
    .insert(dbPayload)
    .select()
    .single();

  if (error || !data) throw new Error(error?.message ?? 'Failed to create program');

  const row = data as ProgramEntity;

  // 3. Transform Database Entity to Rich Domain Model (camelCase, Branded ID)
  return {
    id: row.id as ProgramId,
    programCode: row.program_code,
    slug: row.slug,
    title: row.title,
    subtitle: row.subtitle,
    description: row.description,
    status: row.status as any,
    visibility: row.visibility as any,
    coverImageId: row.cover_image_id as any,
    startDate: row.start_date as any,
    endDate: row.end_date as any,
    isFeatured: row.is_featured,
    displayOrder: row.display_order,
    metadata: row.metadata,
    createdBy: row.created_by as any,
    updatedBy: row.updated_by as any,
    createdAt: row.created_at as any,
    updatedAt: row.updated_at as any,
    isDeleted: row.is_deleted,
  };
}
```

---

## 7. Anti-Patterns to Avoid
1. **Never use bare string IDs across function boundaries**: Avoid `function getEvent(id: string)`. Always use `function getEvent(id: EventId)`.
2. **Never expose raw `DatabaseEntity` objects to UI components**: Always map to `ViewModel` before passing props to ReactServer or Client components.
3. **Never create circular `export * from ...` barrel exports**: Always verify leaf modules don't re-import the root `src/types/index.ts`.
4. **Never duplicate shared enum values**: Always import standard status and visibility definitions from `@/types/enums`.
