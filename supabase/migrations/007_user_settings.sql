-- Migration 007: per-user app settings (dark mode, notifications)

create table public.user_settings (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  dark_mode boolean not null default false,
  notifications_enabled boolean not null default true,
  notification_chore_complete boolean not null default true,
  notification_reward_redeemed boolean not null default true,
  notification_daily_summary boolean not null default true,
  updated_at timestamptz not null default now()
);

alter table public.user_settings enable row level security;

create policy "user_settings_self_all"
  on public.user_settings for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());
