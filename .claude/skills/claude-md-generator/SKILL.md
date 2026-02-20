---
name: claude-md-generator
description: Generate technical documentation (claude.md files) for each stack component from a PRD. Creates separate claude.md for backend/API, frontend/web, mobile, and other components with architecture, setup instructions, conventions, API reference, and troubleshooting. Use after completing a PRD when user mentions tech stack like NestJS, Next.js, React Native, or asks to generate technical specifications.
---

# Stack Claude.md Generator

Create component-specific claude.md files from Product Requirements Documents.

## When to use

Trigger when:

- User has a completed PRD and wants technical specs
- User mentions "generate claude.md from PRD"
- User specifies tech stack components (NestJS backend, Next.js frontend, etc.)
- Following PRD Builder to create developer documentation

## Prerequisites

**Required:**

- PRD document (file or content in conversation)
- Tech stack specification (frameworks, databases, platforms)

**Optional:**

- Existing architecture diagrams
- Team coding conventions
- Deployment environment details

## Workflow

1. **Analyze PRD** → Extract technical requirements
2. **Identify components** → Determine claude.md files needed
3. **Map requirements** → Translate features to architecture
4. **Generate files** → Create component-specific claude.md
5. **Cross-reference** → Ensure consistency across files

## Component identification

Ask if not specified: "What's your tech stack?"

**Common patterns:**

Full-stack web:

- `api/claude.md` - Backend
- `web/claude.md` - Frontend

Mobile + backend:

- `api/claude.md` - Backend
- `mobile/claude.md` - App

Microservices:

- `services/auth/claude.md`
- `services/[domain]/claude.md`
- `web/claude.md`

## PRD to technical mapping

**From PRD features → Modules:**

```
"User login" → auth/ module with endpoints
"Weekly matching" → matches/ module with cron
"Profile editing" → users/ module with CRUD
```

**From PRD flow → Endpoints:**

```
"User logs in → sees match → marks complete"
→ POST /auth/login
→ GET /matches
→ PATCH /matches/:id/complete
```

**From PRD data → Schema:**

```
"Users have name, email, avatar"
→ users: id, email, password_hash, name, avatar_url

"Match status: pending/completed/skipped"
→ matches: status ENUM
```

## claude.md structure template

Use for every component:

```markdown
# [Project] – [Component]

## Overview

[What this does - 2-3 sentences from PRD context]

## Stack

| Tech        | Version | Note         |
| ----------- | ------- | ------------ |
| [Framework] | [X.Y+]  | [Why chosen] |

## Getting Started

### Prerequisites

- [Requirements]

### Setup

\`\`\`bash

# Commands with explanations

\`\`\`

### Running

\`\`\`bash
[dev/test/build commands]
\`\`\`

## Architecture

\`\`\`
[Directory structure with purpose annotations]
\`\`\`

**Pattern:** [Architectural approach]
**Data Flow:** [Step-by-step]

## [Component-Specific Section]

[Database Schema / API Routes / Pages / etc.]

## Conventions

### Naming

[Patterns for files, variables, etc.]

### Code Style

[Framework-specific patterns]

### Testing

[Strategy and requirements]

## Boundaries

### ✅ Always

[Safe autonomous actions]

### ⚠️ Ask First

[Needs discussion]

### 🚫 Never

[Prohibited - security, data, architecture]

## Troubleshooting

**[Common Error]**
→ Cause: [Why]
→ Fix: [How]

[3-5 common issues]

## Resources

- [Docs links]
```

## Backend/API specifics

Include:

- Database schema (tables, columns, indexes, relationships)
- API endpoints (method, path, auth, request/response)
- Auth strategy (JWT config, session management)
- Background jobs (cron schedules, queue workers)

Example endpoint table:

```markdown
| Method | Endpoint    | Auth | Body                | Response  |
| ------ | ----------- | ---- | ------------------- | --------- |
| POST   | /auth/login | ❌   | `{email, password}` | `{token}` |
| GET    | /users/me   | ✅   | -                   | `User`    |
```

## Frontend specifics

Include:

- Page routes (path, description, auth required)
- Key components (name, purpose, props)
- State management (approach, where used)
- API integration (fetch wrapper, error handling)

Example routes:

```markdown
| Route      | Component | Auth | Description |
| ---------- | --------- | ---- | ----------- |
| /login     | LoginPage | ❌   | Auth form   |
| /dashboard | Dashboard | ✅   | Main view   |
```

## Mobile specifics

Include:

- Screen navigation (flow diagram)
- Platform differences (iOS vs Android quirks)
- Native modules (if any)
- Offline behavior (caching, sync)

## Cross-component consistency

Ensure alignment:

- Shared types (User, Match definitions identical)
- API contracts (endpoint paths match)
- Error codes (consistent across stack)
- Auth flow (token handling matches)

## Best practice patterns

**Boundaries section:**

```markdown
### ✅ Always

- DTOs with validation
- Error handling with try/catch
- snake_case DB columns

### ⚠️ Ask First

- New entities/schema changes
- New npm dependencies
- Auth strategy changes

### 🚫 Never

- Passwords in plain text
- any TypeScript type
- Raw SQL queries
```

**Troubleshooting pattern:**

```markdown
**[Specific error message or symptom]**
→ Cause: [Why this happens]
→ Fix: [Concrete solution with commands]

Example:
**SQLITE_BUSY: database is locked**
→ Cause: Multiple processes accessing DB
→ Fix: Close other processes or use separate DB file for tests
```

## Quality checks

Before finalizing each claude.md:

- [ ] Maps to PRD requirements
- [ ] Setup instructions are complete
- [ ] Architecture matches tech stack
- [ ] Boundaries are specific
- [ ] Troubleshooting covers 3-5 real issues
- [ ] Cross-references other components correctly

## Output

Create files in appropriate directories:

- `/home/claude/api/claude.md`
- `/home/claude/web/claude.md`
- etc.

Present files to user with summary of what was generated and how components relate.

## Example generation

**User provides:**

- PRD for Coffee Roulette
- Stack: NestJS backend + Next.js frontend + SQLite

**Generate:**

1. `api/claude.md` with:
   - Auth, Users, Matches modules
   - SQLite schema
   - JWT strategy
   - Cron job for weekly matching

2. `web/claude.md` with:
   - Next.js 14 App Router
   - Auth flow (login/register pages)
   - Dashboard with match display
   - Profile with availability toggle

Both reference shared User/Match types and API contract.
