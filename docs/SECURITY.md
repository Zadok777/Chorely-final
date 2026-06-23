# Security

Security model for Chorely. See also CLAUDE.md §7 (auth), §10 (code standards),
§11 (Supabase rules), and [DATA_MODEL.md](./DATA_MODEL.md).

## Authentication & authorization

- **Parent-only auth** via Supabase email/password. Children are data records,
  never authenticated users.
- **RLS on every table**, gated by `is_family_member()`. Cross-family access is
  not possible; isolation has been audited.
- **Point/redemption mutations** run exclusively through `SECURITY DEFINER` RPCs
  with `FOR UPDATE` row locks to prevent race conditions. Clients cannot `UPDATE`
  points directly through the intended API path.
- `anon` has **no** EXECUTE on any RPC (revoked at the GRANT layer, migration
  012). `authenticated` holds EXECUTE only on user-facing RPCs + `is_family_member`
  (needed for RLS predicates).

## Secrets

- All keys live in `.env.local` (gitignored). Only the Supabase **anon** key and
  the RevenueCat **public** keys ship in the app.
- **Never** put the `service_role` key in the app or repo.
- Validate required env vars are present at startup.

## Data protection / COPPA

- Children: name + optional DOB only. Never prompt for email/phone/PII.
- `is_under_13` is auto-derived from DOB (`set_child_under_13` trigger);
  `parental_consent_*` fields support consent tracking.
- Audience is adults 18+ (not the Kids/Families category).
- In-app account deletion via `delete_user_account()` cascades all user data.

## Applied hardening

- **Migration 017 (2026-06-23):** revoked `authenticated` UPDATE on
  `children.points` / `streak_days` / `last_streak_date` / `is_under_13` and the
  identity columns; points/streaks now change only via the SECURITY DEFINER RPCs.
  Reimplemented `generate_invite_code` with `pgcrypto` (`gen_random_bytes`).
  Full rationale + verification in [STAGE1_BETA_READINESS_LOG.md](./STAGE1_BETA_READINESS_LOG.md) (Step 1).

## Known advisor notes (by design)

Supabase flags `authenticated`-executable `SECURITY DEFINER` functions. These are
**intentional** — they are the app's RPC API, and each function checks
`is_family_member()` before acting. No action required.

## Open / pre-launch items

- [ ] Enable **leaked-password protection** (requires Supabase Pro).
- [ ] Re-enable **email confirmation** before TestFlight/production (currently
      OFF in dev).
- [ ] Confirm no `console.log` of sensitive data before any TestFlight build.
- [ ] Decide production vs. dev Supabase project for launch.

## Pre-commit security checklist

- [ ] No hardcoded secrets (keys, tokens, passwords).
- [ ] All user input validated (Yup schemas at form boundaries).
- [ ] RLS enabled + policy present on any new table.
- [ ] Point mutations go through an RPC, not a client `UPDATE`.
- [ ] Error messages don't leak sensitive data.
