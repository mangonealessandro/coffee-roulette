# Coffee Roulette – API

## Overview

Backend REST API per matchare colleghi casuali per pause caffè.
Gestisce match settimanali automatici e richieste on-demand in tempo reale.

**Problema risolto:** Favorire connessioni spontanee tra colleghi in aziende remote/ibride.

## Stack

| Tech    | Version | Note                                                                               |
| ------- | ------- | ---------------------------------------------------------------------------------- |
| NestJS  | 10+     | Framework principale, scelto per architettura modulare e TypeScript native         |
| SQLite  | 3       | Database locale per dev (prod userà PostgreSQL)                                    |
| TypeORM | 0.3+    | ORM per entities. SQLite = no advanced features (full-text search, JSON operators) |
| JWT     | -       | Access token 15min (security), Refresh 7d (UX)                                     |
| Jest    | -       | Testing framework, configurato per unit + integration                              |

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Setup

```bash
# Installa dipendenze
npm install

# Crea database e tabelle
npm run db:migrate

# Popola con utenti fake per dev
npm run db:seed

# Avvia in dev mode
npm run start:dev  # Porta 3001
```

### Running

```bash
npm run start:dev    # Watch mode su porta 3001
npm run test         # Run tutti i test
npm run test:watch   # Test in watch mode
npm run build        # Build produzione
```

**Env vars necessarie:**

- `JWT_SECRET` - Secret per firma token (genera con `openssl rand -base64 32`)
- `JWT_REFRESH_SECRET` - Secret per refresh token
- `DATABASE_PATH` - Path al file SQLite (default: `./db.sqlite`)

## Architecture

```
api/src/
├── auth/              # Autenticazione: login, register, JWT strategy
│   ├── dto/           # LoginDto, RegisterDto
│   ├── guards/        # JwtAuthGuard
│   └── strategies/    # JWT Passport strategy
├── users/             # Gestione utenti e profili
│   ├── dto/           # UpdateProfileDto, ToggleAvailabilityDto
│   └── users.service.ts
├── matches/           # Core business logic
│   ├── dto/           # CreateMatchDto, CompleteMatchDto
│   ├── matches.service.ts  # Algoritmo matching
│   └── matches.cron.ts     # Job settimanale automatico
├── common/            # Shared utilities
│   ├── guards/        # AuthGuard, RolesGuard
│   ├── decorators/    # @CurrentUser(), @Public()
│   └── filters/       # GlobalExceptionFilter
└── database/
    ├── entities/      # TypeORM entities (User, Match)
    └── seeds/         # Seed data per dev/test
```

**Pattern architetturale:** Modular monolith con separazione per domain

**Data flow principale:**

1. Request → Guard (JWT validation) → Controller
2. Controller → Service (business logic) → Repository (TypeORM)
3. Service → Response DTO → Client

## Database Schema

### users

| Column        | Type    | Note                             |
| ------------- | ------- | -------------------------------- |
| id            | INTEGER | PK, autoincrement                |
| email         | TEXT    | Unique, indice per lookup veloci |
| password_hash | TEXT    | Bcrypt con salt rounds = 10      |
| name          | TEXT    | Display name                     |
| avatar_url    | TEXT    | Nullable, URL esterno            |
| is_available  | INTEGER | 0/1, flag per match on-demand    |
| created_at    | TEXT    | ISO 8601 timestamp               |

### matches

| Column       | Type    | Note                                    |
| ------------ | ------- | --------------------------------------- |
| id           | INTEGER | PK                                      |
| user_one_id  | INTEGER | FK → users, parte del composite index   |
| user_two_id  | INTEGER | FK → users, parte del composite index   |
| type         | TEXT    | 'weekly' (cron) o 'on_demand' (manuale) |
| status       | TEXT    | 'pending' → 'completed' o 'skipped'     |
| matched_at   | TEXT    | ISO 8601, quando creato                 |
| completed_at | TEXT    | Nullable, quando marcato completed      |

**Indici:** Composite su `(user_one_id, user_two_id)` per prevenire duplicati e speed up queries.

## API Reference

### Auth

| Method | Endpoint             | Body                        | Descrizione                    |
| ------ | -------------------- | --------------------------- | ------------------------------ |
| POST   | `/api/auth/register` | `{ email, password, name }` | Registrazione nuovo utente     |
| POST   | `/api/auth/login`    | `{ email, password }`       | Login → access + refresh token |
| POST   | `/api/auth/refresh`  | `{ refresh_token }`         | Rinnova access token           |

### Users

| Method | Endpoint                     | Body                    | Descrizione                |
| ------ | ---------------------------- | ----------------------- | -------------------------- |
| GET    | `/api/users/me`              | -                       | Profilo utente corrente    |
| PATCH  | `/api/users/me`              | `{ name?, avatar_url?}` | Aggiorna profilo           |
| PATCH  | `/api/users/me/availability` | `{ is_available }`      | Toggle disponibilità caffè |

### Matches

| Method | Endpoint                    | Body | Descrizione                            |
| ------ | --------------------------- | ---- | -------------------------------------- |
| GET    | `/api/matches`              | -    | Lista match utente (pending + history) |
| POST   | `/api/matches/on-demand`    | -    | Crea match immediato con user random   |
| PATCH  | `/api/matches/:id/complete` | -    | Marca match come completato            |
| PATCH  | `/api/matches/:id/skip`     | -    | Salta match (non interessato)          |

**Auth:** Tutti gli endpoint richiedono JWT tranne `/auth/register` e `/auth/login`.

## Conventions

### Naming

- **Entities:** Singular PascalCase → `User`, `Match`
- **DTOs:** Action + Entity + Dto → `CreateUserDto`, `UpdateMatchDto`
- **Files:** kebab-case → `users.service.ts`, `auth.controller.ts`
- **DB columns:** snake_case → `user_id`, `created_at`
- **Endpoints:** kebab-case → `/users/me`, `/matches/on-demand`

### Code Style

- **1 modulo per feature:** `auth.module.ts` importa `UsersModule` se serve user lookup
- **DTOs obbligatori:** Ogni input/output deve avere DTO con class-validator
- **Entities in `/database/entities/`:** Mai import diretto da service, sempre via Repository
- **Guards su tutto:** Usa `@UseGuards(JwtAuthGuard)` o global guard con `@Public()` decorator per eccezioni

### Testing

- **Unit test:** Mock dependencies, testa business logic isolata
- **Integration test:** Database in-memory per test E2E di flow completi
- **Coverage minimo:** 80% su services, 60% su controllers

### Esempio DTO completo

```typescript
// src/auth/dto/register.dto.ts
import { IsEmail, IsString, MinLength } from "class-validator";

export class RegisterDto {
  @IsEmail({}, { message: "Email non valida" })
  email: string;

  @IsString()
  @MinLength(8, { message: "Password deve essere minimo 8 caratteri" })
  password: string;

  @IsString()
  @MinLength(2, { message: "Nome deve essere minimo 2 caratteri" })
  name: string;
}
```

### Esempio Service Pattern

```typescript
// src/matches/matches.service.ts
@Injectable()
export class MatchesService {
  constructor(
    @InjectRepository(Match) private matchRepo: Repository<Match>,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  async createOnDemandMatch(currentUserId: number): Promise<Match> {
    // 1. Trova utenti disponibili (escluso current user)
    // 2. Filtra utenti già matchati questa settimana
    // 3. Random pick
    // 4. Crea match con type='on_demand'
  }
}
```

## Boundaries

### ✅ Always (fai autonomamente)

- Aggiungere DTOs con class-validator per nuovi endpoint
- Creare unit test per nuovi services
- Usare snake_case per colonne database
- Wrappare logica in transactions per operazioni multi-step
- Loggare errori con `Logger` di NestJS

### ⚠️ Ask First (discuti con team)

- Aggiungere nuove entities o modificare schema esistente
- Cambiare strategia JWT (expiration, refresh logic)
- Introdurre nuove dipendenze esterne
- Modificare algoritmo di matching
- Creare nuovi cron jobs

### 🚫 Never (vietato)

- Password in chiaro o hash custom (usa sempre bcrypt)
- JWT secret hardcoded in codice (solo env vars)
- Raw SQL queries (usa sempre TypeORM query builder)
- Disabilitare validation sui DTOs
- Commit file `db.sqlite` (è in `.gitignore`)
- Esporre stack traces in risposta API (usa exception filters)

## Troubleshooting

### `SQLITE_BUSY: database is locked`

**Causa:** Più processi accedono al DB simultaneamente (es: test + dev server)

**Fix:** Chiudi altri processi o usa `DATABASE_PATH=./test.db` per test

### `UnauthorizedException: jwt expired`

**Causa:** Access token scaduto (15min lifetime)

**Fix:** Frontend deve chiamare `/auth/refresh` con refresh token

### `QueryFailedError: UNIQUE constraint failed: users.email`

**Causa:** Tentativo di registrare email già esistente

**Fix:** Gestito da `GlobalExceptionFilter`, ritorna 409 Conflict. Frontend deve mostrare errore appropriato.

### TypeORM migration fails con SQLite

**Causa:** SQLite non supporta ALTER TABLE complessi (add/drop constraints)

**Fix:** Crea nuova tabella → copia dati → drop vecchia → rename. Vedi `migrations/XXXXXX-example.ts`

### Match algorithm non trova utenti disponibili

**Causa:** Tutti gli utenti hanno `is_available = 0` o sono già matchati

**Fix:** Algoritmo ritorna `null`, controller gestisce con 404 "Nessun utente disponibile al momento"

## Migration da SQLite a PostgreSQL (Prod)

Quando si passa a prod:

1. Cambia driver in `app.module.ts`: `type: 'postgres'`
2. Update env vars: `DATABASE_URL=postgresql://...`
3. Re-run migrations: `npm run migration:run`
4. Abilita feature PostgreSQL se necessario (full-text search, JSON operators)

**Differenze chiave:**

- PostgreSQL ha `BOOLEAN` nativo (SQLite usa INTEGER 0/1)
- PostgreSQL supporta `ARRAY` columns (utile per feature future)
- Timestamp handling migliore in PostgreSQL

## Resources

- [NestJS Docs](https://docs.nestjs.com) - Framework reference
- [TypeORM Docs](https://typeorm.io) - ORM e migrations
- [SQLite Limitations](https://www.sqlite.org/limits.html) - Cosa evitare
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725) - Security considerations
