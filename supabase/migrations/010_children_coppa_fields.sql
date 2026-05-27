-- Migration 010: COPPA compliance fields on children

alter table public.children
  add column if not exists parental_consent_given boolean not null default false,
  add column if not exists parental_consent_at timestamptz,
  add column if not exists is_under_13 boolean not null default false;

-- Auto-derive is_under_13 whenever date_of_birth is set or changed.
create or replace function public.set_child_under_13()
returns trigger
language plpgsql
as $$
begin
  if new.date_of_birth is not null then
    new.is_under_13 := age(new.date_of_birth) < interval '13 years';
  end if;
  return new;
end;
$$;

drop trigger if exists set_child_under_13_trigger on public.children;
create trigger set_child_under_13_trigger
  before insert or update of date_of_birth on public.children
  for each row execute function public.set_child_under_13();
