# GitHub Copilot instructions

Project: **Nimbus** — Next.js 15 (App Router) · TypeScript (strict) · Tailwind CSS v4 SaaS starter.
Canonical guidance is in `CLAUDE.md`; this file mirrors the key rules for Copilot.

When generating or completing code in this repo:

- Default to **React Server Components**. Only add `"use client"` for components that use
  state, effects, or browser events.
- Routing is the **App Router** (`app/`). Data mutations go in route handlers under `app/api/`.
- **Auth:** use the dependency-free helpers in `lib/auth.ts` and `lib/session.ts`. The
  authoritative session check is `getCurrentUser()` (server-side) — `middleware.ts` only
  does a fast cookie-presence redirect. Never authorize using middleware alone.
- **Never expose `passwordHash`** — send users through `toPublicUser()` from `lib/db.ts`.
- All data access goes through the `db` object in `lib/db.ts`.
- API handlers validate input and return `NextResponse.json({ error }, { status })`; keep
  auth error messages generic to avoid user enumeration.
- Use the `@/*` path alias for imports.
- Tailwind v4: config is in `app/globals.css` (`@theme`). Use `brand-*` colors and support
  `dark:` variants. There is no `tailwind.config` file.
- Add tests with changes: Jest (`tests/unit`) for pure logic, Playwright (`tests/e2e`) for flows.

Prefer small, typed, tested changes. Before a change is considered done, it must pass:
`npm run typecheck && npm run build && npm test && npm run test:e2e`.
