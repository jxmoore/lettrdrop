# LettrDrop — In‑Game Layout v2 · Implementation Guide

How to build the reworked play screen: **HOLD + assist buttons on a left rail,
the NEXT queue on a right rail, the well centred between them, Score/Words/Best
hugging the bottom of the board, and a logo + quit ✕ in the top bar.**

---

## 1. Where the source lives

Everything you need is already in this project — copy from these two files:

| File | What to take from it |
|:--|:--|
| **`lettrdrop.css`** | The block commented **`In-game layout (v2)`** near the end of the file — all the `.ig-*` classes, plus the `.dboard-fit` rule. This is the single source of truth for the layout. |
| **`lettrdrop-components.jsx`** | The **`DropInGame`** component and its four helpers — **`QTile`**, **`HoldSlot`**, **`VNext`**, **`QuitBtn`** — plus the `fit` branch added to **`DropBoard`**. |

The tile colour system (`tileVars`), the candy icon glyphs (`JumbleIcon`,
`SwapIcon`, `PauseIcon`), the labelled button (`AssistBtn`), the stats row
(`DStats`), the gesture hint (`PlayHint`) and the wordmark (`Logo`) are all
existing pieces in `lettrdrop-components.jsx` — reuse them as‑is.

---

## 2. The DOM structure

```
.pscreen.ig
├── .ptop                         ← top bar
│   ├── .plogo  →  <Logo s={36} />
│   └── .icons  →  <QuitBtn/>      ← the close ✕
├── .ig-stage                     ← the play row (flex, 3 columns)
│   ├── .ig-railL                 ← LEFT rail
│   │   ├── .ig-panel  → HOLD label + .ig-holdslot
│   │   └── .ig-railctrls → Jumble · Swap · Pause  (AssistBtn ×3)
│   ├── .ig-boardcol              ← CENTER
│   │   ├── .dboard.dboard-fit    ← the well (DropBoard fit)
│   │   └── .stats-row            ← Score / Words / Best (DStats)
│   └── .ig-railR                 ← RIGHT rail
│       └── .ig-panel  → NEXT label + .ig-vtrack (6 × QTile)
└── PlayHint                      ← "drag to move · tap to drop"
```

`.ig-stage` is `display:flex; align-items:flex-start; gap:10px`. The rails are
`flex:0 0 auto`; `.ig-boardcol` is `flex:1`. The rails top‑align, so they sit
beside the upper part of the (taller) well.

---

## 3. The four things that make it work

1. **The well is a tall, narrow 6×12 grid.** Because the rails eat horizontal
   space, the board is narrow — so it needs to be tall to fill the screen.
   `DropInGame` pads whatever grid it's given **up to 12 rows** by prepending
   empty rows, and shifts the live‑tile / ghost / matched coordinates by the
   same amount so they stay put. (See `IG_ROWS`, `padN`, `shiftCell`.)

2. **Size the well by aspect‑ratio, not by the cells.** This is the one gotcha.
   If you let the grid auto‑size its rows, the row tracks collapse and the
   bottom tiles overflow onto the stats. Fix: `DropBoard` with `fit` sets
   `aspect-ratio: cols / rows` and `grid-template-rows: repeat(rows, 1fr)` on
   the board, and `.dboard-fit .cell, .dboard-fit .tile { aspect-ratio: auto }`
   lets the tiles fill those 1fr tracks. Keep ~16px between board and stats so
   the candy tile shadow doesn't bleed onto the stat boxes.

3. **NEXT shows six and tapers.** `VNext` renders the queue with
   `sizes = [34, 32, 30, 28, 26, 24]` and a gentle opacity fade — next‑up tile
   biggest at the top. `DropInGame` pads the passed `next` array up to 6
   (`IG_NEXT_PAD`) so a short queue still fills the rail.

4. **HOLD + assists match the queue tile size.** `.ig-holdslot` and
   `.ig-railctrls .iconbtn` are both `34 × 39px` — the same footprint as the
   top NEXT tile — so the two rails read as a balanced pair.

---

## 4. The quit ✕

- It's `QuitBtn` → `.ig-quit`: a muted white candy chip (38px) with a stroked
  ✕, distinct from the coloured game buttons so it reads as "exit," not an action.
- It lives in `.ptop > .icons` (top‑right). `.ig-quit { margin-right: 5px }`
  nudges it left so its centre lines up with the NEXT column below it.
- Wire its `onClick` to your "quit / confirm‑quit" flow.

---

## 5. Spacing / breathing room

- `.pscreen.ig { padding: 26px 18px 16px }` drops the whole screen down a touch.
- `.ig-stage { margin-top: 18px }` opens space between the logo and the play area.
- `<Logo s={36} />` — the larger logo fills the top‑left now that the controls
  moved to the rail.

---

## 6. Props on `DropInGame` (what your game state feeds in)

| Prop | Meaning |
|:--|:--|
| `grid` | 2‑D array of letters / `null`; padded up to 12 rows automatically |
| `active` `{r,c,L}` | the live falling tile |
| `ghost` `{r,c}` | landing‑footprint cell |
| `hold` | the held letter (or `null` for an empty dashed slot) |
| `next` | array of upcoming letters (auto‑padded to 6) |
| `jumbles` / `swaps` | remaining counts → badge; `0` flips the badge to ▶ (rewarded‑ad) |
| `score` / `words` / `best` | the stat read‑out |
| `matched` / `clearCls` / `shuffling` / `rocking` / `swapping` | clear‑word, jumble and swap animation states |
| `scoreGlow` | gold pulse on the Score box (new‑best moment) |
| `overlay` | a modal layered on top (pause, ad, game over…) |

Every existing gameplay screen (paused, jumble, swap, ad, revive, game‑over,
new‑best) is just `DropInGame` with different props + an `overlay`, so they all
inherit this layout for free.
