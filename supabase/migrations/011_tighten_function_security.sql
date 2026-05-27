-- Migration 011: tighten SECURITY DEFINER function permissions
--
-- Addresses Supabase advisor warnings:
--   - function_search_path_mutable on generate_invite_code, set_child_under_13
--   - anon_security_definer_function_executable on all SECURITY DEFINER fns
--
-- After this migration:
--   - All SECURITY DEFINER functions have EXECUTE revoked from PUBLIC (anon loses access).
--   - User-facing RPCs are explicitly granted to `authenticated` only.
--   - Internal helpers (handle_new_user, set_child_under_13, generate_invite_code,
--     is_family_member) remain callable internally (triggers, defaults, RLS predicates)
--     but are not exposed via /rest/v1/rpc/.

alter function public.generate_invite_code() set search_path = public;
alter function public.set_child_under_13() set search_path = public;

-- Revoke default PUBLIC execute grant on every SECURITY DEFINER function
revoke execute on function public.handle_new_user() from public;
revoke execute on function public.is_family_member(uuid) from public;
revoke execute on function public.generate_invite_code() from public;
revoke execute on function public.set_child_under_13() from public;
revoke execute on function public.submit_chore(uuid) from public;
revoke execute on function public.approve_chore(uuid) from public;
revoke execute on function public.reject_chore(uuid, text) from public;
revoke execute on function public.redeem_reward(uuid, uuid) from public;
revoke execute on function public.update_streak(uuid, uuid, uuid) from public;
revoke execute on function public.join_family_by_code(text) from public;
revoke execute on function public.complete_onboarding(text, text, date) from public;
revoke execute on function public.delete_user_account() from public;

-- Re-grant EXECUTE to authenticated for user-callable RPCs only.
-- Triggers and column-default helpers stay revoked (they run as the table owner internally).
grant execute on function public.submit_chore(uuid) to authenticated;
grant execute on function public.approve_chore(uuid) to authenticated;
grant execute on function public.reject_chore(uuid, text) to authenticated;
grant execute on function public.redeem_reward(uuid, uuid) to authenticated;
grant execute on function public.update_streak(uuid, uuid, uuid) to authenticated;
grant execute on function public.join_family_by_code(text) to authenticated;
grant execute on function public.complete_onboarding(text, text, date) to authenticated;
grant execute on function public.delete_user_account() to authenticated;
