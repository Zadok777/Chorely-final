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

### Phase 2c: Services + Stores (completed 2026-05-28)

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
- [x] Wire smoke-test button into Placeholder screen (RootNavigator.tsx)
- [x] Verify temp smoke-test screen can sign up a real user end-to-end — passed 2026-05-28 with invite code `Q7JQ6926` (auth → profile autocreate → onboarding RPC → families list reads back)
- [x] Disable "Confirm email" in Supabase dev project (Auth → Providers → Email) so signups return a session immediately

> The smoke-test button stays on the Placeholder screen until Phase 4 replaces RootNavigator with the real auth-gated flow. The orphan `smoke-*@example.com` users in `auth.users` can be cleared via the Supabase Dashboard or by calling `delete_user_account()` once we have a screen for it.

## Phase 3: UI Atoms + Layout

### Batch 1 — Everyday primitives (completed 2026-05-28)

- [x] `layout/ScreenContainer.tsx` (safe-area + lavender bg + optional scroll + optional keyboardAvoiding)
- [x] `ui/GlassCard.tsx` (two-layer pattern: outer shadow wrapper + inner BlurView-on-iOS clip; designed alphas via tint prop)
- [x] `ui/Button.tsx` (primary/secondary/ghost/danger; sm/md/lg; loading + disabled; `scale(0.98)` press; secondary uses BlurView + glass tint)
- [x] `ui/Input.tsx` (text input with label + helper + error; focus state lifts border to borderPink; multiline support)
- [x] `ui/Avatar.tsx` (LinearGradient circle with initial; sm/md/lg/xl; stable hash assigns gradient when index omitted)
- [x] `ui/Badge.tsx` (pill; neutral/pink/orange/green/danger/muted tones; sm/md sizes)
- [x] `ui/PointsBadge.tsx` (star icon + formatted number; balance/earn/spend tones)
- [x] `ui/EmptyState.tsx` (icon bubble + title + description + optional Button CTA)
- [x] `tsc --noEmit` clean

### Batch 2 — Composites + polish (completed 2026-05-28)

- [x] `brand/ChorelyIcon.tsx` (SVG rounded-square smiley with pink→orange gradient stroke)
- [x] `brand/ChorelyLogo.tsx` (3 variants: `full` stacked, `horizontal` inline, `icon` smiley-only)
- [x] `ui/ProgressBar.tsx` (clamp + optional label/valueLabel header)
- [x] `ui/ProgressRing.tsx` (SVG, optional gradient stroke, custom center label, unique gradient id per instance)
- [x] `ui/ChoreRow.tsx` (status-tone Badge + PointsBadge + Avatar; pure-UI props decoupled from DB row shapes)
- [x] `ui/RewardCard.tsx` (icon halo + locked/just-unlocked states + accentColor hex→rgba helper)
- [x] `ui/SkeletonLoader.tsx` (Reanimated opacity pulse 0.4↔0.8; shapes: block/line/circle; `SkeletonRow` convenience composite)
- [x] `ui/Toast.tsx` (`ToastProvider` + `useToast()` hook; tones success/error/info; safe-area aware; auto-dismiss + tap-to-dismiss)
- [x] `layout/Header.tsx` (avatar OR back chevron leading + title/subtitle + up to 3 trailing icon actions with optional badge dot)
- [x] `layout/TabBar.tsx` (glassmorphism pill, simple `tabs/activeKey/onChange` API — Phase 4 writes the React Navigation adapter)
- [x] `tsc --noEmit` clean
- [ ] Visual parity check against DESIGN.md §11 screen specs (deferred to when a real screen renders them — Phase 4)
- [ ] Wire `<ToastProvider>` into `App.tsx` (do this in Phase 4 when App.tsx tree is set up)
- [ ] Add `@expo/vector-icons` as an explicit dependency before TestFlight (currently transitive via `expo`)

## Phase 4: Navigation + Auth + Onboarding

### Batch 1 — Auth gate + Welcome / SignUp / SignIn (completed 2026-05-28)

- [x] `src/hooks/useAuthBootstrap.ts` — restores session at launch + subscribes to onAuthStateChange; hydrates authStore
- [x] `src/navigation/RootNavigator.tsx` — Auth ↔ Main switch driven by `authStore.session` (conditional `<Stack.Screen>` blocks; React Navigation 7 idiomatic)
- [x] `src/screens/auth/WelcomeScreen.tsx` — animated ChorelyLogo hero + Create account / I already have an account CTAs
- [x] `src/screens/auth/SignUpScreen.tsx` — RHF + Yup (displayName + email + password); calls `auth.signUp`; handles email-confirmation case by redirecting to Login with an info toast
- [x] `src/screens/auth/LoginScreen.tsx` — RHF + Yup (email + password); calls `auth.signIn`; ghost "Create one" link to SignUp
- [x] `src/screens/parent/DashboardStub.tsx` — placeholder post-sign-in landing; greeting + status card + showcase shortcut + sign-out
- [x] `App.tsx` — wired `useAuthBootstrap()`; gates navigator on both fontsReady AND authReady so signed-in users don't flash Welcome
- [x] Removed `PlaceholderScreen` + smoke-test code (the auth flow now exercises the same code paths end-to-end)
- [x] `tsc --noEmit` clean
- [ ] Test: sign up → land on DashboardStub
- [ ] Test: sign out → return to Welcome
- [ ] Test: sign in → land on DashboardStub
- [ ] Test: kill + relaunch app while signed in → still on DashboardStub (no Welcome flash)

### Batch 2 — Onboarding + Main shell (code complete 2026-05-28, ⏳ awaiting manual verification)

- [x] `src/screens/auth/OnboardingWizard.tsx` — 2-step wizard (family name → first child + optional DOB); calls `rpc.completeOnboarding`, hydrates familyStore, plus a "Not you? Sign out" escape hatch
- [x] Detect post-signup state (no family yet) and route to OnboardingWizard — `useFamilyBootstrap` loads family context; RootNavigator gates session → Onboarding → Main
- [x] `src/navigation/MainNavigator.tsx` — bottom tabs (Home / Chores / Rewards / Family / Settings) using TabBar via a `ChorelyTabBar` React Navigation adapter (emits `tabPress`)
- [x] Replace DashboardStub with the tabbed Main shell — deleted `DashboardStub.tsx`; `HomeScreen` is minimal-real (family summary + roster + pending-approvals placeholder); Chores/Rewards stubs; Family read-only roster; Settings carries sign-out + dev showcase link
- [x] `App.tsx` gates navigator on fontsReady && authReady && **familyReady** (no flash of Welcome or Onboarding for returning users)
- [x] `src/screens/parent/layout.ts` — `TAB_BAR_CLEARANCE` so scroll content clears the floating glass tab bar
- [~] Delete ComponentShowcase + Showcase route — **deferred** (condition not met: tab screens are still stubs in Batch 2). Showcase kept reachable from Settings; delete in Phase 5+ once real screens render the components in real contexts.
- [ ] Add `@expo/vector-icons` as an explicit dependency (currently transitive) — still pending

**Verification gate (run in iOS Simulator):**
1. New signup → lands on OnboardingWizard (not Home)
2. Step 1 family name → Continue → Step 2 child name (+ optional DOB) → Create my family → lands on Home tab
3. Home shows family name, invite code, 1 child in roster, total points
4. Tab bar switches between Home / Chores / Rewards / Family / Settings
5. Settings → Sign out → Welcome; sign back in → lands straight on Home (no Onboarding flash)
6. Settings → "View component showcase" still works and back returns to Settings

## Phase 5: Parent Dashboard (code complete 2026-05-28, tsc + Metro green)

- [x] `screens/parent/ParentDashboard.tsx` — greeting header (avatar + family name); replaces the minimal HomeScreen as the Home tab; HomeScreen deleted
- [x] Pending Approvals card with counter + preview (green "all caught up" vs pink "N waiting" + Review button → Chores tab)
- [x] Today's Snapshot — 3 stat tiles (Assigned/pink, Completed/green, Points/orange) computed from assignments + children points
- [x] Quick Actions grid — Add chore / Create reward / View family / Review requests (navigate to tabs; modals arrive Phase 6/7; Review shows a pending-count badge)
- [x] Family Progress cards — one per child: avatar, points, streak, completion ProgressRing (approved/total, gradient ring)
- [x] Wire to `familyStore`, `choreStore`, `activityStore` — loads assignments/chores/activity/children on mount; toasts first error
- [x] Pull-to-refresh — added `refreshControl` prop to `ScreenContainer`; dashboard re-fetches all four datasets

Note: chore/assignment data only populates after Phase 6, so snapshot/progress show zeros today (by design). Activity is fetched into `activityStore` but not yet surfaced (no recent-activity card in the spec; revisit if added).

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
