# CLAUDE.md — Agent context & rules

Canonical guidance for AI coding agents (Claude Code, Cursor, Copilot) working in this repo.
Keep it accurate — it is the shared "context + rules" layer for AI-native development.

## What this is

**Nimbus** — a SaaS starter: Next.js 15 (App Router) · TypeScript · Tailwind CSS v4.
Email/password auth, a protected dashboard, and typed API routes. Data is in a
Prisma + SQLite database (a local file — zero external setup).

## Tech stack

- **Framework:** Next.js 15 App Router (React 19, Server Components by default)
- **Language:** TypeScript (strict)
- **Styling:** Tailwind CSS v4 (config lives in `app/globals.css` via `@theme`, no `tailwind.config`)
- **Auth:** dependency-free — scrypt password hashing + HMAC-signed session cookies (`lib/auth.ts`)
- **Database:** Prisma ORM + SQLite (`prisma/schema.prisma`, client in `lib/prisma.ts`)
- **Payments:** Stripe (optional, gated behind `STRIPE_SECRET_KEY`; `lib/stripe.ts`)
- **Testing:** Jest (unit/integration) · Playwright (E2E + axe a11y) · Lighthouse CI
- **CI:** GitHub Actions (`.github/workflows/ci.yml`)

## Project map

```
app/
  (auth)/          login & signup (route group, shared centered layout)
  dashboard/       protected shell + overview, settings, billing
  api/             route handlers: auth (signup/login/logout/me), profile, team, billing (+ billing/webhook)
  page.tsx         marketing landing page
  layout.tsx       root layout (<body suppressHydrationWarning> for extensions)
components/         feature UI (AuthForm, DashboardNav, PlanSelector, …)
  ui/              design system — shared primitives (Button, Input/Field, Card, Badge, Alert); barrel export at @/components/ui
hooks/             client data layer — SWR hooks (useUser, useTeam) with optimistic mutations
lib/
  schemas.ts       Zod validation schemas + inferred types (shared client/server)
  validation.ts    parseBody() — validate a request body against a schema in routes
  fetcher.ts       jsonFetcher (SWR) + apiRequest (mutations) + ApiError
  auth.ts          password hashing + session token signing (pure, unit-tested)
  db.ts            data access layer (async) over Prisma — the only module that touches the ORM
  prisma.ts        PrismaClient singleton
  seed.ts          seedDatabase() — demo user + team members (idempotent)
  stripe.ts        Stripe client (null unless configured) + plan→price mapping
prisma/
  schema.prisma    User + TeamMember models (SQLite)
  seed.ts          CLI entry (npm run db:seed) calling seedDatabase()
  session.ts       cookie + getCurrentUser() helpers (uses next/headers)
middleware.ts      edge guard for /dashboard/* (presence check only)
tests/unit/        Jest
tests/e2e/         Playwright
```

## Conventions (follow these)

- **Server Components by default.** Add `"use client"` only when you need state, effects, or browser events (see `components/AuthForm.tsx`).
- **Auth check pattern:** middleware does a *fast* cookie-presence redirect; the **authoritative** check is `getCurrentUser()` in `app/dashboard/layout.tsx` and in every API route. Never rely on middleware alone for authorization.
- **Never send `passwordHash` to the client.** Always map users through `toPublicUser()` (`lib/db.ts`).
- **Data access goes through the async `db` object** in `lib/db.ts` — the only module importing Prisma. Call sites `await` it. Don't import `@prisma/client` or `lib/prisma` elsewhere; add a method to `db` instead. Keep `db`'s domain types (not Prisma's) at the boundary.
- **API routes:** validate input, return `NextResponse.json({ error }, { status })` on failure. Keep auth errors generic (no user enumeration — see `app/api/auth/login/route.ts`).
- **One validation contract (Zod).** Request shapes live as Zod schemas in `lib/schemas.ts` (the single source of truth); types are *inferred* from them, never redeclared. Route handlers validate with `parseBody(request, schema)` (`lib/validation.ts`) **after** the auth check; client forms validate with `validate(schema, value)` before submitting. Add a field once, in the schema, and both sides pick it up.
- **Imports:** use the `@/*` path alias (e.g. `import { db } from "@/lib/db"`).
- **Styling:** Tailwind utilities; brand colors are `brand-50..900` (defined in `globals.css`). Support light + dark (`dark:` variants).
- **Use the design system.** Build forms/surfaces from `@/components/ui` primitives (`Field`, `Input`, `Select`, `Card`, `SectionCard`, `StatCard`, `Badge`, `Alert`, `Button`) instead of re-writing raw markup. See the live reference at `/components`. Add new shared primitives there, not inline.
- **Client data goes through the SWR data layer**, not ad-hoc `fetch` in components. Read with a hook in `hooks/` (`useUser`, `useTeam`) built on `useSWR`; mutate with `apiRequest` from `lib/fetcher.ts` via the hook, applying an optimistic `mutate` and then `router.refresh()` to sync server-rendered UI. Seed the cache from Server Components (`SWRProvider` fallback / `fallbackData`) so there's no loading flash.
- **No new dependencies** without a clear reason — the auth layer is intentionally dependency-free.

## Quality gates — ALWAYS run before accepting a change

```bash
npm run typecheck && npm run build && npm test && npm run test:e2e
```

AI-generated code is held to the same bar as hand-written code: it must type-check,
build, and pass unit + E2E tests. Review generated diffs for security (authz,
secret handling, input validation) and performance before keeping them.

## Commands

| Command              | Use                                  |
| -------------------- | ------------------------------------ |
| `npm run dev`        | Dev server (http://localhost:3000)   |
| `npm run db:push`    | Create/update the SQLite schema      |
| `npm run db:seed`    | Seed the demo user + team members    |
| `npm run db:reset`   | Force-reset the DB and re-seed       |
| `npm run build`      | Production build                     |
| `npm run typecheck`  | `tsc --noEmit`                       |
| `npm test`           | Jest unit tests                      |
| `npm run test:e2e`   | Playwright E2E (incl. axe a11y scans) |
| `npm run lighthouse` | Lighthouse CI (perf/a11y/SEO budgets) |

Accessibility is enforced two ways: axe (`@axe-core/playwright`) scans in
`tests/e2e/a11y.spec.ts` must report **zero** WCAG A/AA violations, and Lighthouse
CI (`lighthouserc.json`) gates the accessibility score. Keep both green.

Demo login: `demo@acme.com` / `password123`.

## When adding a feature

1. UI → `components/` (Server Component unless interactivity is needed).
2. Data/mutations → a route handler in `app/api/`, going through `lib/db.ts`.
3. Protected page → place under `app/dashboard/` (inherits the auth gate).
4. Add/extend tests: unit for pure logic (`lib/`), E2E for the user journey.
5. Run the quality gates above.

## Known constraints

- Data persists in a local SQLite file (`prisma/dev.db`, gitignored). First-time setup: `npm run db:push && npm run db:seed`. Jest and Playwright use their own `test.db` / `e2e.db`, reset + seeded automatically.
- Session cookies are `httpOnly`, `sameSite=lax`, `secure` in production.
- Billing (`app/api/billing/route.ts`) is Stripe-ready but **gated behind env**: with `STRIPE_SECRET_KEY` unset it updates the plan directly; when set, paid upgrades return a Checkout Session URL and `app/api/billing/webhook/route.ts` applies the plan. Stripe lives only in `lib/stripe.ts`.
