-- Migration 004: chores + chore_assignments

create table public.chores (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families(id) on delete cascade,
  title text not null,
  description text,
  category text check (category in (
    'bedroom','kitchen','bathroom','outdoor','pets','laundry','homework','other'
  )),
  point_value integer not null check (point_value > 0),
  frequency text not null default 'once' check (frequency in ('once','daily','weekly')),
  is_active boolean not null default true,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create index chores_family_id_idx on public.chores (family_id);
create index chores_active_idx on public.chores (family_id, is_active);

create table public.chore_assignments (
  id uuid primary key default gen_random_uuid(),
  chore_id uuid not null references public.chores(id) on delete cascade,
  child_id uuid not null references public.children(id) on delete cascade,
  assigned_by uuid references public.profiles(id) on delete set null,
  status text not null default 'assigned' check (status in (
    'assigned','submitted','approved','rejected'
  )),
  due_date date,
  assigned_at timestamptz not null default now(),
  completed_at timestamptz,
  note text
);

create index chore_assignments_child_idx on public.chore_assignments (child_id);
create index chore_assignments_chore_idx on public.chore_assignments (chore_id);
create index chore_assignments_status_idx on public.chore_assignments (status);

alter table public.chores enable row level security;
alter table public.chore_assignments enable row level security;

create policy "chores_family_member_all"
  on public.chores for all
  using (public.is_family_member(family_id))
  with check (public.is_family_member(family_id));

-- Assignments inherit family scope via their chore
create policy "chore_assignments_family_member_all"
  on public.chore_assignments for all
  using (
    exists (
      select 1 from public.chores c
      where c.id = chore_id and public.is_family_member(c.family_id)
    )
  )
  with check (
    exists (
      select 1 from public.chores c
      where c.id = chore_id and public.is_family_member(c.family_id)
    )
  );
