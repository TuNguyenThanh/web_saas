# Reusable prompt templates

A small library of prompts for working on this repo with a coding agent (Claude Code,
Cursor, Copilot Chat). They encode the project's conventions so agent output fits the
architecture on the first try. Fill in the `{{...}}` placeholders.

> Every prompt assumes the agent has read `CLAUDE.md`. End each task by running the
> quality gates: `npm run typecheck && npm run build && npm test && npm run test:e2e`.

---

## 1. Add a protected dashboard page

```
Add a new protected page at /dashboard/{{route}} that {{what it shows/does}}.

Follow CLAUDE.md:
- Server Component by default; only use "use client" for interactive parts, in a
  separate component under components/.
- Read the current user with getCurrentUser(); it inherits the auth gate from
  app/dashboard/layout.tsx.
- Match the visual style of existing dashboard pages (cards, spacing, dark mode).
- Add a Playwright test in tests/e2e covering the main interaction.
Then run the quality gates.
```

## 2. Add an API route + data operation

```
Add a {{GET|POST|PATCH}} /api/{{name}} route handler that {{behavior}}.

Requirements:
- Authenticate with getCurrentUser(); return 401 if not signed in.
- Validate the input; on bad input return NextResponse.json({ error }, { status: 400 }).
- Do all persistence through the `db` object in lib/db.ts — add a method there if needed,
  don't touch the store directly.
- Never return passwordHash; use toPublicUser().
- Add a unit test for any new pure logic and/or extend the E2E flow.
Then run the quality gates.
```

## 3. Swap the in-memory store for a real database

```
Replace the in-memory store in lib/db.ts with {{Prisma + SQLite | Drizzle + Postgres}},
keeping the exported `db` interface (getUserById, getUserByEmail, createUser, updateUser)
and toPublicUser() identical so no callers change.

- Add the schema/migration and a seeded demo user (demo@acme.com / password123).
- Keep password hashing in lib/auth.ts unchanged.
- Update README and .env.example.
Then run the quality gates.
```

## 4. Review AI-generated code (security pass)

```
Review the current diff as a senior engineer. Flag, with file:line and a concrete fix:
- Authorization gaps (missing getCurrentUser checks, trusting middleware alone).
- Secret/PII leakage (passwordHash or tokens reaching the client).
- Missing/weak input validation; user-enumeration in auth responses.
- Hydration or Server/Client Component boundary mistakes.
- Performance issues (unnecessary client components, N+1 data access).
Only report real issues; cite the CLAUDE.md rule each one violates.
```

## 5. Add a test for existing behavior

```
Add tests for {{feature/flow}}:
- Pure logic in lib/** -> Jest in tests/unit (transpiled via @swc/jest).
- User-facing flow -> Playwright in tests/e2e, using role/label selectors like the
  existing auth.spec.ts.
Cover the happy path and at least one failure case. Then run npm test && npm run test:e2e.
```
