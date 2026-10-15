# AGENTS.md

Cross-tool entry point for AI coding agents (the emerging `AGENTS.md` convention).

**The full context, conventions, and quality gates live in [`CLAUDE.md`](./CLAUDE.md). Read it first.**

TL;DR for any agent working here:

- Next.js 15 App Router · TypeScript (strict) · Tailwind v4. Server Components by default; `"use client"` only when needed.
- Auth is dependency-free (`lib/auth.ts`). Never leak `passwordHash` — map through `toPublicUser()`.
- All data access goes through the `db` object in `lib/db.ts`.
- Authoritative auth check is `getCurrentUser()` server-side, not middleware.
- Before accepting any change, run:
  `npm run typecheck && npm run build && npm test && npm run test:e2e`
- Reusable prompt templates: [`docs/ai/prompts.md`](./docs/ai/prompts.md).
