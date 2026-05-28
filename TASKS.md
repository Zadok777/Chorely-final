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

## Phase 1: Foundation (repo + skeleton) — completed 2026-05-27

- [x] Get GitHub repo URL from user (`https://github.com/doulosnexus-lang/Chorely.git`)
- [x] `git init` in `Chorely 2/`, add remote, set default branch to `main`
- [x] Add `.gitignore` (Node, Expo, EAS, `.env`, `.DS_Store`, `ios/`, `android/`)
- [x] Add `.env.example` (4 env vars from CLAUDE.md §3)
- [x] Audit `package.json` against required deps (RN Nav v7 confirmed, CLAUDE.md §2 corrected from v6)
- [x] Create directory skeleton (`src/{screens/{auth,parent},components/{brand,ui,layout,modals},navigation,store,services,lib,theme,types,utils,hooks}`, `supabase/migrations/`)
- [x] Write `src/theme/tokens.ts` (Lumina Bloom tokens)
- [x] Write `src/theme/ThemeProvider.tsx` (light default, dark stub)
- [x] Write `src/theme/index.ts` (re-exports for App.tsx)
- [x] Write `src/navigation/RootNavigator.tsx` (Hello-Chorely placeholder via `@react-navigation/stack`)
- [x] `npm install` clean (953 packages, 14s)
- [x] `npx tsc --noEmit` clean (no type errors)
- [x] First commit (`chore: scaffold Chorely v1.0 (Phase 1 foundation)`) pushed to `origin/main`
- [ ] **Visual verification**: launch `npx expo start` and confirm the Hello-Chorely placeholder renders in iOS Simulator / Expo Go

## Phase 2: Supabase Wiring

### Phase 2a: Schema (completed 2026-05-27)

- [x] Get Supabase URL + anon key from user; paste into `.env.local` (never committed)
- [x] Verify Supabase project is reachable; discover it's empty (plan assumed schema existed; it didn't)
- [x] Author migrations 001-010 implementing CLAUDE.md §5 schema (tables, FKs, RLS policies, RPCs)
- [x] Author migration 011 (set search_path on helpers, revoke PUBLIC on SECURITY DEFINER fns)
- [x] Author migration 012 (revoke anon EXECUTE on RPCs at GRANT layer; defense-in-depth)
- [x] Apply migrations 001-012 to `kwwhuwegzdaqstqhmths` via MCP (all 12 succeeded)
- [x] Verify all 11 tables exist with RLS enabled
- [x] Verify anon role has zero SECURITY DEFINER access; authenticated has user-callable RPCs only
- [x] Generate `src/types/database.types.ts` from live schema via MCP

### Phase 2b: Client + smoke test (completed 2026-05-27)

- [x] Write `src/lib/supabase.ts` (typed client with AsyncStorage session persistence)
- [x] Write `src/types/app.types.ts` (Row aliases, ChoreStatus/Category/Frequency literal types, typed RootStackParamList)
- [x] Update `RootNavigator` placeholder to call `supabase.auth.getSession()` on mount and render the connection state
- [x] `tsc --noEmit` clean
- [x] Commit + push (`49091b7`)

### Phase 2c: Services + Stores (in progress 2026-05-28)

- [x] Write `src/types/result.ts` (`ServiceResult<T>` tagged union + ok/fail/fromError helpers)
- [x] Write `src/services/auth.ts` (signUp, signIn, signOut, getSession, getUser, getMyProfile, updateMyProfile, onAuthStateChange)
- [x] Write `src/services/families.ts` (listMyFamilies, getFamily, renameFamily, listFamilyMembers)
- [x] Write `src/services/children.ts` (CRUD)
- [x] Write `src/services/chores.ts` (CRUD + assignChore + listAssignmentsForFamily/Child + listPendingApprovals)
- [x] Write `src/services/rewards.ts` (CRUD + listRedemptionsForFamily/Child + markRedemptionFulfilled)
- [x] Write `src/services/activity.ts` (listActivity + listActivityForChild)
- [x] Write `src/services/settings.ts` (getMySettings, updateMySettings)
- [x] Write `src/services/rpc.ts` (typed wrappers for the 8 RPCs)
- [x] Write `src/store/authStore.ts` (session + profile; in-memory mirror — supabase client owns persistence)
- [x] Write `src/store/familyStore.ts` (current family + members + children)
- [x] Write `src/store/choreStore.ts` (chores + assignments + filter)
- [x] Write `src/store/rewardStore.ts` (rewards + redemptions)
- [x] Write `src/store/activityStore.ts` (activity feed)
- [x] Write `src/store/settingsStore.ts` (dark mode + notification prefs, with persist middleware)
- [x] `tsc --noEmit` clean
- [ ] Verify temp smoke-test screen can sign up a real user end-to-end (auth → profile autocreate → onboarding RPC → families list reads back)

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
