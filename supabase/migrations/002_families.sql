-- Migration 002: families + family_members + helpers (generate_invite_code, is_family_member)

-- 8-char alphanumeric invite codes (ambiguous chars 0/O/1/I removed)
create or replace function public.generate_invite_code()
returns text
language plpgsql
as $$
declare
  chars text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  result text := '';
  i int;
begin
  for i in 1..8 loop
    result := result || substr(chars, 1 + floor(random() * length(chars))::int, 1);
  end loop;
  return result;
end;
$$;

create table public.families (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  invite_code text unique not null default public.generate_invite_code(),
  created_by uuid not null references public.profiles(id) on delete restrict,
  created_at timestamptz not null default now()
);

create index families_created_by_idx on public.families (created_by);

create table public.family_members (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'parent' check (role in ('parent', 'guardian')),
  joined_at timestamptz not null default now(),
  unique (family_id, user_id)
);

create index family_members_family_id_idx on public.family_members (family_id);
create index family_members_user_id_idx on public.family_members (user_id);

-- Helper: is the current user a member of a given family?
-- SECURITY DEFINER so it can read family_members regardless of caller's RLS.
create or replace function public.is_family_member(p_family_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.family_members
    where family_id = p_family_id and user_id = auth.uid()
  );
$$;

alter table public.families enable row level security;
alter table public.family_members enable row level security;

-- Families: members can read; only creator can update or delete
create policy "families_member_select"
  on public.families for select
  using (public.is_family_member(id));

create policy "families_creator_insert"
  on public.families for insert
  with check (created_by = auth.uid());

create policy "families_creator_update"
  on public.families for update
  using (created_by = auth.uid())
  with check (created_by = auth.uid());

create policy "families_creator_delete"
  on public.families for delete
  using (created_by = auth.uid());

-- Family members: a member can read all members of their family
create policy "family_members_member_select"
  on public.family_members for select
  using (public.is_family_member(family_id));

-- Anyone can insert themselves into a family (joining via invite code happens through join_family_by_code RPC)
create policy "family_members_self_insert"
  on public.family_members for insert
  with check (user_id = auth.uid());

create policy "family_members_self_delete"
  on public.family_members for delete
  using (user_id = auth.uid());

-- Cross-family profile visibility: family members can read each other's profiles
create policy "profiles_family_member_select"
  on public.profiles for select
  using (
    id in (
      select fm2.user_id
      from public.family_members fm1
      join public.family_members fm2 on fm2.family_id = fm1.family_id
      where fm1.user_id = auth.uid()
    )
  );
