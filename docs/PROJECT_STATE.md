# Project State — "Resume Here"

> Living snapshot of where the project stands. Update at the end of each work
> session. For the full task history see [TASKS.md](../TASKS.md); for rules and
> schema see [CLAUDE.md](../CLAUDE.md).

_Last updated: 2026-06-23_

## Status at a glance

- **Phase:** v1.0 feature-complete; in App Store / Play readiness.
- **App folder:** `~/Desktop/Chorely 2/` (package name `chorely`).
- **Repo:** `https://github.com/Zadok777/Chorely-final.git` (`origin`, branch `main`).
- **Supabase:** project **Chorely App** (`zinbukzmkorkawbgckkh`), personal account.
  16 migrations applied; 12 tables (RLS on) + 12 RPCs.
- **RevenueCat:** SDK wired; entitlement `Chorely Pro`; paywall design + sandbox
  purchase test still pending (needs a dev build).

## Recently completed

- Migrated the backend to a new Supabase project on the personal account and
  re-applied all 16 migrations (2026-06-23).
- Re-pointed the app (`.env.local`) and regenerated types; verified booting in
  the iOS Simulator.
- Moved to the new GitHub repo (`Chorely-final`); removed old remotes; scrubbed
  old project/repo references from the docs.
- Added project documentation set (this file, README, AGENTS.md, docs/*).

## Pending (resume here)

1. **Flip email confirmation OFF** for dev on the new Supabase project
   (Authentication → Sign In/Providers → Email → uncheck "Confirm email").
2. **Delete old artifacts** — old GitHub repo `doulosnexus-lang/Chorely` and the
   old Supabase project `kwwhuwegzdaqstqhmths` (different account; delete in its
   own dashboard).
3. **RevenueCat paywall** — design the offering, build a dev build, run a sandbox
   purchase test.
4. **Store readiness** — production Supabase decision + re-enable email
   confirmation; Apple Developer + Google Play accounts, app records, App
   Privacy / Data Safety forms; screenshots + metadata.
5. **Tests** — stand up the Jest suite (see [TEST_PLAN.md](./TEST_PLAN.md));
   currently minimal coverage.

## Known gotchas

- `~/Desktop` is iCloud-synced; `.git` objects can become "dataless" and break
  pushes. If a push dies with SIGBUS/`pack-objects`, materialize files first.
- Disk pressure can truncate `node_modules` during installs — prefer `npm ci`.
- `BlurView` is a no-op on web; verify the glass UI on the iOS Simulator.
