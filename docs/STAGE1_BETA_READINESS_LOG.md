# Stage 1 — Beta Readiness Work Log

A step-by-step, auditable record of the work to get Chorely into testers' hands.
Each step documents: **objective → investigation (how we concluded) → decision →
change → verification → result → follow-ups**. Newest steps are appended.

Backend: Supabase project **Chorely App** (`zinbukzmkorkawbgckkh`).
Repo: `Zadok777/Chorely-final`.

---

## Stage 1 checklist (order of execution)

1. [x] **Security fixes** — lock down direct point edits + invite-code generation
2. [x] **App icons** — verified real branded icon, Apple-compliant (no replacement needed)
3. [x] **Code hygiene** — console logs reviewed; expo-doctor 18/18 (fixed peer deps)
4. [ ] Apple Developer + Google Play accounts
5. [ ] EAS production/preview build (iOS + Android)
6. [ ] Finish RevenueCat paywall + IAP products + sandbox purchase test
7. [ ] Re-enable email confirmation for real testers
8. [ ] Full manual QA pass on device

---

## Step 1 — Security hardening (migration 017) · 2026-06-23 · ✅ Done

### Objective
Close the open security findings carried over from the prior project before any
real user touches the app, without breaking existing features.

### Investigation (how we concluded)
We verified each finding against the **live database and the app code** rather
than trusting the old audit note:

- **M1 — direct point edits.** Queried `information_schema.role_column_grants`:
  the `authenticated` role had `UPDATE` on **all 15** `children` columns,
  including `points`, `streak_days`, `last_streak_date`, plus identity columns
  (`id`, `family_id`, `created_at`) and the trigger-derived `is_under_13`.
  → A signed-in family member could `PATCH /rest/v1/children` to change points
  directly, bypassing the `approve_chore` / `redeem_reward` RPCs and the
  `point_transactions` audit ledger. **Confirmed real.**
  We then grepped the app: the only writer of `children` is
  `updateChild()` (src/services/children.ts), and its sole caller
  (`ProfileEditModal`) writes just `avatar_gradient`, `avatar_icon`,
  `age_tier_override`. → Safe to revoke the sensitive columns.

- **L — invite codes.** `generate_invite_code` (migration 002) used non-crypto
  `random()`. Codes are 8 chars over a 32-char alphabet. Confirmed `pgcrypto`
  is available **and** installed (schema `extensions`), so we can use
  `gen_random_bytes`. A byte is 0..255 and `256 % 32 = 0`, so mapping bytes onto
  the alphabet with `%` is **unbiased**. **Confirmed worth fixing.**

- **M2 — `update_streak` client-callable.** Read the function body: it only
  **decays or no-ops** a streak (sets it to 0 when a day was skipped, otherwise
  leaves it unchanged) — it can never *inflate* a streak. The app legitimately
  calls it after `approve_chore` (src/services/rpc.ts). → The old "streak
  inflation" concern is **inaccurate**; revoking it would break a real call.
  **Reviewed — no change.**

### Decision
- **M1 (fix):** Restrict `authenticated` UPDATE on `children` to the
  parent-editable columns only. Points/streaks/identity change exclusively
  through the SECURITY DEFINER RPCs and triggers (which run as the table owner
  and bypass column grants).
- **L (fix):** Reimplement `generate_invite_code` with
  `extensions.gen_random_bytes`.
- **M2 (no change):** Documented rationale above.
- **Rate-limiting `join_family_by_code` (deferred to v1.1):** crypto-random
  codes make brute force infeasible at v1.0 scale (32^8 ≈ 1.1×10¹² combinations,
  each guess an authenticated RPC round-trip). Revisit with a proper attempt
  counter if/when the user base grows.

### Change
`supabase/migrations/017_security_hardening.sql` — applied via MCP `apply_migration`.

```sql
revoke update on public.children from authenticated;
grant update (name, date_of_birth, avatar_url, avatar_gradient, avatar_icon,
              age_tier_override, parental_consent_given, parental_consent_at)
  on public.children to authenticated;
-- + crypto-secure generate_invite_code() using extensions.gen_random_bytes
```

### Verification
- `authenticated` UPDATE columns are now exactly:
  `age_tier_override, avatar_gradient, avatar_icon, avatar_url, date_of_birth,
  name, parental_consent_at, parental_consent_given`.
- `has_column_privilege('authenticated','children','points','UPDATE')` → **false**
- `has_column_privilege(...,'streak_days','UPDATE')` → **false**
- App-needed columns still writable (`avatar_icon`, `age_tier_override` → true).
- `generate_invite_code()` returns valid 8-char codes (samples: `VHGCVR4V`,
  `LMY7LL75`, `55GQE5WJ`).
- Security advisor re-run: no new issues — only the pre-existing **by-design**
  SECURITY DEFINER notices (our RPC API) and the known
  leaked-password-protection item (needs Supabase Pro).

### Result
Points and streaks can now be changed **only** through the audited RPC path.
Invite codes are cryptographically random. No app feature affected.

### Follow-ups
- Rate-limit `join_family_by_code` (v1.1).
- Enable leaked-password protection at launch (requires Supabase Pro).

---

## Step 2 — App icons · 2026-06-23 · ✅ Done (no change needed)

### Objective
Ensure the app ships with a real, store-compliant icon (the old checklist said
"replace placeholder icons").

### Investigation (how we concluded)
- Listed `assets/` icons and `app.json` config: `icon.png`, `favicon.png`, and a
  full Android adaptive set (`android-icon-foreground/background/monochrome.png`)
  are all present and wired in `app.json`.
- Opened `icon.png`: it is a real, on-brand **Chorely smiley** (pink→orange
  gradient border, white rounded square, smiley) on the lavender brand
  background — **not** an Expo default or blank placeholder.
- Checked Apple's hard requirement (icons must not carry an alpha channel):
  `sips` reports `hasAlpha: no`, `1024×1024`. → Compliant.

### Decision / Result
The old "placeholder" note is **outdated**. The icon is real and store-ready;
**no replacement required** for beta. Optional future polish (a designer tightening
the artwork to fill more of the frame) is cosmetic, not blocking.

### Follow-ups
- (Optional) Commission tightened final icon artwork before public launch.

---

## Step 3 — Code hygiene (console logs + expo-doctor) · 2026-06-23 · ✅ Done

### Objective
Remove stray debug logging and clear tooling warnings before building.

### Investigation (how we concluded)
- **console:** grep found only **3** `console.*` calls, all `console.warn` in
  `src/lib/revenuecat.ts`, each guarded by `if (__DEV__)` → stripped from
  production builds. → Compliant; nothing to remove.
- **expo-doctor:** initial run = 16/18. Two real failures:
  1. Missing peer dependency **`expo-asset`** (required by `expo-audio`) — would
     risk a crash in a standalone (non-Expo-Go) build.
  2. Patch drift on `expo` (54.0.34→54.0.35) and `expo-font` (14.0.11→14.0.12).

### Change
- `npx expo install expo-asset expo expo-font` — installed `expo-asset@~12.0.13`
  (config plugin auto-added to `app.json`), bumped `expo`/`expo-font` to expected
  patches.
- This re-resolution **pruned `babel-preset-expo`** (only present transitively),
  which `babel.config.js` and Jest require — caught immediately by the test suite
  failing to load ("Cannot find module 'babel-preset-expo'"). Reinstalled it; the
  default `npm install` pulled `^56` (a major mismatch for SDK 54), so we pinned
  the SDK-correct `~54.0.10` via `npx expo install babel-preset-expo` and removed
  the stray duplicate.

### Verification
- `expo-doctor`: **18/18 checks passed**.
- `npx tsc --noEmit`: clean.
- `npm test`: **16/16 passing**.

### Result
Tooling is clean and the dependency set is consistent with Expo SDK 54 — a
prerequisite for a successful EAS build (Step 5). No production debug logging.

### Lesson recorded
Running `expo install` can prune transitive build deps; always re-run
`expo-doctor` + `npm test` after dependency changes, and pin build-critical
packages (like `babel-preset-expo`) explicitly via `expo install`, not `npm install`.
