-- Migration 009: family and account lifecycle RPCs

-- join_family_by_code: join an existing family via its invite_code
create or replace function public.join_family_by_code(p_code text)
returns public.families
language plpgsql
security definer
set search_path = public
as $$
declare
  v_family public.families;
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;

  select * into v_family from public.families where invite_code = p_code;

  if v_family.id is null then
    raise exception 'Invalid invite code';
  end if;

  insert into public.family_members (family_id, user_id, role)
  values (v_family.id, auth.uid(), 'parent')
  on conflict (family_id, user_id) do nothing;

  return v_family;
end;
$$;

-- complete_onboarding: create family + first child + user_settings in one transaction
create or replace function public.complete_onboarding(
  p_family_name text,
  p_child_name text,
  p_child_dob date default null
)
returns public.families
language plpgsql
security definer
set search_path = public
as $$
declare
  v_family public.families;
  v_user uuid := auth.uid();
begin
  if v_user is null then
    raise exception 'Not authenticated';
  end if;

  -- Ensure profile exists (handle_new_user trigger should have created one,
  -- but guard against the edge case where the user signed up before the trigger).
  insert into public.profiles (id) values (v_user)
  on conflict (id) do nothing;

  insert into public.families (name, created_by)
  values (p_family_name, v_user)
  returning * into v_family;

  insert into public.family_members (family_id, user_id, role)
  values (v_family.id, v_user, 'parent');

  insert into public.children (family_id, name, date_of_birth)
  values (v_family.id, p_child_name, p_child_dob);

  insert into public.user_settings (user_id) values (v_user)
  on conflict (user_id) do nothing;

  insert into public.activity_log (family_id, type, actor_id, title)
  values (v_family.id, 'child_added', v_user, p_child_name);

  return v_family;
end;
$$;

-- delete_user_account: cascade-delete everything owned by the current user.
-- Foreign keys do the heavy lifting (ON DELETE CASCADE down the tree).
create or replace function public.delete_user_account()
returns void
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  v_user uuid := auth.uid();
begin
  if v_user is null then
    raise exception 'Not authenticated';
  end if;

  delete from public.families where created_by = v_user;
  delete from public.family_members where user_id = v_user;
  delete from public.profiles where id = v_user;
  delete from auth.users where id = v_user;
end;
$$;

grant execute on function public.join_family_by_code(text) to authenticated;
grant execute on function public.complete_onboarding(text, text, date) to authenticated;
grant execute on function public.delete_user_account() to authenticated;
