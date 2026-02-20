# Coffee Roulette

## Obiettivo

App interna per abbinare colleghi random per un caffè. Match settimanale automatico + possibilità di match on-demand istantaneo.

## Struttura Monorepo

```
coffee-roulette/
├── api/          # Backend NestJS
└── web/          # Frontend Next.js
```

Ogni cartella ha il proprio `claude.md` con regole specifiche. Leggi SEMPRE il claude.md della cartella in cui stai lavorando.

## Stack Globale

| Layer    | Tech                 | Version          |
| -------- | -------------------- | ---------------- |
| Backend  | NestJS               | 10+              |
| Frontend | Next.js              | 14+              |
| Database | SQLite               | 3                |
| Auth     | JWT                  | Access + Refresh |
| UI       | Tailwind + shadcn/ui | Latest           |

## Convenzioni Globali

- Package manager: `npm` (mai yarn o pnpm)
- Naming DB columns: `snake_case`
- Naming funzioni: `camelCase`
- Naming classi/componenti: `PascalCase`
- Lingua codice: Inglese
- Lingua commenti: Inglese

## Boundaries Globali

- ✅ **Always:** Segui convenzioni naming, scrivi in inglese
- ⚠️ **Ask first:** Modifiche cross-project (api ↔ web)
- 🚫 **Never:** Commit secrets, modificare .env files, installare package manager diversi

## Comunicazione API ↔ Web

- Base URL API: `http://localhost:3001/api`
- Frontend dev: `http://localhost:3000`
- Tutti gli endpoint API sono prefissati con `/api`
