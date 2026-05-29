-- Migration 013: RLS performance + FK covering indexes
-- Advisor lints addressed:
--   0003_auth_rls_initplan      — wrap auth.uid() in (select ...) so it is
--                                 evaluated once per query, not once per row
--   0001_unindexed_foreign_keys — add covering indexes for FK columns
--
-- Only policies that called auth.uid() directly are rewritten. Policies that
-- delegate to is_family_member() already evaluate auth.uid() once inside that
-- SECURITY DEFINER helper, so they are left untouched.

-- ---- profiles ----
drop policy if exists "profiles_self_select" on public.profiles;
create policy "profiles_self_select" on public.profiles
  for select using (id = (select auth.uid()));

drop policy if exists "profiles_self_insert" on public.profiles;
create policy "profiles_self_insert" on public.profiles
  for insert with check (id = (select auth.uid()));

drop policy if exists "profiles_self_update" on public.profiles;
create policy "profiles_self_update" on public.profiles
  for update using (id = (select auth.uid())) with check (id = (select auth.uid()));

drop policy if exists "profiles_family_member_select" on public.profiles;
create policy "profiles_family_member_select" on public.profiles
  for select using (
    id in (
      select fm2.user_id
      from public.family_members fm1
      join public.family_members fm2 on fm2.family_id = fm1.family_id
      where fm1.user_id = (select auth.uid())
    )
  );

-- ---- families ----
drop policy if exists "families_creator_insert" on public.families;
create policy "families_creator_insert" on public.families
  for insert with check (created_by = (select auth.uid()));

drop policy if exists "families_creator_update" on public.families;
create policy "families_creator_update" on public.families
  for update using (created_by = (select auth.uid())) with check (created_by = (select auth.uid()));

drop policy if exists "families_creator_delete" on public.families;
create policy "families_creator_delete" on public.families
  for delete using (created_by = (select auth.uid()));

-- ---- family_members ----
drop policy if exists "family_members_self_insert" on public.family_members;
create policy "family_members_self_insert" on public.family_members
  for insert with check (user_id = (select auth.uid()));

drop policy if exists "family_members_self_delete" on public.family_members;
create policy "family_members_self_delete" on public.family_members
  for delete using (user_id = (select auth.uid()));

-- ---- user_settings ----
drop policy if exists "user_settings_self_all" on public.user_settings;
create policy "user_settings_self_all" on public.user_settings
  for all using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));

-- ---- FK covering indexes ----
create index if not exists activity_log_actor_idx on public.activity_log (actor_id);
create index if not exists activity_log_child_idx on public.activity_log (child_id);
create index if not exists chore_assignments_assigned_by_idx on public.chore_assignments (assigned_by);
create index if not exists chores_created_by_idx on public.chores (created_by);
create index if not exists reward_redemptions_fulfilled_by_idx on public.reward_redemptions (fulfilled_by);
create index if not exists rewards_created_by_idx on public.rewards (created_by);
