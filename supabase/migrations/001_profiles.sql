-- Migration 001: profiles table + handle_new_user trigger
-- A profile row is auto-created when a user signs up via Supabase Auth.

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Each user can read/insert/update their own profile.
-- Cross-family profile visibility (parents seeing other parents' names) is
-- added in 002 after the family_members table exists.

create policy "profiles_self_select"
  on public.profiles for select
  using (id = auth.uid());

create policy "profiles_self_update"
  on public.profiles for update
  using (id = auth.uid())
  with check (id = auth.uid());

create policy "profiles_self_insert"
  on public.profiles for insert
  with check (id = auth.uid());

-- Auto-create profile when an auth.users row is created.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
