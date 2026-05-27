-- Migration 006: point_transactions + activity_log

create table public.point_transactions (
  id uuid primary key default gen_random_uuid(),
  child_id uuid not null references public.children(id) on delete cascade,
  amount integer not null,
  type text not null check (type in ('earned','redeemed','adjustment')),
  reference_id uuid,
  reference_type text,
  note text,
  created_at timestamptz not null default now()
);

create index point_transactions_child_idx on public.point_transactions (child_id);
create index point_transactions_created_idx on public.point_transactions (child_id, created_at desc);

create table public.activity_log (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families(id) on delete cascade,
  type text not null check (type in (
    'chore_completed','chore_approved','chore_rejected',
    'reward_redeemed','points_earned','child_added','chore_created'
  )),
  child_id uuid references public.children(id) on delete set null,
  actor_id uuid references public.profiles(id) on delete set null,
  title text,
  point_value integer,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index activity_log_family_idx on public.activity_log (family_id);
create index activity_log_created_idx on public.activity_log (family_id, created_at desc);

alter table public.point_transactions enable row level security;
alter table public.activity_log enable row level security;

-- point_transactions: family members can SELECT; INSERTs go through RPCs (SECURITY DEFINER bypasses)
create policy "point_transactions_family_member_select"
  on public.point_transactions for select
  using (
    exists (
      select 1 from public.children c
      where c.id = child_id and public.is_family_member(c.family_id)
    )
  );

-- activity_log: family members can read and append
create policy "activity_log_family_member_select"
  on public.activity_log for select
  using (public.is_family_member(family_id));

create policy "activity_log_family_member_insert"
  on public.activity_log for insert
  with check (public.is_family_member(family_id));
