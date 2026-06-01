-- Migration 016: optional per-child age/grade tier override.
-- Mirrors the remote migration applied 2026-06-01 (add_children_age_tier_override).
-- The effective tier is derived from date_of_birth by default; this column lets a
-- parent override it (grade-skips, maturity). NULL = derive from date_of_birth.

alter table public.children
  add column if not exists age_tier_override text
  check (age_tier_override in ('early', 'lower', 'middle', 'upper'));

comment on column public.children.age_tier_override is
  'Optional parent override of the auto-derived age/grade tier (early|lower|middle|upper). NULL = derive from date_of_birth.';
