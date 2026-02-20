# claude.md Best Practices

## Essential Sections

Every claude.md must include:

### 1. Overview (2-3 sentences)
```markdown
## Overview
[What this component does]
[Problem it solves from PRD]
```

**Good:**
```markdown
## Overview
Backend REST API for matching colleagues for coffee breaks.
Handles authentication, automatic weekly matching, and on-demand requests.
```

**Bad (too vague):**
```markdown
## Overview
API for the application.
```

### 2. Stack Table with WHY

```markdown
| Tech | Version | Note |
|------|---------|------|
| [Name] | [X.Y+] | [Why chosen / Key benefit] |
```

**Good:**
```markdown
| NestJS | 10+ | Modular architecture, TypeScript native |
| SQLite | 3 | Dev database (Postgres in prod) |
| JWT | - | Access 15min (security), Refresh 7d (UX) |
```

**Bad (missing context):**
```markdown
| NestJS | 10+ | Framework |
| SQLite | 3 | Database |
```

### 3. Complete Setup Instructions

Include:
- Prerequisites (runtime versions)
- Step-by-step commands
- Environment variables with purpose
- First-time setup (migrations, seeds)

**Template:**
```markdown
### Prerequisites
- [Runtime] [version]+
- [Other requirements]

### Setup
\`\`\`bash
# Install
npm install

# Environment
cp .env.example .env
# Required vars:
# - VAR_NAME: [purpose]

# Database
npm run db:migrate
npm run db:seed
\`\`\`

### Running
\`\`\`bash
npm run dev  # Port [X], [features]
\`\`\`
```

### 4. Architecture with Purpose

```markdown
\`\`\`
component/
├── folder/  # [Purpose from PRD feature]
│   └── file.ts
└── folder/  # [Purpose]
\`\`\`

**Pattern:** [Architecture style]
**Data Flow:** [Step-by-step matching PRD flow]
```

### 5. Boundaries Section

**Pattern:**
```markdown
## Boundaries

### ✅ Always
[Specific actions that are safe to do autonomously]

### ⚠️ Ask First
[Actions requiring team discussion]

### 🚫 Never
[Prohibited actions with security/data/architecture reasons]
```

**Good (specific):**
```markdown
### ✅ Always
- Add DTOs with class-validator decorators
- Use snake_case for database columns
- Wrap multi-step operations in transactions

### ⚠️ Ask First
- Add new database entities
- Change JWT expiration strategy
- Introduce new npm dependencies

### 🚫 Never
- Store passwords in plain text
- Use `any` TypeScript type
- Write raw SQL queries (use query builder)
```

**Bad (vague):**
```markdown
### ✅ Always
- Follow best practices
- Write good code

### 🚫 Never
- Make mistakes
```

### 6. Troubleshooting (3-5 Real Issues)

**Pattern:**
```markdown
**[Specific error message or symptom]**
→ Cause: [Why this happens]
→ Fix: [Concrete solution with commands/code]
```

**Good:**
```markdown
**`QueryFailedError: relation "users" does not exist`**
→ Cause: Database migrations not run
→ Fix: Run `npm run migration:run`

**`UnauthorizedException: jwt expired`**
→ Cause: Access token expired (15min lifetime)
→ Fix: Frontend should call /auth/refresh with refresh_token

**EADDRINUSE: port 3001 already in use**
→ Cause: Previous process still running
→ Fix: `lsof -ti:3001 | xargs kill` or change port in .env
```

**Bad (not actionable):**
```markdown
**Errors happen**
→ Check the logs
```

## Component-Specific Sections

### Backend/API

Must include:
- **Database Schema** (if applicable)
  - Tables with columns, types, constraints
  - Indexes with purpose
  - Foreign key relationships

- **API Reference**
  - Method, Endpoint, Auth, Request, Response
  - Grouped by domain
  - Error codes for critical endpoints

Example:
```markdown
## Database Schema

### users
| Column | Type | Constraints | Note |
|--------|------|-------------|------|
| id | UUID | PK | - |
| email | VARCHAR(255) | Unique, Index | Fast lookup |
| is_available | BOOLEAN | Default true | For on-demand matching |

**Indexes:**
- `idx_users_email`: Fast authentication lookup
- `idx_matches_composite`: (user_one_id, user_two_id) prevents duplicates

## API Reference

### Auth
| Method | Endpoint | Auth | Request | Response |
|--------|----------|------|---------|----------|
| POST | /auth/login | ❌ | `{email, password}` | `{access_token, refresh_token}` |
```

### Frontend

Must include:
- **Pages/Routes Table**
  - Route, Component, Auth required, Description

- **Key Components**
  - Component name, Purpose, Key props

- **API Integration**
  - Fetch wrapper pattern
  - Token management
  - Error handling

Example:
```markdown
## Pages & Routes

| Route | Type | Description | Auth |
|-------|------|-------------|------|
| /login | Client | Login form | ❌ |
| /matches | Server* | Match list | ✅ |

*Server Component with nested Client Components

## Key Components

| Component | Purpose |
|-----------|---------|
| MatchCard | Display match with avatar, CTA |
| CoffeeButton | Trigger on-demand match |

## API Integration

\`\`\`typescript
// lib/api.ts - Fetch wrapper with auth
export async function apiClient<T>(endpoint: string) {
  const token = getAccessToken();
  const res = await fetch(\`\${API_BASE}\${endpoint}\`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: \`Bearer \${token}\` }),
    },
  });
  
  if (res.status === 401) {
    await refreshAccessToken();
    return apiClient<T>(endpoint); // Retry
  }
  
  return res.json();
}
\`\`\`
```

### Mobile

Must include:
- **Screen Navigation** (flow diagram or list)
- **Platform Differences** (iOS vs Android quirks)
- **Native Modules** (if any)
- **Offline Behavior** (caching, sync strategy)

## Cross-Component Consistency

When generating multiple claude.md files:

### Shared Type Definitions

Ensure types match across components:

**Backend (TypeScript):**
```typescript
// entities/user.entity.ts
export class User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  is_available: boolean;
}
```

**Frontend (TypeScript):**
```typescript
// types/index.ts
export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  is_available: boolean;
}
```

### API Contract Alignment

**Backend claude.md:**
```markdown
POST /matches/on-demand
Response: Match { id, user_one, user_two, type, status, matched_at }
```

**Frontend claude.md:**
```markdown
POST /matches/on-demand
Expected response: Match with id, user_one, user_two, type, status, matched_at
```

### Auth Flow Consistency

**Backend:**
```markdown
JWT Strategy:
- Access token: 15min expiration
- Refresh token: 7 days expiration
```

**Frontend:**
```markdown
Token Management:
- Store access (15min) in memory
- Store refresh (7d) in httpOnly cookie
- Refresh on 401 response
```

## Conventions Section Template

```markdown
## Conventions

### Naming
- **[Category]:** [Pattern] → [Example]
- **Files:** [Pattern] → [Example]

### Code Style
- [Framework-specific pattern 1]
- [Framework-specific pattern 2]

### Testing
- [Unit test approach]
- [Coverage requirements]
- [E2E test approach]
```

Example:
```markdown
## Conventions

### Naming
- **Entities:** Singular PascalCase → `User`, `Match`
- **DTOs:** Action + Entity + Dto → `CreateUserDto`
- **Files:** kebab-case → `users.service.ts`
- **DB columns:** snake_case → `user_id`, `created_at`

### Code Style
- One module per feature (auth/, users/, matches/)
- DTOs with class-validator for all inputs
- Services contain business logic, controllers route only

### Testing
- Unit tests for services (mock dependencies)
- E2E tests for critical user flows
- Target: 80% service coverage, 60% controller coverage
```

## Quality Checklist

Before finalizing claude.md:

- [ ] Overview clearly states purpose from PRD
- [ ] Stack table explains why each technology chosen
- [ ] Setup instructions are complete and tested
- [ ] Architecture section maps to PRD features
- [ ] Boundaries are specific and actionable
- [ ] Troubleshooting covers 3-5 real issues
- [ ] Component-specific sections complete
- [ ] Cross-references other components correctly
- [ ] Conventions are framework-appropriate
- [ ] No time-sensitive information

## Anti-Patterns to Avoid

### ❌ Vague Boundaries

**Bad:**
```markdown
### ✅ Always
- Do the right thing
- Follow best practices
```

**Good:**
```markdown
### ✅ Always
- Validate all DTOs with class-validator
- Use transactions for multi-table operations
```

### ❌ Generic Troubleshooting

**Bad:**
```markdown
**Something doesn't work**
→ Check the logs
```

**Good:**
```markdown
**`ECONNREFUSED` when calling API**
→ Cause: Backend not running
→ Fix: Start backend with `npm run dev` in api/ directory
```

### ❌ Missing "Why" Context

**Bad:**
```markdown
| NestJS | 10+ | Backend framework |
```

**Good:**
```markdown
| NestJS | 10+ | Chosen for modular architecture and native TypeScript support |
```

### ❌ Incomplete Setup

**Bad:**
```markdown
### Setup
\`\`\`bash
npm install
\`\`\`
```

**Good:**
```markdown
### Setup
\`\`\`bash
npm install

# Copy environment template
cp .env.example .env

# Required environment variables:
# - DATABASE_URL: PostgreSQL connection string
# - JWT_SECRET: Generate with `openssl rand -base64 32`

# Run migrations
npm run migration:run

# Seed dev data
npm run seed
\`\`\`
```
