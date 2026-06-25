-- Migration 019: restrict client INSERT on children to non-privileged columns
-- Audit follow-up (2026-06-25). points and streak_days default to 0 and are
-- managed exclusively by the SECURITY DEFINER RPCs. Migration 017 revoked
-- UPDATE on them; this does the same for INSERT so a client cannot seed a child
-- with an arbitrary starting balance/streak at creation time.
--
-- NOTE: a column-level REVOKE cannot carve columns out of a broad table-level
-- INSERT grant. So we revoke the table-level INSERT and re-grant INSERT on
-- every column EXCEPT points and streak_days. The app's createChild payload
-- (AddChildModal) only sets family_id/name/date_of_birth/is_under_13/
-- parental_consent_*, all of which remain grantable, so this is transparent.

revoke insert on public.children from authenticated;

grant insert (
  id,
  family_id,
  name,
  date_of_birth,
  avatar_url,
  avatar_gradient,
  avatar_icon,
  age_tier_override,
  is_under_13,
  last_streak_date,
  parental_consent_given,
  parental_consent_at,
  created_at
) on public.children to authenticated;
