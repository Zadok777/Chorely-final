-- Migration 008: RPCs for chore lifecycle and reward redemption.
-- All point mutations go through these (never direct UPDATE from client).
-- SECURITY DEFINER lets them bypass RLS for inserts into point_transactions / activity_log;
-- each function gates access by checking is_family_member() up front.

-- submit_chore: mark an assignment as submitted (pending review)
create or replace function public.submit_chore(p_assignment_id uuid)
returns public.chore_assignments
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row public.chore_assignments;
  v_family uuid;
  v_chore_title text;
begin
  select c.family_id, c.title
    into v_family, v_chore_title
  from public.chore_assignments a
  join public.chores c on c.id = a.chore_id
  where a.id = p_assignment_id;

  if v_family is null then
    raise exception 'Assignment not found';
  end if;

  if not public.is_family_member(v_family) then
    raise exception 'Not a member of this family';
  end if;

  update public.chore_assignments
     set status = 'submitted',
         completed_at = now()
   where id = p_assignment_id
     and status in ('assigned','rejected')
  returning * into v_row;

  if v_row.id is null then
    raise exception 'Assignment cannot be submitted (already approved or submitted)';
  end if;

  insert into public.activity_log (family_id, type, child_id, actor_id, title, metadata)
  values (
    v_family, 'chore_completed', v_row.child_id, auth.uid(), v_chore_title,
    jsonb_build_object('assignment_id', v_row.id)
  );

  return v_row;
end;
$$;

-- approve_chore: parent approves a submitted chore, awards points, updates streak
create or replace function public.approve_chore(p_assignment_id uuid)
returns public.chore_assignments
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row public.chore_assignments;
  v_family uuid;
  v_points int;
  v_chore_title text;
  v_child_id uuid;
  v_today date := current_date;
begin
  select c.family_id, c.point_value, c.title, a.child_id
    into v_family, v_points, v_chore_title, v_child_id
  from public.chore_assignments a
  join public.chores c on c.id = a.chore_id
  where a.id = p_assignment_id;

  if v_family is null then
    raise exception 'Assignment not found';
  end if;

  if not public.is_family_member(v_family) then
    raise exception 'Not a member of this family';
  end if;

  -- Lock the child row to prevent racing point updates
  perform 1 from public.children where id = v_child_id for update;

  update public.chore_assignments
     set status = 'approved',
         completed_at = coalesce(completed_at, now())
   where id = p_assignment_id
     and status = 'submitted'
  returning * into v_row;

  if v_row.id is null then
    raise exception 'Assignment cannot be approved (not in submitted state)';
  end if;

  -- Award points + maintain streak
  update public.children
     set points = points + v_points,
         streak_days = case
           when last_streak_date = v_today - 1 then streak_days + 1
           when last_streak_date = v_today then streak_days
           else 1
         end,
         last_streak_date = v_today
   where id = v_child_id;

  insert into public.point_transactions (child_id, amount, type, reference_id, reference_type, note)
  values (v_child_id, v_points, 'earned', v_row.id, 'chore_assignment', v_chore_title);

  insert into public.activity_log (family_id, type, child_id, actor_id, title, point_value, metadata)
  values (
    v_family, 'chore_approved', v_child_id, auth.uid(), v_chore_title, v_points,
    jsonb_build_object('assignment_id', v_row.id)
  );

  return v_row;
end;
$$;

-- reject_chore: parent rejects a submitted chore with an optional note
create or replace function public.reject_chore(p_assignment_id uuid, p_note text default null)
returns public.chore_assignments
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row public.chore_assignments;
  v_family uuid;
  v_chore_title text;
begin
  select c.family_id, c.title
    into v_family, v_chore_title
  from public.chore_assignments a
  join public.chores c on c.id = a.chore_id
  where a.id = p_assignment_id;

  if v_family is null then
    raise exception 'Assignment not found';
  end if;

  if not public.is_family_member(v_family) then
    raise exception 'Not a member of this family';
  end if;

  update public.chore_assignments
     set status = 'rejected',
         note = p_note
   where id = p_assignment_id
     and status = 'submitted'
  returning * into v_row;

  if v_row.id is null then
    raise exception 'Assignment cannot be rejected (not in submitted state)';
  end if;

  insert into public.activity_log (family_id, type, child_id, actor_id, title, metadata)
  values (
    v_family, 'chore_rejected', v_row.child_id, auth.uid(), v_chore_title,
    jsonb_build_object('assignment_id', v_row.id, 'note', p_note)
  );

  return v_row;
end;
$$;

-- redeem_reward: spend points from a child to redeem a reward (insert-only path for redemptions)
create or replace function public.redeem_reward(p_reward_id uuid, p_child_id uuid)
returns public.reward_redemptions
language plpgsql
security definer
set search_path = public
as $$
declare
  v_redemption public.reward_redemptions;
  v_family uuid;
  v_point_cost int;
  v_reward_title text;
  v_child_points int;
begin
  select r.family_id, r.point_cost, r.title
    into v_family, v_point_cost, v_reward_title
  from public.rewards r
  where r.id = p_reward_id and r.is_active = true;

  if v_family is null then
    raise exception 'Reward not found or inactive';
  end if;

  if not public.is_family_member(v_family) then
    raise exception 'Not a member of this family';
  end if;

  if not exists (
    select 1 from public.children where id = p_child_id and family_id = v_family
  ) then
    raise exception 'Child does not belong to this family';
  end if;

  -- Lock child row + check balance
  select points into v_child_points
    from public.children where id = p_child_id for update;

  if v_child_points < v_point_cost then
    raise exception 'Insufficient points (has %, needs %)', v_child_points, v_point_cost;
  end if;

  update public.children
     set points = points - v_point_cost
   where id = p_child_id;

  insert into public.reward_redemptions (reward_id, child_id, points_spent)
  values (p_reward_id, p_child_id, v_point_cost)
  returning * into v_redemption;

  insert into public.point_transactions (child_id, amount, type, reference_id, reference_type, note)
  values (p_child_id, -v_point_cost, 'redeemed', v_redemption.id, 'reward_redemption', v_reward_title);

  insert into public.activity_log (family_id, type, child_id, actor_id, title, point_value, metadata)
  values (
    v_family, 'reward_redeemed', p_child_id, auth.uid(), v_reward_title, -v_point_cost,
    jsonb_build_object('redemption_id', v_redemption.id)
  );

  return v_redemption;
end;
$$;

-- update_streak: reset streak if a day was skipped; called nightly or on demand
create or replace function public.update_streak(
  p_child_id uuid,
  p_family_id uuid,
  p_actor_id uuid
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_family_member(p_family_id) then
    raise exception 'Not a member of this family';
  end if;

  update public.children
     set streak_days = case
       when last_streak_date is null then 0
       when last_streak_date < current_date - 1 then 0
       else streak_days
     end
   where id = p_child_id
     and family_id = p_family_id;
end;
$$;

grant execute on function public.submit_chore(uuid) to authenticated;
grant execute on function public.approve_chore(uuid) to authenticated;
grant execute on function public.reject_chore(uuid, text) to authenticated;
grant execute on function public.redeem_reward(uuid, uuid) to authenticated;
grant execute on function public.update_streak(uuid, uuid, uuid) to authenticated;
