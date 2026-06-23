# Stage 1 — Beta Readiness Work Log

A step-by-step, auditable record of the work to get Chorely into testers' hands.
Each step documents: **objective → investigation (how we concluded) → decision →
change → verification → result → follow-ups**. Newest steps are appended.

Backend: Supabase project **Chorely App** (`zinbukzmkorkawbgckkh`).
Repo: `Zadok777/Chorely-final`.

---

## Stage 1 checklist (order of execution)

1. [x] **Security fixes** — lock down direct point edits + invite-code generation
2. [ ] Replace placeholder app icons with finals
3. [ ] Remove stray `console.log`; clear expo-doctor warnings
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
