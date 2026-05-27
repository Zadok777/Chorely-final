-- Migration 003: children (data records owned by a family; not auth users)

create table public.children (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families(id) on delete cascade,
  name text not null,
  date_of_birth date,
  avatar_url text,
  points integer not null default 0 check (points >= 0),
  streak_days integer not null default 0 check (streak_days >= 0),
  last_streak_date date,
  created_at timestamptz not null default now()
);

create index children_family_id_idx on public.children (family_id);

alter table public.children enable row level security;

create policy "children_family_member_select"
  on public.children for select
  using (public.is_family_member(family_id));

create policy "children_family_member_insert"
  on public.children for insert
  with check (public.is_family_member(family_id));

create policy "children_family_member_update"
  on public.children for update
  using (public.is_family_member(family_id))
  with check (public.is_family_member(family_id));

create policy "children_family_member_delete"
  on public.children for delete
  using (public.is_family_member(family_id));
