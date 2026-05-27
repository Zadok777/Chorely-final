# TASKS.md — Chorely Frontend Build

Legend: `[ ]` pending, `[x]` complete, `[-]` skipped

---

## Phase 0: Prep (completed 2026-05-27)

- [x] Delete other Chorely folders and IDE caches outside `~/Desktop/Chorely 2/`
- [x] Flatten `uploads/` contents into project root; remove `uploads/`
- [x] Split CLAUDE.md → CLAUDE.md (project rules) + DESIGN.md (visual system)
- [x] Reset TASKS.md to match actual project state (no code yet)
- [x] Rewrite PLANNING.md "What Is Changing" → "Build Approach" (fresh build framing)
- [x] Delete prototype files (`app.jsx`, `components.jsx`, `mascot.jsx`, `screens-child.jsx`, `screens-parent.jsx`, `tweaks-panel.jsx`, `styles.css`, `Chorely Prototype.html`, `.DS_Store`)

## Phase 1: Foundation (repo + skeleton)

- [ ] Get GitHub repo URL from user (`https://github.com/doulosnexus-lang/Chorely.git`)
- [ ] `git init` in `Chorely 2/`, add remote, set default branch to `main`
- [ ] Add `.gitignore` (Node, Expo, EAS, `.env`, `.DS_Store`, `ios/`, `android/`)
- [ ] Add `.env.example` (4 env vars from CLAUDE.md §3)
- [ ] Audit `package.json` against required deps; add missing
- [ ] Create directory skeleton (`src/{screens,components/{brand,ui,layout,modals},store,services,types,lib,theme,utils,navigation,hooks}`, `supabase/migrations/`)
- [ ] Write `src/theme/tokens.ts` (extracted from DESIGN.md tokens)
- [ ] Write `src/theme/ThemeProvider.tsx` (light default, dark optional)
- [ ] Write `src/theme/index.ts` (re-exports for App.tsx)
- [ ] `npm install` clean, `npx expo start` boots to a "Hello Chorely" placeholder screen on iOS Simulator
- [ ] First commit + push to `main`

## Phase 2: Supabase Wiring

- [ ] Get Supabase URL + anon key from user; paste into `.env.local` (never committed)
- [ ] Write `src/lib/supabase.ts` (typed client with AsyncStorage session persistence)
- [ ] Run `supabase gen types typescript ...` → `src/types/database.types.ts`
- [ ] Write `src/types/app.types.ts` (app-level interfaces + typed `NavigationParams`)
- [ ] Smoke test: temporary "PingSupabase" screen calls `supabase.auth.getSession()` and renders status
- [ ] Write `src/services/` — 8 service files (auth, families, children, chores, rewards, activity, settings, plus `client.ts`)
- [ ] Write `src/store/` — 6 Zustand stores (auth, family, chore, reward, activity, settings) with persist middleware
- [ ] Verify a temp screen can sign in with a real Supabase user and read families list

## Phase 3: UI Atoms + Layout

- [ ] `layout/ScreenContainer.tsx` (safe-area + lavender bg + optional scroll)
- [ ] `brand/ChorelyLogo.tsx`, `brand/ChorelyIcon.tsx` (3 variants)
- [ ] `ui/GlassCard.tsx` (BlurView on iOS, fallback rgba on Android)
- [ ] `ui/Button.tsx` (primary/secondary/ghost/danger; `scale(0.98)` press)
- [ ] `ui/Input.tsx` (text/number/date with label + error)
- [ ] `ui/Badge.tsx`, `ui/PointsBadge.tsx`
- [ ] `ui/Avatar.tsx` (gradient circle + initial)
- [ ] `ui/ProgressBar.tsx`, `ui/ProgressRing.tsx` (SVG)
- [ ] `ui/ChoreRow.tsx`, `ui/RewardCard.tsx`
- [ ] `ui/EmptyState.tsx`, `ui/SkeletonLoader.tsx`, `ui/Toast.tsx`
- [ ] `layout/Header.tsx`, `layout/TabBar.tsx` (glassmorphism pill)
- [ ] Visual parity check against DESIGN.md §11 screen specs

## Phase 4: Navigation + Auth + Onboarding

- [ ] `src/navigation/RootNavigator.tsx` (Auth ↔ Main switch based on `authStore.session`)
- [ ] `src/navigation/AuthNavigator.tsx` (Welcome → Login/SignUp → OnboardingWizard)
- [ ] `src/navigation/MainNavigator.tsx` (bottom tabs with stacks)
- [ ] `screens/auth/WelcomeScreen.tsx`
- [ ] `screens/auth/LoginScreen.tsx`
- [ ] `screens/auth/SignUpScreen.tsx`
- [ ] `screens/auth/OnboardingWizard.tsx` (family name + first child; calls `complete_onboarding` RPC)
- [ ] Test: sign up → onboarding → dashboard
- [ ] Test: sign in → dashboard
- [ ] Test: sign out → welcome

## Phase 5: Parent Dashboard

- [ ] `screens/parent/ParentDashboard.tsx` — greeting header
- [ ] Pending Approvals card with counter and preview
- [ ] Today's Snapshot (3 stat tiles)
- [ ] Quick Actions grid
- [ ] Family Progress cards (one per child)
- [ ] Wire to `familyStore`, `choreStore`, `activityStore`
- [ ] Pull-to-refresh on the dashboard

## Phase 6: Chore Management

- [ ] `screens/parent/ChoresScreen.tsx` (list + filters: Active / Pending / All)
- [ ] `modals/CreateChoreModal.tsx` (RHF + Yup; title, child pills, frequency, date/time, points, photo proof toggle, notes)
- [ ] `modals/ChoreApprovalModal.tsx` (Approve → `approve_chore` RPC; Deny → `reject_chore` with note)
- [ ] `ChoreRow` status-variant rendering integrated
- [ ] Test: create chore → submit (via SQL) → approve → points credit
- [ ] Test: create chore → submit → reject → status updates

## Phase 7: Rewards & Points

- [ ] `screens/parent/RewardsScreen.tsx` (filter tabs, grid)
- [ ] `modals/CreateRewardModal.tsx`
- [ ] `modals/RedeemRewardModal.tsx` (parent redeems on behalf of child in v1.0 via `redeem_reward` RPC)
- [ ] `modals/CelebrationOverlay.tsx` (confetti + scale animation on approve/redeem)
- [ ] Test: create reward → redeem → points decrement, redemption logged

## Phase 8: Family + Settings

- [ ] `screens/parent/FamilyScreen.tsx` (child cards, streaks, progress)
- [ ] `modals/AddChildModal.tsx` (name + DOB only — COPPA)
- [ ] Child detail view (point history, chore history, streak)
- [ ] `screens/parent/SettingsScreen.tsx` (rename family, manage children, dark-mode toggle, sign out, delete account → `delete_user_account` RPC, invite code share)
- [ ] Test: add child → appears in family → can assign chores
- [ ] Test: dark mode toggle persists

## Phase 9: Paywall (RevenueCat)

- [ ] Install `react-native-purchases`
- [ ] `src/lib/revenuecat.ts` — initialize before app mounts
- [ ] `screens/parent/PaywallScreen.tsx` — free / weekly / yearly tiers
- [ ] Hard limits read from a feature-flag map (free: 2 children, 5 active chores per child) — not direct subscription check
- [ ] Test on a real device — simulator IAP is unreliable

## Phase 10: Polish + Pre-Submission

- [ ] Skeleton loaders on every list screen
- [ ] Pull-to-refresh everywhere lists appear
- [ ] Haptics on key interactions (`expo-haptics`)
- [ ] Touch-target audit (48px / 56px elementary)
- [ ] Strip all `console.log`
- [ ] COPPA audit (no PII prompts for children data)
- [ ] Verify RLS policies block cross-family reads (test with two accounts)
- [ ] EAS build → TestFlight + Google internal track
