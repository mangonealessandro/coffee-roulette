# Stack-Specific Examples

## Example: Backend (NestJS + PostgreSQL)

Generated from Coffee Roulette PRD with stack: NestJS 10+, PostgreSQL, TypeORM, JWT.

```markdown
# Coffee Roulette – API

## Overview
Backend REST API for matching colleagues for coffee breaks. Handles authentication, user management, automatic weekly matching (cron), and on-demand match requests.

## Stack
| Tech | Version | Note |
|------|---------|------|
| NestJS | 10+ | Chosen for modular architecture and TypeScript native |
| PostgreSQL | 14+ | Production database (SQLite for dev) |
| TypeORM | 0.3+ | ORM with migration support |
| JWT | - | Access token 15min (security), Refresh 7d (UX) |

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 14+ (or SQLite for dev)

### Setup
\`\`\`bash
npm install

# Development (SQLite)
cp .env.example .env.local
npm run db:migrate
npm run db:seed

# Production (PostgreSQL)
# Set DATABASE_URL in .env
npm run migration:run
\`\`\`

### Running
\`\`\`bash
npm run start:dev    # Port 3001, watch mode
npm run test         # Unit + integration tests
npm run build        # Production build
\`\`\`

## Architecture

\`\`\`
api/src/
├── auth/              # JWT authentication
│   ├── strategies/    # Passport JWT strategy
│   └── guards/        # JwtAuthGuard
├── users/             # User CRUD + profile
│   └── dto/           # UpdateProfileDto, etc.
├── matches/           # Matching logic
│   ├── matches.service.ts  # Algorithm
│   └── matches.cron.ts     # Weekly scheduler
└── database/
    ├── entities/      # User, Match
    └── migrations/    # TypeORM migrations
\`\`\`

**Pattern:** Modular monolith with domain separation

**Data Flow:**
Request → Guard (JWT) → Controller → Service → Repository → Response

## Database Schema

### users
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK |
| email | VARCHAR(255) | Unique, Index |
| password_hash | VARCHAR(255) | Bcrypt salt=10 |
| name | VARCHAR(100) | - |
| avatar_url | TEXT | Nullable |
| is_available | BOOLEAN | Default true |
| created_at | TIMESTAMP | Default NOW() |

### matches
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK |
| user_one_id | UUID | FK users(id) |
| user_two_id | UUID | FK users(id) |
| type | ENUM | 'weekly', 'on_demand' |
| status | ENUM | 'pending', 'completed', 'skipped' |
| matched_at | TIMESTAMP | Default NOW() |
| completed_at | TIMESTAMP | Nullable |

**Indexes:**
- Composite on (user_one_id, user_two_id) for deduplication
- Index on email for fast lookup

## API Reference

### Auth
| Method | Endpoint | Auth | Request | Response |
|--------|----------|------|---------|----------|
| POST | /auth/register | ❌ | `{email, password, name}` | `{access_token, refresh_token}` |
| POST | /auth/login | ❌ | `{email, password}` | `{access_token, refresh_token}` |
| POST | /auth/refresh | ❌ | `{refresh_token}` | `{access_token}` |

### Users
| Method | Endpoint | Auth | Request | Response |
|--------|----------|------|---------|----------|
| GET | /users/me | ✅ | - | `User` |
| PATCH | /users/me | ✅ | `{name?, avatar_url?}` | `User` |
| PATCH | /users/me/availability | ✅ | `{is_available}` | `User` |

### Matches
| Method | Endpoint | Auth | Request | Response |
|--------|----------|------|---------|----------|
| GET | /matches | ✅ | - | `Match[]` |
| POST | /matches/on-demand | ✅ | - | `Match` |
| PATCH | /matches/:id/complete | ✅ | - | `Match` |
| PATCH | /matches/:id/skip | ✅ | - | `Match` |

## Conventions

### Naming
- **Entities:** Singular PascalCase → `User`, `Match`
- **DTOs:** `CreateUserDto`, `UpdateMatchDto`
- **Files:** kebab-case → `users.service.ts`
- **DB columns:** snake_case → `user_id`, `created_at`

### Code Style
- One module per feature
- DTOs with class-validator
- Services handle business logic
- Controllers only route and validate

### Testing
- Unit tests for services (80% coverage)
- E2E tests for critical flows
- Mock external dependencies

## Boundaries

### ✅ Always
- DTOs with validation decorators
- Transactions for multi-step operations
- snake_case for database columns
- Error logging with NestJS Logger

### ⚠️ Ask First
- Schema changes or new entities
- JWT strategy modifications
- New background jobs
- External service integrations

### 🚫 Never
- Plain text passwords (always bcrypt)
- Hardcoded secrets (use environment variables)
- Raw SQL (use TypeORM query builder)
- Disabled DTO validation

## Troubleshooting

**`QueryFailedError: relation "users" does not exist`**
→ Cause: Migrations not run
→ Fix: `npm run migration:run`

**`UnauthorizedException: jwt expired`**
→ Cause: Access token expired (15min lifetime)
→ Fix: Frontend should call /auth/refresh with refresh_token

**`ConflictException: duplicate key value violates unique constraint`**
→ Cause: Email already registered
→ Fix: Check email before registration or handle 409 in frontend

**Weekly cron not triggering**
→ Cause: Cron service not imported in app.module
→ Fix: Add MatchesModule to imports array

## Resources
- [NestJS Docs](https://docs.nestjs.com)
- [TypeORM Migrations](https://typeorm.io/migrations)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
\`\`\`

---

## Example: Frontend (Next.js + React)

Generated from same PRD with stack: Next.js 14, React 18, Tailwind, shadcn/ui.

```markdown
# Coffee Roulette – Web

## Overview
Frontend web interface for coffee matching app. Handles authentication, match display, profile management, and availability toggling.

## Stack
| Tech | Version | Note |
|------|---------|------|
| Next.js | 14+ | App Router for SSR and file-based routing |
| React | 18+ | Server Components by default |
| Tailwind CSS | 3+ | Utility-first styling |
| shadcn/ui | Latest | Customizable component library |
| TypeScript | 5+ | Strict mode enabled |

## Getting Started

### Prerequisites
- Node.js 18+
- Backend API running on localhost:3001

### Setup
\`\`\`bash
npm install
cp .env.example .env.local
# Edit NEXT_PUBLIC_API_URL if needed
npm run dev  # Port 3000
\`\`\`

### Running
\`\`\`bash
npm run dev      # Dev server with hot reload
npm run build    # Production build
npm run lint     # ESLint + TypeScript check
\`\`\`

## Architecture

\`\`\`
web/src/
├── app/
│   ├── (auth)/           # Route group: login, register
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (dashboard)/      # Route group: protected area
│   │   ├── layout.tsx    # Sidebar + auth check
│   │   ├── matches/page.tsx
│   │   └── profile/page.tsx
│   └── layout.tsx        # Root layout
├── components/
│   ├── ui/               # shadcn components
│   └── features/         # App components
│       ├── MatchCard.tsx
│       └── CoffeeButton.tsx
├── lib/
│   ├── api.ts           # Fetch wrapper with auth
│   └── auth.ts          # Token management
└── hooks/
    ├── useAuth.ts
    └── useMatches.ts
\`\`\`

**Pattern:** Feature-based with Server/Client component separation

**Data Flow:**
Page (Server) → Client Component → Hook → API Client → Backend

## Pages & Routes

| Route | Type | Description | Auth |
|-------|------|-------------|------|
| / | Server | Landing + redirect | ❌ |
| /login | Client | Login form | ❌ |
| /register | Client | Registration form | ❌ |
| /matches | Server* | Match list | ✅ |
| /profile | Client | Profile + availability | ✅ |

*Server Component with Client Components for interactivity

## Key Components

### Features
| Component | Purpose |
|-----------|---------|
| `MatchCard` | Display match with avatar, name, actions |
| `CoffeeButton` | Request on-demand match |
| `AvailabilityToggle` | Toggle user availability |
| `UserAvatar` | Avatar with fallback initials |

### shadcn/ui
- Button, Card, Avatar, Badge
- Input, Label, Switch
- Toast (notifications)
- Skeleton (loading)

## Conventions

### Naming
- **Components:** PascalCase → `MatchCard.tsx`
- **Hooks:** camelCase + `use` → `useAuth.ts`
- **Files:** kebab-case folders → `app/profile/page.tsx`

### Code Style
- Server Components by default
- "use client" only for interactivity
- Props inline for simple, interface for complex
- TypeScript strict mode, no `any`

### Styling
- Tailwind utility classes only
- Mobile-first responsive
- dark: classes for future dark mode

## Boundaries

### ✅ Always
- TypeScript strict, no `any`
- Tailwind for all styling
- Error handling with try/catch
- Loading states with Skeleton

### ⚠️ Ask First
- New npm dependencies
- Tailwind config changes
- Auth strategy modifications
- New page routes

### 🚫 Never
- CSS inline or CSS modules
- `any` type in TypeScript
- JWT in localStorage in production
- Fetch without apiClient wrapper

## Troubleshooting

**`Error: fetch failed` on API calls**
→ Cause: Backend not running or CORS issue
→ Fix: Start backend on port 3001, verify CORS allows localhost:3000

**`401 Unauthorized` on protected routes**
→ Cause: Access token expired
→ Fix: Implement token refresh in lib/auth.ts

**shadcn components not found**
→ Cause: Path alias not configured
→ Fix: Add `"@/*": ["./src/*"]` to tsconfig.json

**Hydration mismatch with timestamps**
→ Cause: Server/client render dates differently
→ Fix: Format dates client-side only or use suppressHydrationWarning

## Resources
- [Next.js 14 Docs](https://nextjs.org/docs)
- [shadcn/ui](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com/docs)
\`\`\`
