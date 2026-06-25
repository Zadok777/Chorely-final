-- Migration 018: goals FK covering indexes
-- Advisor lint addressed:
--   0001_unindexed_foreign_keys — goals.created_by and goals.reward_id had no
--   covering index (migration 014 indexed child_id + family_id only). Adding
--   them clears the performance advisor warnings and keeps FK lookups fast.

create index if not exists goals_created_by_idx on public.goals (created_by);
create index if not exists goals_reward_id_idx on public.goals (reward_id);
