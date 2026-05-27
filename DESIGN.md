# DESIGN.md — Chorely Visual System

> **Append-only:** Whenever you discover a new design token, rule, or anti-pattern during the project, add it to the correct section below. CLAUDE.md never duplicates design content — this file is the single source of truth for the visual system.

---

## 1. Brand

The visual design follows the **Lumina Bloom** design system: pink, orange, and green on a light lavender background with intentional glassmorphism.

### Brand Logo

The Chorely logo is a rounded-square smiley face with a pink→orange gradient border, and a "Chorely" wordmark in pink below. Logo components live in `src/components/brand/`:

- `ChorelyLogo` — three variants: `full` (stacked icon + wordmark), `horizontal` (inline), `icon` (smiley only)
- `ChorelyIcon` — standalone smiley-square icon

The wordmark uses **Nunito ExtraBold** (`@expo-google-fonts/nunito`).

---

## 2. Color Tokens

Authored in hex for React Native compatibility. Values are perceptually balanced — do not introduce a new hue without recording it here first.

```ts
// Brand palette
pink:       '#FF4D8D'   // Primary — CTAs, active nav, progress bars, headings
orange:     '#FF8C42'   // Secondary — points, reward energy, highlights, coin icons
green:      '#00A92A'   // Success ONLY — completed/approved states, earned confirmations
bg:         '#F3F0FF'   // Neutral lavender background, every screen

// Text
textDark:   '#2D2D3A'   // Headings, primary body
textMid:    '#6B6B80'   // Secondary text, captions
textLight:  '#A8A8B8'   // Placeholder, muted labels
textWhite:  '#FFFFFF'   // Text on colored/gradient backgrounds

// Surface & glass
glass:      'rgba(255, 255, 255, 0.70)'   // Main card backgrounds
glassLight: 'rgba(255, 255, 255, 0.50)'   // Subtle containers, overlays
border:     'rgba(255, 255, 255, 0.50)'   // Default card borders
borderPink: 'rgba(255, 77, 141, 0.30)'    // Active/selected card borders

// Tinted alphas
pinkAlpha15:  'rgba(255, 77, 141, 0.15)'
pinkAlpha10:  'rgba(255, 77, 141, 0.10)'
orangeAlpha15:'rgba(255, 140, 66, 0.15)'
orangeAlpha10:'rgba(255, 140, 66, 0.10)'
greenAlpha15: 'rgba(0, 169, 42, 0.15)'
greenAlpha20: 'rgba(0, 169, 42, 0.20)'
mutedAlpha20: 'rgba(168, 168, 184, 0.20)'
redAlpha15:   'rgba(220, 38, 38, 0.15)'
```

---

## 3. Avatar Gradients

Five gradient pairs cycled for family members, in fixed order so the same child always gets the same gradient.

```ts
['#FF8C42', '#FF4D8D']   // Orange → Pink   (child 1)
['#4D9FFF', '#8C42FF']   // Blue → Purple   (child 2)
['#42FFB8', '#42C9FF']   // Green → Cyan    (child 3)
['#FFD742', '#FF8C42']   // Gold → Orange   (child 4)
['#A742FF', '#FF4D8D']   // Purple → Pink   (child 5)
```

---

## 4. Border Radius Scale

```ts
r8:    8     // Inner chips, small badges
r10:   10    // Small pill badges
r12:   12    // Compact buttons, toggle tracks
r14:   14    // Inputs, medium buttons
r16:   16    // Section headers
r18:   18    // Standard cards
r20:   20    // Large reward cards
r24:   24    // Hero cards, bottom navigation
rFull: 9999  // Avatars, pill labels
```

---

## 5. Shadows

```ts
shadowSm:   { offset: { width: 0, height: 1 },  radius: 4,  opacity: 0.06 }                    // Subtle elevation
shadowMd:   { offset: { width: 0, height: 4 },  radius: 16, opacity: 0.08 }                    // Standard cards
shadowLg:   { offset: { width: 0, height: 8 },  radius: 32, opacity: 0.12 }                    // Prominent cards
shadow2xl:  { offset: { width: 0, height: 16 }, radius: 48, opacity: 0.16 }                    // Modals, bottom nav
shadowPink: { offset: { width: 0, height: 4 },  radius: 16, opacity: 0.28, color: '#FF4D8D' }  // Primary buttons
```

---

## 6. Spacing (8-pt scale)

```
4 / 8 / 12 / 16 / 20 / 24 / 32 / 40 / 48 px
```

- Standard screen padding: **16px horizontal**, **24px between sections**
- Inside a card: **16px padding**
- Between sibling cards: **12px gap**

---

## 7. Typography

Font families: **Nunito** for headlines, **DM Sans** for body. Loaded via `@expo-google-fonts/nunito` + `@expo-google-fonts/dm-sans` (already in App.tsx).

```ts
// Variants loaded in App.tsx
Nunito_400Regular, Nunito_600SemiBold, Nunito_700Bold, Nunito_800ExtraBold
DMSans_400Regular, DMSans_500Medium, DMSans_600SemiBold, DMSans_700Bold

// Type scale
display:  { fontFamily: 'Nunito_800ExtraBold', fontSize: 42, letterSpacing: -1.4 }
headline: { fontFamily: 'Nunito_800ExtraBold', fontSize: 30, letterSpacing: -0.8 }
title:    { fontFamily: 'Nunito_700Bold',      fontSize: 20, letterSpacing: -0.4 }
body:     { fontFamily: 'DMSans_400Regular',   fontSize: 15 }
caption:  { fontFamily: 'DMSans_500Medium',    fontSize: 12, letterSpacing: 0.1 }
button:   { fontFamily: 'DMSans_700Bold',      fontSize: 15, letterSpacing: -0.1 }
heroNum:  { fontFamily: 'Nunito_800ExtraBold', fontSize: 52, letterSpacing: -1.8 }
```

App-wide accessibility cap: `maxFontSizeMultiplier: 1.5` on `Text` and `TextInput` (set in App.tsx).

---

## 8. Age-Bracket Theme Overrides

Each child's age bracket is derived from `date_of_birth` via `getAgeBracket()`. The base glass aesthetic stays the same; accent colors and motion change per bracket.

```ts
elementary: {  // ages 5–10
  primary: '#FF4D8D',
  secondary: '#FC8A40',
  successAccent: '#A8E6CF',
  backgroundGradient: ['#FFF0F7', '#FFF5EA'],
  glassTint: 'rgba(255, 77, 141, 0.14)',
  borderRadius: { card: 24, button: 999, bottomSheet: 30 },
  touchTarget: 56,
  iconVariant: 'filled',
  spring: { damping: 8, stiffness: 100 },    // bouncier
}

middle_school: {  // ages 11–14
  primary: '#6E61FF',
  secondary: '#8A80FF',
  successAccent: '#B2EBF2',
  backgroundGradient: ['#F2F0FF', '#EEF5FF'],
  glassTint: 'rgba(110, 97, 255, 0.12)',
  borderRadius: { card: 22, button: 999, bottomSheet: 26 },
  touchTarget: 48,
  iconVariant: 'mixed',
  spring: { damping: 12, stiffness: 120 },
}

high_school: {  // ages 15–18
  primary: '#5A4CE0',
  secondary: '#B388FF',
  successAccent: '#E8D5FF',
  backgroundGradient: ['#F5F1FF', '#ECE7FF'],
  glassTint: 'rgba(90, 76, 224, 0.10)',
  borderRadius: { card: 20, button: 999, bottomSheet: 24 },
  touchTarget: 48,
  iconVariant: 'outline',
  spring: { damping: 20, stiffness: 200 },   // snappier
}
```

---

## 9. Component Rules

- All cards use glass background (`glass` token, ~rgba white 70%) with `expo-blur` BlurView on iOS (intensity 12–20). Android falls back to solid semi-transparent fill.
- Primary buttons: pink (`#FF4D8D`) fill, white text, pink-tinted shadow (`shadowPink`).
- Inputs: glass or surface background with `border` token; focus state lifts to `borderPink`.
- Background is **light lavender** (`#F3F0FF`) by default. Dark mode is an opt-in toggle, never the default.
- Minimum touch target: **48px** standard, **56px** for elementary bracket.
- Loading: skeleton shimmer, not spinners (lists + cards).
- Press feedback: `scale(0.98)` on all tappable elements.
- Icon set: `@expo/vector-icons` (Ionicons preferred). Stroke variant by bracket per §8.

---

## 10. Anti-Patterns (forbidden)

These are the AI-default tells that make output look machine-made. Each item should become a static or visual test in Phase 10.

- **Banned fonts:** Inter, Geist, any system-default sans. Agents reach for these by default — that's the giveaway.
- **Banned icon set:** Lucide. Use Ionicons via `@expo/vector-icons`.
- **Uniform contrast:** every element rendered at equal weight flattens the page. Pink for primary action only; green for success only; everything else recedes.
- **Centered single-CTA hero as default layout:** acceptable on Welcome screen; never on Dashboard, Chores, Rewards, Family, or Settings.
- **Lazy glassmorphism:** `background: 'rgba(255,255,255,0.5)'` slapped on everything is the AI-default tell. Our glassmorphism is intentional — it requires real `BlurView` on iOS, designed alpha values, and `border`/`borderPink` tokens that match the surface beneath.

**Note on glassmorphism in Chorely:** The Lumina Bloom system is glass-forward by deliberate brand choice. This conflicts with the general "no glassmorphic gradient panels" anti-pattern in generic web design docs. The resolution: our glass is *designed* (alpha values, blur intensity, and gradients are all specified above), not slapped on arbitrarily. If you reach for `rgba(255,255,255,0.5)` without referencing the `glass` / `glassLight` tokens above, you're in anti-pattern territory.

---

## 11. Screen Specifications

All screens must match these layouts. Pixel-level parity with the prototype is the bar.

### Parent Home Dashboard
- Personalized greeting header with parent avatar
- Pending Approvals card with counter and contextual preview
- Today's Snapshot: 3 stat tiles (Assigned/pink, Completed/green, Points/orange)
- Quick Actions grid: Add Chore, Create Reward, View Family, Review Requests
- Family Progress section: one card per child with avatar, completion ratio, points, streak
- Bottom Navigation: 5 tabs (Home, Chores, Rewards, Family, Settings) with glassmorphism pill

### Create Chore
- Form fields: Title, Assign To (child pills), Frequency (segmented), Due Date, Due Time, Point Value, Photo Proof toggle, Notes
- Save button (pink gradient) and Cancel button (glass)
- Validation required on title and point value

### Child Home (v1.1 — not built in v1.0)
- Greeting header with chore count
- Hero Progress Card: points balance, circular progress ring, goal hint banner
- Today's Chores list with status-dependent card styles (todo, pending, approved)
- Streaks & Wins: 3-stat grid (Day Streak, This Week, Total Points)
- Bottom Navigation: 4 tabs (Home, My Chores, Rewards, Profile)

### Parent Approval
- Child info banner with avatar and timestamp
- Chore detail card with metadata chips
- Photo proof section (v1.1, placeholder in v1.0)
- Points impact preview: Current → +N → After
- Approve (pink gradient) and Deny (red-tinted) action buttons

### Rewards Catalog (parent-managed in v1.0; child-redeemable in v1.1)
- Points balance card with current total (per selected child)
- Filter tabs: All, Available, Locked
- Rewards grid with card states (available, locked, just-unlocked)
- Redeem interaction with success toast

---

## 12. Maintenance

- Append new tokens, gradients, or rules **here**, not in CLAUDE.md.
- Add new anti-patterns to §10 whenever you catch the agent reaching for one.
- When a token changes, also update `src/theme/tokens.ts` in the same commit.

---

<!--
CHANGELOG (newest first)
- 2026-05-27 Initial Lumina Bloom system split out of CLAUDE.md §6/§13. Fonts set to Nunito + DM Sans (matching App.tsx). Anti-patterns section added.
-->
