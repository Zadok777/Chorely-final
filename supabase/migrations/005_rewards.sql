-- Migration 005: rewards + reward_redemptions

create table public.rewards (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families(id) on delete cascade,
  title text not null,
  description text,
  point_cost integer not null check (point_cost > 0),
  icon_name text,
  color text,
  is_active boolean not null default true,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create index rewards_family_id_idx on public.rewards (family_id);
create index rewards_active_idx on public.rewards (family_id, is_active);

create table public.reward_redemptions (
  id uuid primary key default gen_random_uuid(),
  reward_id uuid not null references public.rewards(id) on delete restrict,
  child_id uuid not null references public.children(id) on delete cascade,
  points_spent integer not null check (points_spent > 0),
  redeemed_at timestamptz not null default now(),
  fulfilled_at timestamptz,
  fulfilled_by uuid references public.profiles(id) on delete set null
);

create index reward_redemptions_child_idx on public.reward_redemptions (child_id);
create index reward_redemptions_reward_idx on public.reward_redemptions (reward_id);

alter table public.rewards enable row level security;
alter table public.reward_redemptions enable row level security;

create policy "rewards_family_member_all"
  on public.rewards for all
  using (public.is_family_member(family_id))
  with check (public.is_family_member(family_id));

-- Redemptions: family members can read.
-- Inserts happen exclusively via redeem_reward() RPC (SECURITY DEFINER bypasses RLS).
create policy "reward_redemptions_family_member_select"
  on public.reward_redemptions for select
  using (
    exists (
      select 1 from public.children c
      where c.id = child_id and public.is_family_member(c.family_id)
    )
  );

create policy "reward_redemptions_family_member_update"
  on public.reward_redemptions for update
  using (
    exists (
      select 1 from public.children c
      where c.id = child_id and public.is_family_member(c.family_id)
    )
  )
  with check (
    exists (
      select 1 from public.children c
      where c.id = child_id and public.is_family_member(c.family_id)
    )
  );
