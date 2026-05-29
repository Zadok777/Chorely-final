-- Migration 015: customizable avatars (gradient index + icon) for parents & kids
--   avatar_gradient: index into AVATAR_GRADIENTS in tokens.ts (null = auto hash by name)
--   avatar_icon:     an Ionicon name, or 'face' for the Chorely smiley (null = initials)
alter table public.profiles add column if not exists avatar_gradient integer;
alter table public.profiles add column if not exists avatar_icon text;
alter table public.children add column if not exists avatar_gradient integer;
alter table public.children add column if not exists avatar_icon text;
