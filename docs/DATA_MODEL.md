# Data Model

> The authoritative schema is **CLAUDE.md §5** and the SQL in
> `supabase/migrations/`. This document is a navigable overview. After any schema
> change: apply a migration, then regenerate `src/types/database.types.ts`.

**Backend:** Supabase Postgres, project `zinbukzmkorkawbgckkh` ("Chorely App").
**RLS is enabled on every table.** Access is gated by the `is_family_member()`
helper. Point/redemption mutations go through `SECURITY DEFINER` RPCs only.

## Tables (12)

| Table | Purpose | Key columns |
|---|---|---|
| `profiles` | One per auth user; auto-created by `handle_new_user()` trigger | `id` → `auth.users`, `display_name`, `avatar_gradient/icon` |
| `families` | A household | `id`, `name`, `invite_code` (auto), `created_by` |
| `family_members` | Parent/guardian membership | `family_id`, `user_id`, `role` |
| `children` | Records owned by a family (not users) | `family_id`, `name`, `date_of_birth`, `points`, `streak_days`, `is_under_13`, `age_tier_override` |
| `chores` | Chore definitions | `family_id`, `title`, `category`, `point_value`, `frequency`, `is_active` |
| `chore_assignments` | A chore assigned to a child | `chore_id`, `child_id`, `status` (assigned/submitted/approved/rejected), `due_date` |
| `rewards` | Reward catalog | `family_id`, `title`, `point_cost`, `icon_name`, `color`, `is_active` |
| `reward_redemptions` | Redemption records (insert via RPC) | `reward_id`, `child_id`, `points_spent` |
| `point_transactions` | Append-only points ledger | `child_id`, `amount`, `type` (earned/redeemed/adjustment) |
| `activity_log` | Family activity feed | `family_id`, `type`, `child_id`, `actor_id`, `point_value` |
| `user_settings` | Per-user prefs | `user_id`, `dark_mode`, notification flags |
| `goals` | Per-child savings goals | `family_id`, `child_id`, `kind` (reward/points), `target_points`, `reached_at` |

## RPC functions (12)

**User-callable (`authenticated` only):**
`submit_chore`, `approve_chore`, `reject_chore`, `redeem_reward`,
`update_streak`, `join_family_by_code`, `complete_onboarding`,
`delete_user_account`.

**Internal (triggers / RLS / defaults — not in the exposed API):**
`handle_new_user`, `is_family_member`, `generate_invite_code`,
`set_child_under_13`.

## Relationships (high level)

```
auth.users ─1:1─ profiles ─1:N─ family_members ─N:1─ families
                                                        │
                       ┌────────────────────────────────┼───────────────┐
                    children                          chores          rewards
                       │                                 │                │
        ┌──────────────┼─────────────┐          chore_assignments  reward_redemptions
   point_transactions  goals   (FK child_id)        (child_id)        (child_id)
```

## Migrations

Numbered `001`–`016` in `supabase/migrations/`. Highlights: 001 profiles +
trigger; 002 families + `is_family_member`; 008–009 RPCs; 010 COPPA fields;
011–012 function-security hardening; 013 RLS perf + FK indexes; 014 goals;
015 customizable avatars; 016 age-tier override.

## Conventions

- Never use the `service_role` key in the app — anon key only.
- Enable RLS on every new table before shipping.
- Point mutations: RPC only, never a direct client `UPDATE`.
- Storage bucket for reward images (when used): `reward-images`
  (authenticated reads, parent-only writes).
