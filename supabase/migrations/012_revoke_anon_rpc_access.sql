-- Migration 012: revoke anon EXECUTE on SECURITY DEFINER functions
--
-- Supabase auto-grants EXECUTE on every public-schema function to the `anon`,
-- `authenticated`, and `service_role` roles. That grant is separate from the
-- default PUBLIC grant we revoked in 011, so anon could still call our RPCs
-- (the in-function is_family_member() check would have rejected them, but it
-- is better to refuse at the GRANT layer for defense-in-depth).
--
-- After this migration:
--   - anon cannot execute any user-facing RPC
--   - anon and authenticated both lose EXECUTE on internal helpers/triggers
--   - authenticated keeps EXECUTE only on the user-callable RPCs and
--     is_family_member (which is needed for RLS predicates)

-- User-facing RPCs: revoke anon, keep authenticated
revoke execute on function public.submit_chore(uuid) from anon;
revoke execute on function public.approve_chore(uuid) from anon;
revoke execute on function public.reject_chore(uuid, text) from anon;
revoke execute on function public.redeem_reward(uuid, uuid) from anon;
revoke execute on function public.update_streak(uuid, uuid, uuid) from anon;
revoke execute on function public.join_family_by_code(text) from anon;
revoke execute on function public.complete_onboarding(text, text, date) from anon;
revoke execute on function public.delete_user_account() from anon;

-- is_family_member is used by RLS predicates evaluated as the calling role.
-- authenticated must keep EXECUTE so RLS works. anon does not need it.
revoke execute on function public.is_family_member(uuid) from anon;

-- handle_new_user is a trigger on auth.users; it executes as the trigger
-- owner (postgres), not as the calling role. No one needs EXECUTE on it.
revoke execute on function public.handle_new_user() from anon, authenticated;

-- generate_invite_code is used as a column default; runs as the table owner.
revoke execute on function public.generate_invite_code() from anon, authenticated;

-- set_child_under_13 is a row-level trigger; runs as the table owner.
revoke execute on function public.set_child_under_13() from anon, authenticated;
