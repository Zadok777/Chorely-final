-- Migration 014: goals — per-child reward-savings goals + custom point goals
--   kind='reward'  -> reward_id set, target_points snapshots the reward cost
--   kind='points'  -> custom title + target_points
-- reached_at is stamped (once) when the child's balance first meets the target,
-- which also gates the one-time celebration in the app.
create table public.goals (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families(id) on delete cascade,
  child_id uuid not null references public.children(id) on delete cascade,
  kind text not null check (kind in ('reward','points')),
  reward_id uuid references public.rewards(id) on delete set null,
  title text not null,
  target_points integer not null check (target_points > 0),
  is_active boolean not null default true,
  reached_at timestamptz,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create index goals_child_idx on public.goals (child_id);
create index goals_family_idx on public.goals (family_id);

alter table public.goals enable row level security;

create policy "goals_family_member_all"
  on public.goals for all
  using (public.is_family_member(family_id))
  with check (public.is_family_member(family_id));

grant select, insert, update, delete on public.goals to authenticated;
