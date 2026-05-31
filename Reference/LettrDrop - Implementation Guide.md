# LettrDrop — Implementation Guide

How to turn these mockups into a **real, working React app**, walking the actual user
journey. This is a high‑level map: for each stage it names the **assets** to lift, the
**state / logic / services** to add to make them live, and the **mechanics** they implement.

> Read alongside **`LettrDrop — Design & Mechanics.md`** (referenced as *§n* below) and the
> source files in this project. The mockups are **presentational** — every screen is a pure
> view. "Making it real" means feeding those same views with live state and wiring them to
> services.

---

## 0. Foundation — do this first

**Target.** These are 430×880 phone screens. Build for mobile: **React Native / Expo** or a
**React PWA**. The component patterns transfer either way.

**Port the design system (it's already reusable).**
- `lettrdrop.css` → your global stylesheet / CSS Modules (web) or a `StyleSheet` + theme
  tokens (RN). It's the single source of truth for all styling.
- `lettrdrop-components.jsx` → your real component library. `Logo`, `DropTile`, `MiniTile`,
  `DropBoard`, `Btn`, `Modal`, `AuthHead`, `DTopBar`, `DStats`, `PlayStrip`, `DropInGame`
  are written to be reused as‑is.
- Keep `tileVars(letter)` + `FV_VALUES` / `FV_PAL` as the **canonical** letter‑value‑to‑color
  mapping (§1). Everything visual derives from it.

**App shell.** Set up routing/navigation and a session‑aware root that branches
*signed‑out → auth* vs *signed‑in → home*.

**Global state** (Context/Zustand/Redux): `session`, `profile`, `isPremium`, `bestScore`,
`hasPlayedBefore`, `settings`. Persist to device storage; mirror authoritative data on a backend.

**Services to stand up** (details in the stages that use them):

| Service | Used by | Purpose |
|:--|:--|:--|
| Auth backend | Stage 1, 8 | Identifier lookup, password, social OAuth, display‑name uniqueness |
| Profile / Leaderboard API | Stage 2, 5, 7 | Best score, words/game, high‑scores list |
| IAP (in‑app purchase) | Stage 7 | $5 one‑time premium, receipt validation, restore |
| Rewarded Ads SDK | Stage 6 | +1 assist, revive |
| Dictionary | Stage 4 | Instant word validation for auto‑clear |

**Route → screen map**

| Route | Screen asset(s) |
|:--|:--|
| `/auth` | `AuthEntry` → `AuthPassword` / `AuthCreate` / `AuthSocialName` |
| `/auth/reset` | `ForgotSent`, `ResetPassword` |
| `/home` | `Home` |
| `/tutorial` | `TutoWelcome` → `TutoMatch` → `TutoControl` → `TutoSwapHow` → `TutoJumbleHow` |
| `/play` | `DropInGame` (+ overlays: `Paused`, assist states, `NewBestMoment`) |
| `/results` | `GameOver` / `NewHighScore` |
| `/scores` | `HighScores` |
| `/profile` | `Profile`, `EditName` |
| `/premium` | `Paywall` |

---

## 1. Sign‑up / auth flow

**Assets:** `AuthEntry`, `AuthPassword`, `AuthCreate`, `AuthSocialName`, `AuthHead`, `Btn`,
`.field`, `.authbtn`, `.avail` states.

**Build it real:**
- **Identifier‑first** (§4). One email field + social buttons. On **Continue**, call
  `auth.lookup(email)` → route to `AuthPassword` (known) or `AuthCreate` (unknown).
- **Social OAuth** (Apple/Google/Facebook). If the provider returns no name → `AuthSocialName`.
- **Display‑name uniqueness:** debounce input → `auth.checkName()` and drive the
  `.avail.ok` / `.avail.no` UI live.
- On success, store the **session token**, hydrate `profile` + `isPremium`, then go to `/home`.

---

## 2. Home

**Assets:** `Home` (takes a `premium` prop), `Logo`, `bestchip`, `menu-btns`, `Btn`.

**Build it real:**
- Landing after auth. Hydrate welcome name + `bestScore` from profile.
- **Hide "Go Premium"** when `isPremium` (the asset already does this via the prop).
- Wire buttons: **New Game** → check `hasPlayedBefore` (→ Stage 3 or 4); **High Scores** →
  `/scores`; **Go Premium** → `/premium`; avatar → `/profile`.

---

## 3. First time (tutorial)

**Assets:** `TutoWelcome`, `TutoMatch`, `TutoControl`, `TutoSwapHow`, `TutoJumbleHow`,
`TutoFrame`.

**Build it real:**
- Gate on `hasPlayedBefore` (persisted). First `New Game` → push `/tutorial`.
- Drive the carousel with a **step index**: Next/Back move it, the dots reflect it. The
  step animations already loop — you only add navigation.
- **Step 1 (`TutoMatch`)** teaches the **longest‑word grace** (§4): the word throbs, a tile
  extends STAR → STARE, then it clears with a floating **+N**. Keep that demo in sync with the
  real engine's grace behavior.
- **Skip** or finishing the last step sets `hasPlayedBefore = true` and starts the game.
- Keep it **re‑openable** from a menu/settings entry. (§6)

---

## 4. In game — the engine (the big one)

The mockups show **static snapshots**; here you build the falling‑letters engine that drives
the *same* components with live state.

**Assets:** `DropInGame` (frame), `DTopBar` (Jumble · Swap · Pause), `DStats`, `PlayStrip`
(NEXT), `DropBoard` (renderer), `PlayHint`, plus overlays `Paused`, `JumbleActive`,
`SwapDemo`'s flip, `ClearPop`'s pop, `NewBestMoment`.

**The view‑model already matches the engine.** `DropInGame`/`DropBoard` props *are* your game
state — render the live game by passing real values:

| Prop | Engine state |
|:--|:--|
| `grid` | 8×6 array of `letter \| null` |
| `active` `{r,c,L}` | the live falling tile |
| `ghost` | projected landing cell (footprint) |
| `next` | upcoming‑tiles queue (3) |
| `matched` / `clearCls` | cells clearing this frame + which animation |
| `pending` | cells in a word's **grace window** → throb (pre‑clear, no word label) |
| `shuffling` / `rocking` / `swapping` | jumble / danger / swap states |
| `jumbles` / `swaps` | remaining assist counts → `DTopBar` badges |
| `score` / `words` / `best` | `DStats` |

**Engine loop to build (§1):**
1. **Spawn** the live tile + NEXT from a **weighted** pool (rarer letters less frequent).
2. **Gravity tick** (rAF/interval) drops the live tile; speed ramps with progress.
3. **Input:** drag/keys move it horizontally (collision vs. walls & pile); **tap/hold =
   soft‑drop** (faster fall — *not* tap‑to‑place). Recompute `ghost` each move.
4. **Lock** when it can't fall further.
5. **Resolve:** scan every row & column for a **valid word** (dictionary lookup, length ≥ 3).
   Don't pop on contact — first run the **longest‑word grace** (below). When a span finally
   commits: mark `matched` → pop & sparkle → apply **gravity** so tiles above fall → **re‑scan**
   for chains. Add word value to `score`, bump `words`.
   - **Longest‑word grace.** On detecting a valid word, mark its cells **`pending`** — they
     **throb** (`.tile.pending`, staggered per column for a wave) — no word label or popup,
     the throb is the whole signal — and start a **~1.5 s timer** keyed to that span; *don't clear yet*.
     Each lock, re‑scan: if a tile **extended** the span into a longer valid word (either end),
     **reset the timer** and move `pending` to the longer span. Only when the
     timer fires with **no extension** do you commit the clear above. Track timers **per word**
     so independent/crossing words resolve on their own clocks. The window is a tuning knob —
     store it in config (~1.5 s). On commit, award the score as a **floating "+N"** that drifts
     up off the tiles (`.score-float`) — never echo the word back. *(Mockup: `PendingClear` in the "Word cleared" section.)*
6. **Danger / topout:** when the pile is high, set `rocking`. If a new tile can't spawn →
   **Stacked Out** → offer revive (Stage 6) then results (Stage 5).

**Assists (§2):**
- **Jumble** (start 3): collect all letters → redistribute into random columns → gravity‑settle
  → decrement. At `0` the badge becomes **▶** (Stage 6).
- **Swap** (start 2): replace the **live tile's** letter with a new weighted‑random one
  (NEXT untouched) with the coin‑flip anim → decrement → `0` ⇒ **▶**.
- **Pause:** freeze the loop, show `Paused` (Resume / Restart / Quit).

**Word validation:** bundle a **local dictionary** (a `Set` or Trie) so auto‑clear scanning
is instant — never hit the network inside the loop.

**New Best (live):** when `score` passes `best` mid‑game, fire `NewBestMoment` (non‑blocking)
and glow the Score stat. Play continues.

---

## 5. High score / game over

**Assets:** `GameOver` (neutral "Stacked Out"), `NewHighScore` (celebration), `HighScores`,
`RankPeek` (global‑rank slice embedded in both game‑over faces).

**Build it real:**
- On game end, finalize score. If it beats `bestScore` → persist + submit to the leaderboard →
  show **`NewHighScore`**; otherwise show **`GameOver`**.
- Buttons: **Play Again** (re‑init the engine), **Home**, **Share** (share a score card).
- **`RankPeek`** (on both faces) needs the player's **global rank** plus the **±1 neighbor rows**
  for this score: call `leaderboard.around(score)` → `{ myRank, total, rows:[above, me, below] }`.
  On a record, also surface the **rank delta** (*↑9*) from the pre‑game standing. Its link opens
  the full **`HighScores`** board. Submit the score *before* querying so the slice reflects it.
- **`HighScores`** pulls leaderboard rows (rank, score, words, when, `isMe`). (§5)

---

## 6. Rewards / revive

**Assets:** `AdOverlay` (rewarded ad), `Revive`, `JumbleSpent`, `SwapSpent`.

**Build it real:**
- Integrate a **rewarded‑ads SDK**; mount it where the mockup's 5‑second fake ad sits.
- **Triggers:** an assist at `0` (`JumbleSpent` / `SwapSpent` CTA) → `AdOverlay` → on
  completion grant **+1** of that assist. **Topout** → `Revive` (once per game) → ad →
  **clear the bottom 4 rows** and resume.
- **`Revive`** also embeds the **`RankPeek`** (same `leaderboard.around(score)` slice as game
  over) plus **Play Again / Home** exits, so declining the ad still shows where the run ranked.
- **Premium** users skip ads entirely (unlimited assists, instant revive). Track
  `reviveUsedThisGame`. (§3)

---

## 7. Accounts & premium

**Assets:** `Profile` (free/premium), `Paywall`, `premcard`, `adfree-banner`.

**Build it real:**
- **`Profile`** shows best score + most‑words/game from the backend; crowned avatar when premium.
- **Go Premium** → **`Paywall`** → IAP **$5 one‑time** (non‑consumable). On a **server‑validated**
  receipt, set `isPremium = true` → remove ads, unlock unlimited jumbles/swaps, show the
  ad‑free banner, hide upsells. Support **Restore Purchases**. (§3)

---

## 8. Accounts management

**Assets:** `EditName` (modal over `Profile`), `ForgotSent`, `ResetPassword`.

**Build it real:**
- **Edit display name:** reuse the debounced uniqueness check (§4) → save → update profile +
  leaderboard identity.
- **Forgot password:** request reset email → `ForgotSent` → deep link → `ResetPassword`.
- **Sign out** clears the session and returns to `/auth`.

---

## 9. Post‑launch hardening

**Circle back once the core game is working end‑to‑end.**

- **Re‑enable email confirmation** in Supabase → Authentication → Settings. Add a
  "check your inbox" screen (`ConfirmEmail`) after sign‑up so new users know to verify.
  Update the auth flow to handle the `email_not_confirmed` error gracefully.
- **Social OAuth providers** (Apple / Google / Facebook):
  1. Register a developer app with each provider and obtain client ID + secret.
  2. Enter the credentials in Supabase → Authentication → Providers.
  3. Configure the redirect URL (`<supabase-url>/auth/v1/callback`) in each provider's dashboard.
  4. Wire the social buttons in `AuthPage` to call `supabase.auth.signInWithOAuth({ provider })`.
  5. Handle the `AuthSocialName` screen for providers that don't return a display name.
- **Password‑reset flow:** wire `ForgotSent` → Supabase `resetPasswordForEmail` →
  deep‑link → `ResetPassword` screen → `updateUser({ password })`.

---

## Cross‑cutting checklist

- **Design tokens:** keep `tileVars` + `FV_VALUES` / `FV_PAL` as the one source for tile
  color; pull surface/shadow colors and the `--cshadow` lip from §7.
- **Persistence keys:** `session`, `bestScore`, `hasPlayedBefore`, `isPremium`,
  per‑game assist counts (reset on New Game), `settings`.
- **Premium gating** touches Stages 2, 4, 6, 7 — centralize the `isPremium` check.
- **Engine ≠ view:** the game logic is the only genuinely new code. The screens, overlays,
  buttons, tiles, and chrome are all done — drive them with state.
