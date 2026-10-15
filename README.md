# Nimbus — SaaS Starter

A production-minded SaaS starter built with **Next.js 15 (App Router)**, **TypeScript**, and
**Tailwind CSS v4** — featuring email/password authentication, a protected dashboard, typed API
routes, a full test suite (Jest + Playwright), CI, and a configured **AI-native development** setup.

---

## What's in this project

| Area | What's included |
| --- | --- |
| **Marketing site** | Landing page with hero, features, pricing, and FAQ — light/dark mode. |
| **Design system** | Shared UI primitives (`Button`, `Input`/`Field`, `Card`, `Badge`, `Alert`) in `components/ui`, with a live reference page at `/components`. |
| **Authentication** | Email + password sign-up/login. scrypt-hashed passwords and signed, `httpOnly` session cookies. No external auth dependencies. |
| **Protected dashboard** | App shell with sidebar nav + Overview, Settings, and Billing pages. Edge middleware for fast redirects + authoritative server-side session checks. |
| **API routes** | Typed Next.js route handlers (Zod-validated): auth (signup/login/logout/me), profile, team, and billing. |
| **Database** | Prisma ORM + SQLite (local file, zero setup). Async data layer in `lib/db.ts`; swap to Postgres by changing the schema. |
| **Data layer** | SWR client cache with optimistic mutations + SSR-seeded fallback (`hooks/`). |
| **Billing-ready** | End-to-end plan management, with a clear drop-in point for Stripe Checkout + webhooks. |
| **Testing** | Jest unit + integration (against a seeded SQLite test DB), Playwright E2E, and axe accessibility scans. |
| **CI** | GitHub Actions: typecheck, lint, unit, E2E, and Lighthouse budgets on every push/PR. |
| **AI-native setup** | Agent config for Claude Code, Cursor, and Copilot + a reusable prompt library. |

---

## Getting started

```bash
npm install
cp .env.example .env        # then set SESSION_SECRET (DATABASE_URL has a default)
npm run db:push             # create the SQLite schema
npm run db:seed             # seed the demo user + team
npm run dev
```

Open <http://localhost:3000>.

### Demo account

A demo user is seeded so you can log in immediately:

- **Email:** `demo@acme.com`
- **Password:** `password123`

> Note: data is stored in a local **SQLite** file (`prisma/dev.db`) via Prisma. Run `npm run db:reset` to wipe and re-seed it.

---

## Project structure

```
app/
  (auth)/              login & signup (route group, shared centered layout)
  dashboard/           protected shell + overview, settings, billing pages
  api/                 route handlers: auth (signup/login/logout/me), profile, billing
  page.tsx             marketing landing page
  layout.tsx           root layout (<body suppressHydrationWarning> for browser extensions)
  globals.css          Tailwind v4 config via @theme (no tailwind.config file)
components/            shared UI (Button, AuthForm, DashboardNav, PlanSelector, Logo, …)
lib/
  auth.ts              password hashing (scrypt) + session token signing (HMAC)
  db.ts                async data access layer over Prisma (the only ORM-aware module)
  prisma.ts            PrismaClient singleton
  seed.ts              seedDatabase() — demo user + team members
  session.ts           cookie helpers + getCurrentUser()
middleware.ts          edge guard for /dashboard/* (cookie-presence check)
tests/
  unit/                Jest unit tests (auth primitives)
  e2e/                 Playwright E2E tests (user journeys)

# Tooling & AI config
.github/workflows/ci.yml        CI pipeline
jest.config.js                  Jest config (@swc/jest transform)
playwright.config.ts            Playwright config (builds + serves the app)
CLAUDE.md                       Canonical AI agent context + rules
AGENTS.md                       Cross-tool agent entry point (points to CLAUDE.md)
.cursor/rules/project.mdc       Cursor project rules
.github/copilot-instructions.md GitHub Copilot instructions
docs/ai/prompts.md              Reusable prompt templates
```

---

## Scripts

| Command               | Description                          |
| --------------------- | ------------------------------------ |
| `npm run dev`         | Start the dev server                 |
| `npm run build`       | Production build                     |
| `npm run start`       | Run the production build             |
| `npm run lint`        | Lint                                 |
| `npm run typecheck`   | Type-check without emitting          |
| `npm test`            | Unit tests (Jest)                    |
| `npm run test:e2e`    | End-to-end tests (Playwright)        |
| `npm run test:e2e:ui` | Playwright in interactive UI mode    |

---

## Testing

A three-layer test pyramid:

- **Unit (Jest)** — `tests/unit/` covers pure logic: the security-sensitive auth primitives in
  `lib/auth.ts` (password hashing, unique salts, tamper-proof / expiry-checked session tokens) and
  the `db` team helpers. Transpiled with `@swc/jest` (fast, no separate ts config).
- **Integration (Jest)** — `tests/integration/` exercises the real API route handlers against the
  real session + `db` layers over `Request`/`Response` (no browser). Only the cookie store is
  mocked, so full session round-trips are observable: signup/login sets a cookie that the next
  handler reads. Covers auth, team, and billing endpoints incl. 401/400/403/409 paths.
- **E2E (Playwright)** — `tests/e2e/` drives a real browser through the core journeys: landing
  page, protected-route redirect, login (success + failure), logout, and team management.
  Playwright builds and serves the production app automatically (see `playwright.config.ts`).

```bash
npm test               # unit + integration (Jest)
npm run test:integration  # integration only
npm run test:e2e       # e2e — first run installs the browser: npx playwright install chromium
```

> Tip: don't run `npm run test:e2e` or `npm run build` while `npm run dev` is running — they share
> the `.next` cache. If you hit a `Cannot find module './xxx.js'` error, stop dev, `rm -rf .next`,
> and restart.

### CI

`.github/workflows/ci.yml` runs on every push/PR: typecheck + lint + unit tests in one job,
and Playwright E2E in another (with the HTML report uploaded as an artifact).

---

## AI-native development setup

This repo is configured to be worked on with AI coding agents — the "prompts, context, and rules"
layer that keeps agent output aligned with the architecture. All tools read from one source of
truth (`CLAUDE.md`) to avoid drift.

| File | Tool | Purpose |
| --- | --- | --- |
| [`CLAUDE.md`](./CLAUDE.md) | Claude Code | **Canonical** — stack, project map, conventions, security rules, quality gates. |
| [`AGENTS.md`](./AGENTS.md) | Any agent | Cross-tool entry point; TL;DR pointing to `CLAUDE.md`. |
| [`.cursor/rules/project.mdc`](./.cursor/rules/project.mdc) | Cursor | Project rules applied automatically on edits. |
| [`.github/copilot-instructions.md`](./.github/copilot-instructions.md) | GitHub Copilot | Instructions for code generation/completion. |
| [`docs/ai/prompts.md`](./docs/ai/prompts.md) | Any agent | Reusable prompt templates (add page, add API route, swap DB, security review, add tests). |

**Key rules encoded for agents** (see `CLAUDE.md` for the full list):

- Server Components by default; `"use client"` only when interactivity is needed.
- Authorization is verified with `getCurrentUser()` server-side — middleware only does a fast
  cookie-presence redirect, never authorization on its own.
- Never return `passwordHash` to the client — map users through `toPublicUser()`.
- All data access goes through the `db` object in `lib/db.ts` (the swap-in seam for a real DB).
- Auth error messages stay generic to avoid user enumeration.

**Quality gate** — AI-generated code is held to the same bar as hand-written code. Before any
change is accepted:

```bash
npm run typecheck && npm run build && npm test && npm run test:e2e
```

---

## Going to production

The starter uses Prisma + **SQLite** (a local file). To make it production-ready:

1. **Database** — point Prisma at Postgres (change `provider`/`url` in `prisma/schema.prisma`, then
   `npm run db:push`). The app only depends on the async `db` functions in `lib/db.ts`, so callers
   don't change.
2. **Payments** — update `app/api/billing/route.ts` to create a Stripe Checkout session and set the
   plan from a webhook.
3. **Secrets** — set a strong `SESSION_SECRET` and a real `DATABASE_URL` in your environment.

---

## Security notes

- Session cookies are `httpOnly`, `sameSite=lax`, and `secure` in production.
- Login returns the same error for unknown email and wrong password to avoid user enumeration.
- Passwords are hashed with scrypt and a per-user salt; hashes never leave the server.
- Session tokens are HMAC-signed and expiry-checked (tampering and expiry are covered by unit tests).

---

## Tech stack

TypeScript · React 19 · Next.js 15 (App Router) · Tailwind CSS v4 · Jest · Playwright · GitHub Actions.
Built AI-native with Claude Code.
