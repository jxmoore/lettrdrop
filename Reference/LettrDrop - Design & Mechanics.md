# LettrDrop — Design & Mechanics

A living reference for the LettrDrop mockups: how the game plays, every feature we've
designed, and the visual system that ties it together. Pairs with the files in this
project (see **[Code architecture](#code-architecture)** at the end).

> **Naming.** The product is **LettrDrop** — a falling‑letters word game. The brand
> wordmark reads *Lettr* + **D R O P** rendered as candy tiles. (An earlier tap‑to‑spell
> grid prototype, "WordFall", has been retired.)

---

## 1. Core loop

LettrDrop is a Tetris‑style word game played in a **6‑column well**.

- **Letters fall on their own** from the top, one *live tile* at a time.
- The player **steers** the live tile left/right; **tap or hold drops it faster** (soft‑drop). It is *not* tap‑to‑place — gravity is always pulling it down.
- A **landing footprint** glows in the column to show where the live tile will come to rest.
- **NEXT** previews the upcoming three tiles.
- Whenever a **valid word forms in any row or column**, it clears **automatically** — no submit button. Tiles **pop & sparkle**, then the bricks above **drop into the gap** (gravity).
- The pile rises over time. When it climbs dangerously high the letters **rock back and forth** as a warning. If a new tile can't enter, the game ends — **"Stacked Out."**

### Longest‑word grace
Clears are **not instant** — that would rob the player. The moment STAR forms it shouldn't vanish before the **E** that makes **STARE** can land. So a detected word enters a short **grace window** before it pops:

- On detecting a valid word (length ≥ 3), **highlight** it (the `matched` glow) and start a **~1.5 s grace timer** instead of clearing. During the window the word's tiles **throb** — a gentle scale‑pulse in a left‑to‑right wave — so the player reads it as *"I see it, hold on"* rather than *"the game missed it."* We deliberately **don't echo the word back** in a label or popup; the throb is the whole signal.
- If a newly landed tile **extends** that word into a longer valid word — at **either end** (STAR → STARE, EAT → **H**EAT) — **reset the timer** and re‑throb the new, longer span.
- When the timer elapses with **no further extension**, the throb **commits** to the pop & sparkle clear of the **longest valid version**. The score appears as a **floating "+N"** that drifts up and off the popped tiles (no card, no background) — rendered in candy **jumble‑purple with a hard 3‑D extruded edge** (the same lip idiom as the Jumble pill), never the word itself.
- Independent words elsewhere on the board run their **own** timers; a crossing row/column word that isn't part of the extension clears on its own schedule.

The window is a feel knob — long enough to reward a setup, short enough to stay brisk. Tune ~1.5 s.

**Stats tracked:** `Score`, `Words` (cleared this game), `Best` (all‑time).

### Letter values & color
Every letter has a point value; **tile color is determined by that value** (rarer = cooler/rarer hue). Word score = sum of letter values.

| Value | Letters | Color name | `--c` (face) |
|:--:|:--|:--|:--|
| 1 | A E I O S T R N | Pink | `#ff6f91` |
| 2 | L U D H C | Orange | `#ff924c` |
| 3 | M P F G W Y | Yellow | `#ffc83d` |
| 4 | B V K | Blue | `#4cc4ff` |
| 5 | X J | Purple | `#9b8cff` |
| 6 | Q | Teal | `#2fd6ad` |
| 7 | Z | Magenta | `#ff5fb0` |

Each color carries three tokens: `--c` (face), `--cl` (light, for the top of the gradient), `--cd` (dark, for the 3‑D bottom edge).

---

## 2. Assists

Two in‑run helpers, both surfaced as labelled buttons in the top bar. Each has a **free
allowance per game**; when spent, its badge flips to **▶** and offers a **rewarded ad for +1**.

### Jumble — *3 free per game*
Sweeps **every landed letter** off the board and drops them back into **random columns**.
Heights are **not** preserved: the whole stack reshuffles into fresh columns (still
gravity‑settled, so nothing floats). For when the board is gridlocked.

### Swap — *2 free per game*
Instantly replaces the **letter currently falling** (the live tile) with a **new random
letter**. Perfect when the live tile — a Q, a Z — won't fit anywhere useful. The queued
**NEXT** tiles are untouched. The tile does a quick **coin‑flip** as it morphs.

> Both assists share one pattern: counter badge → at `0` it becomes **▶** → tapping opens
> a 5‑second rewarded ad → **+1** of that assist.

---

## 3. Ads, revive & monetization

- **Rewarded ad (5s):** grants **+1** of the depleted assist (jumble or swap).
- **Revive — once per game:** on topping out, the player may watch an ad to **clear the
  bottom 4 rows** and keep playing. One use per run. The revive screen also shows the
  **global‑rank peek** (where this score landed) and **Play Again / Home** exits, so declining
  the ad still lands on the competitive context.
- **Premium — $5 one‑time:** **No ads, ever** + **unlimited jumbles & swaps**. A one‑time
  purchase (no subscription). Surfaced via a gold "Go Premium" card and a dedicated paywall.

---

## 4. Accounts

**Identifier‑first auth** — one entry field plus social buttons (Apple / Google / Facebook / email):

- **Known email** → ask for password.
- **Unknown email** → create account (display name + password).
- **Social sign‑in with no name** → pick a display name.

**Display names are unique** — they're how a player appears on the leaderboard. Supporting
flows: edit display name, forgot‑password → email‑sent → reset‑password.

**Profile** shows avatar (crowned for premium), best score, most words/game, and either the
Go‑Premium card (free) or an ad‑free banner (premium).

---

## 5. Endgame & celebration

- **New Best! (live, non‑blocking):** the instant your live score passes your all‑time best,
  a confetti flourish fires *during play* and the Score stat glows. Play continues.
- **Game over — two faces:**
  - **Stacked Out** (no record) — neutral results card with final score and gap to best.
  - **New High Score** — full celebration screen with confetti, the new score, and the delta.
  - **Both faces show a global‑rank peek:** a 3‑row slice of the leaderboard centered on the
    player (the rows just above and below, the player's row highlighted), with their standing
    (*"#1,240 of 8,420"*, or *"climbed to #3 ↑9"* on a record) and a link to the full board —
    so every score lands against the competition, not in a vacuum.
- **Home / menu:** New Game · High Scores · Go Premium (hidden for premium members).
- **High Scores:** ranked by score, each row showing when and words cleared; "YOU" tag on
  the player's own entries.

---

## 6. First‑time tutorial (How to Play)

Shown the **first time a new player taps New Game** (and re‑openable from the menu). A short,
swipeable, **skippable** sequence — each step plays a **looping mini‑animation** built from
the same tile/clear/swap/shuffle pieces the live game uses:

1. **Cover** — logo + "30‑second rundown."
2. **Spell a word to clear it** — a word lights up and **throbs** (the grace window); a tile lands to **extend** it (STAR → STARE), then it pops with confetti and a floating **+N**, and the stack drops.
3. **Steer the falling tile** — the live tile flies across, then drops; drag/tap hints.
4. **Swap** — the falling tile flips into a fresh letter.
5. **Jumble** — the whole stack reshuffles into new columns → "Let's play."

---

## 7. Design system

### Aesthetic
**Glossy candy.** Bright, tactile, 3‑D "candy‑crush" blocks with hard drop‑shadows and glossy
highlights. Playful and friendly, never corporate. Emoji are used *intentionally* as part of
the brand voice (👑 premium, 🎉 celebration, 🔀 jumble, 🔁 swap).

### Type
- **Baloo 2** (Google Fonts) — a rounded, chunky display face — used everywhere, weights
  **500–800**. Headlines/scores at 800; body/labels at 600–700.
- Monospace (`Courier New`) appears only inside the *fake ad* placeholder for an authentic
  "ad chrome" feel.

### Color
| Token | Value | Use |
|:--|:--|:--|
| Background | `#c6f1e3` (Mint) | App canvas, with a radial white top glow |
| Ink | `#235c4c` / `#1f6f57` | Primary text & headlines |
| Soft ink | `#5a9486` / `#80bba8` | Secondary text, labels |
| Accent (Pink) | `#ff6f91` | Primary action, highlights, points |
| Gold | `#ffe066 → #ffb84c` | Premium / "sunshine" actions |
| Blue | `#4cc4ff` | Pause control, ad badges |
| `--cshadow` | `#a6dcc7` | The mint "hard shadow" under white elements |

The board's letter tiles draw their color from the **value → color** table above.

### The candy elevation language
The whole UI is built on one shadow idiom: a **hard offset shadow with no blur**
(`0 Npx 0 <color>`) that reads as a solid 3‑D "lip," plus an inner top highlight and a soft
ambient shadow. Pressing a button removes the lip (`translateY`).

- **Tiles:** `inset 0 3px 0 rgba(255,255,255,.7)` (top gloss) · `0 6px 0 var(--cd)` (edge) ·
  `0 9px 12px rgba(40,30,60,.18)` (ambient). A `::before` gloss bar sits on top.
- **Cards / chips / stats:** white surface + `0 4–5px 0 var(--cshadow)`.
- **Radii:** generous — tiles 13–16px, cards 18–24px, pills 99px.

### Buttons (`.btn` → `<Btn>`)
| Variant | Look | Use |
|:--|:--|:--|
| `primary` | Pink gradient, pink lip | Main action (Play, Resume, Watch ad) |
| `gold` | Yellow gradient, gold lip | Premium / upgrade |
| `ghost` | Translucent white | Secondary (Restart, Home, Cancel) |

Modifiers: `wide` (full width), `lg` (taller). The recessed/disabled state sinks **into** the
surface (inverse of the raised lip).

### Iconography
Hand‑built, minimal SVG only: the **Jumble die**, **Pause** bars, and the **Swap** two‑arrow
glyph. No illustrative SVG; imagery and ad creative are placeholders.

### Motion
Short, springy, candy‑bouncy. Key animations: tile **bob** (live tile), **pending throb**
(valid word held in the grace window — pulses in a left‑to‑right wave),
**pop & sparkle** (clear), **gravity drop** (stack settles), **rock** (danger), **shuffle spin**
(jumble), **coin‑flip** (swap), and confetti **bursts** (celebrations). Tutorial demos loop
these in miniature.

---

## 8. Code architecture

| File | Role |
|:--|:--|
| `LettrDrop Feature Mockups.html` | Entry point — loads the stack below into a design canvas |
| `lettrdrop.css` | **Single overarching stylesheet** for all product UI |
| `lettrdrop-components.jsx` | **Design system** — primitives & reusable components, exported to `window` |
| `lettrdrop-screens.jsx` | **Screens** — every mockup, composed from the components |
| `lettrdrop-app.jsx` | Mounts the screens into the pan/zoom **design canvas**, grouped by section |
| `design-canvas.jsx` | The canvas/artboard host (starter component) |
| `LettrDrop Logo Explorations.html` (+ `logos.css`, `logos-app.jsx`) | Standalone brand/logo exploration |

**Load order matters:** `components → screens → app`. The components file populates `window`
first; screens destructure what they need from it.

### Reusable components (the design system)
- **Primitives:** `Logo`, `DropTile`, `MiniTile`, `DropBoard`
- **Generic UI:** `Btn` (`variant` = primary·ghost·gold, `wide`, `lg`), `Modal` (dim overlay + card)
- **Game chrome:** `AssistBtn`, `DTopBar` (Jumble · Swap · Pause), `DStats`, `PlayStrip` (NEXT),
  `PlayHint`, `DropInGame` (the in‑game screen frame most screens build on)
- **Auth:** `AuthHead` (logo + title)

A tile's color comes from `tileVars(letter)`, which maps the letter → value → the
`--c / --cl / --cd` trio used throughout the candy styling.
