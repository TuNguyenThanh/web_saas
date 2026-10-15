# CLAUDE.md — Agent context & rules

Canonical guidance for AI coding agents (Claude Code, Cursor, Copilot) working in this repo.
Keep it accurate — it is the shared "context + rules" layer for AI-native development.

## What this is

**Nimbus** — a SaaS starter: Next.js 15 (App Router) · TypeScript · Tailwind CSS v4.
Email/password auth, a protected dashboard, and typed API routes. Data is in an
in-memory store so it runs with zero setup.

## Tech stack

- **Framework:** Next.js 15 App Router (React 19, Server Components by default)
- **Language:** TypeScript (strict)
- **Styling:** Tailwind CSS v4 (config lives in `app/globals.css` via `@theme`, no `tailwind.config`)
- **Auth:** dependency-free — scrypt password hashing + HMAC-signed session cookies (`lib/auth.ts`)
- **Testing:** Jest (unit) · Playwright (E2E)
- **CI:** GitHub Actions (`.github/workflows/ci.yml`)

## Project map

```
app/
  (auth)/          login & signup (route group, shared centered layout)
  dashboard/       protected shell + overview, settings, billing
  api/             route handlers: auth (signup/login/logout/me), profile, billing
  page.tsx         marketing landing page
  layout.tsx       root layout (<body suppressHydrationWarning> for extensions)
components/         feature UI (AuthForm, DashboardNav, PlanSelector, …)
  ui/              design system — shared primitives (Button, Input/Field, Card, Badge, Alert); barrel export at @/components/ui
lib/
  auth.ts          password hashing + session token signing (pure, unit-tested)
  db.ts            in-memory store + seeded demo user (swap for a real DB here)
  session.ts       cookie + getCurrentUser() helpers (uses next/headers)
middleware.ts      edge guard for /dashboard/* (presence check only)
tests/unit/        Jest
tests/e2e/         Playwright
```

## Conventions (follow these)

- **Server Components by default.** Add `"use client"` only when you need state, effects, or browser events (see `components/AuthForm.tsx`).
- **Auth check pattern:** middleware does a *fast* cookie-presence redirect; the **authoritative** check is `getCurrentUser()` in `app/dashboard/layout.tsx` and in every API route. Never rely on middleware alone for authorization.
- **Never send `passwordHash` to the client.** Always map users through `toPublicUser()` (`lib/db.ts`).
- **Data access goes through the `db` object** in `lib/db.ts` — don't reach into the store directly. This is the seam for swapping in Prisma/Drizzle later.
- **API routes:** validate input, return `NextResponse.json({ error }, { status })` on failure. Keep auth errors generic (no user enumeration — see `app/api/auth/login/route.ts`).
- **Imports:** use the `@/*` path alias (e.g. `import { db } from "@/lib/db"`).
- **Styling:** Tailwind utilities; brand colors are `brand-50..900` (defined in `globals.css`). Support light + dark (`dark:` variants).
- **Use the design system.** Build forms/surfaces from `@/components/ui` primitives (`Field`, `Input`, `Select`, `Card`, `SectionCard`, `StatCard`, `Badge`, `Alert`, `Button`) instead of re-writing raw markup. See the live reference at `/components`. Add new shared primitives there, not inline.
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
| `npm run build`      | Production build                     |
| `npm run typecheck`  | `tsc --noEmit`                       |
| `npm test`           | Jest unit tests                      |
| `npm run test:e2e`   | Playwright E2E                       |

Demo login: `demo@acme.com` / `password123`.

## When adding a feature

1. UI → `components/` (Server Component unless interactivity is needed).
2. Data/mutations → a route handler in `app/api/`, going through `lib/db.ts`.
3. Protected page → place under `app/dashboard/` (inherits the auth gate).
4. Add/extend tests: unit for pure logic (`lib/`), E2E for the user journey.
5. Run the quality gates above.

## Known constraints

- In-memory store resets on server restart (demo user is re-seeded).
- Session cookies are `httpOnly`, `sameSite=lax`, `secure` in production.
- Billing (`app/api/billing/route.ts`) updates the plan directly — the documented drop-in point for Stripe Checkout + webhooks.
