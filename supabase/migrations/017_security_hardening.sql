-- Migration 017: security hardening (beta-readiness)
--
-- Addresses audit findings carried over from the prior project. Verified against
-- the live schema + app code on 2026-06-23 before applying (see docs/STAGE1_BETA_READINESS_LOG.md).
--
--   M1 (FIX): `authenticated` held UPDATE on ALL columns of public.children,
--             so a family member could PATCH children.points / streak_days
--             directly via PostgREST, bypassing the approve_chore / redeem_reward
--             RPCs and the point_transactions ledger (loss of the audit trail and
--             a data-integrity hole). Restrict UPDATE to the columns a parent
--             legitimately edits (verified: the app only writes avatar_*/age_tier_override
--             via updateChild). points / streak_days / last_streak_date / is_under_13
--             and the identity columns (id / family_id / created_at) now change ONLY
--             through the SECURITY DEFINER RPCs and triggers, which run as the
--             table owner and bypass these grants.
--
--   L  (FIX): invite codes used non-crypto random(). Switch to pgcrypto's
--             gen_random_bytes (pgcrypto lives in the `extensions` schema). A byte
--             is 0..255 and the alphabet is 32 chars; 256 % 32 = 0, so the modulo
--             mapping is unbiased.
--
--   M2 (REVIEWED — NO CHANGE): update_streak is client-callable, but its body can
--             only decay or no-op a streak (it never increases one), and the app
--             calls it after approve_chore (src/services/rpc.ts). Left callable.
--             Rate-limiting join_family_by_code is deferred to v1.1: crypto-random
--             codes make brute force infeasible at v1.0 scale (32^8 ≈ 1.1e12
--             combinations, each guess an authenticated RPC round-trip).

-- ---- M1: lock down children point / identity columns ----
revoke update on public.children from authenticated;

grant update (
  name,
  date_of_birth,
  avatar_url,
  avatar_gradient,
  avatar_icon,
  age_tier_override,
  parental_consent_given,
  parental_consent_at
) on public.children to authenticated;

-- ---- L: crypto-secure invite codes ----
-- CREATE OR REPLACE preserves the existing EXECUTE grants from migrations 011/012
-- (the function is only invoked as a column default inside the SECURITY DEFINER
-- complete_onboarding RPC, i.e. as the table owner).
create or replace function public.generate_invite_code()
returns text
language plpgsql
set search_path = public
as $$
declare
  chars  text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; -- 32 chars; 0/O/1/I removed
  result text := '';
  i int;
  b int;
begin
  for i in 1..8 loop
    b := get_byte(extensions.gen_random_bytes(1), 0); -- 0..255, uniform over 32
    result := result || substr(chars, 1 + (b % length(chars)), 1);
  end loop;
  return result;
end;
$$;
