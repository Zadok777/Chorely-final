# AGENTS.md

Entry point for AI coding agents (Claude Code, Codex, and others) working in
this repository. This file is intentionally short — **[CLAUDE.md](./CLAUDE.md)
is the single source of truth** for rules, schema, and decisions. Read it first.

## Start-of-session protocol

1. Read [CLAUDE.md](./CLAUDE.md) completely (rules + schema + decisions log).
2. Read [PLANNING.md](./PLANNING.md) and [DESIGN.md](./DESIGN.md).
3. Skim [docs/PROJECT_STATE.md](./docs/PROJECT_STATE.md) for the current "resume here".
4. Review [TASKS.md](./TASKS.md) for what's done vs. pending.
5. Ask what to work on before writing code.

## Hard rules (see CLAUDE.md for the full list)

- **Expo Managed Workflow only.** Never `expo eject`. Bump the SDK only via
  `npx expo install --fix`, all together, and verify the app boots in Expo Go.
- **TypeScript strict, no `.js`/`.jsx`, no `any`** (use `unknown` + narrow).
- **Screens never call `supabase` directly** — all queries live in `src/services/`.
- **Point mutations go through SQL RPCs only** — never a direct client `UPDATE`
  to `children.points` / `streak_days`.
- **Theming:** never `import { C }` statically in new components — use
  `useTheme().C` + `useThemedStyles` (see CLAUDE.md §13 / theming notes).
- **Secrets** live in `.env.local` (gitignored). Never hardcode keys.
- **COPPA:** children are records, not users; never collect child PII beyond
  name + optional DOB.
- Ask before changing the **database schema, navigation structure, or auth logic**.

## Build / verify commands

```bash
npm run ios        # run on iOS Simulator (truth for the glass UI)
npx tsc --noEmit   # type-check
npm test           # Jest suite
```

## Backend

Supabase project: **Chorely App** (`zinbukzmkorkawbgckkh`). Schema and RPCs are
documented in [docs/DATA_MODEL.md](./docs/DATA_MODEL.md) and CLAUDE.md §5.
Regenerate types after any schema change → `src/types/database.types.ts`.
