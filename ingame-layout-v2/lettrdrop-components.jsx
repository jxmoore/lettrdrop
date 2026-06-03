/* ══════════════════════════════════════════════════════════════
   LettrDrop — design-system components (candy)
   Reusable primitives + UI shared across every screen. Loaded
   BEFORE lettrdrop-screens.jsx; everything is exported to window
   at the bottom. All styling lives in lettrdrop.css.
   ══════════════════════════════════════════════════════════════ */

/* ── Letter scoring + candy palette (tile colour = letter value) ── */
const FV_VALUES = { A:1,E:1,I:1,O:1,S:1,T:1,R:1,N:1, L:2,U:2,D:2,H:2,C:2, M:3,P:3,F:3,G:3,W:3,Y:3, B:4,V:4,K:4, X:5,J:5, Q:6,Z:7 };
const FV_PAL = {
  1:{c:'#ff6f91',cl:'#ffd2dd',cd:'#d44e6e'}, 2:{c:'#ff924c',cl:'#ffd9bf',cd:'#d96b2c'},
  3:{c:'#ffc83d',cl:'#fff0c2',cd:'#e0a212'}, 4:{c:'#4cc4ff',cl:'#c8ecff',cd:'#1f97d6'},
  5:{c:'#9b8cff',cl:'#ddd6ff',cd:'#6f5de0'}, 6:{c:'#2fd6ad',cl:'#b8f5e6',cd:'#14a883'},
  7:{c:'#ff5fb0',cl:'#ffcfe8',cd:'#d63a8c'},
};
/* CSS custom props that colour any tile from its letter */
const tileVars = (L) => { const p = FV_PAL[FV_VALUES[L] || 1]; return { '--c': p.c, '--cl': p.cl, '--cd': p.cd }; };

/* ── Brand wordmark · "Lettr" + DROP as candy game tiles ──
   `s` = the "Lettr" cap height in px; the tiles scale from it. */
const DROP_TILES = [
  ['D', '#ff6f91', '#ffd2dd', '#d44e6e', false],
  ['R', '#ff924c', '#ffd9bf', '#d96b2c', false],
  ['O', '#2fd6ad', '#b8f5e6', '#14a883', false],
  ['P', '#9b8cff', '#ddd6ff', '#6f5de0', true],
];
function Logo({ s = 26 }) {
  const tw = s * 0.9, th = s, tf = s * 0.55, gap = Math.max(2, s * 0.06), pr = -(s * 0.27), edge = Math.max(2, s * 0.1);
  return (
    <div className="tlogo" style={{ gap: s * 0.2 }}>
      <span className="pre" style={{ fontSize: s, letterSpacing: -s * 0.03, transform: `translateY(${s * 0.23}px)` }}>Lettr</span>
      <div className="row" style={{ gap }}>
        {DROP_TILES.map(([L, c, cl, cd, up], i) => (
          <span key={i} className="tlogo-tile" style={{
            width: tw, height: th, fontSize: tf, borderRadius: s * 0.27,
            '--c': c, '--cl': cl, '--cd': cd,
            boxShadow: `inset 0 ${s * 0.05}px 0 rgba(255,255,255,.7), inset 0 ${-s * 0.11}px ${s * 0.16}px rgba(0,0,0,.16), 0 ${edge}px 0 ${cd}, 0 ${edge * 1.6}px ${edge * 2}px rgba(40,30,60,.2)`,
            transform: up ? `translateY(${pr}px)` : 'none',
          }}><span className="gl">{L}</span></span>
        ))}
      </div>
    </div>
  );
}

/* ── Letter tiles ── */
function DropTile({ L, cls = '', drop, delay }) {
  const style = tileVars(L);
  if (drop != null) style['--drop'] = drop + 'px';
  if (delay != null) style.animationDelay = delay + 'ms';
  return (
    <div className={`tile ${cls}`} style={style}>
      <span className="tile-letter">{L}</span>
    </div>
  );
}
function MiniTile({ L, up = false }) {
  return <div className={`mini-tile${up ? ' up' : ''}`} style={tileVars(L)}>{L}</div>;
}

/* ── The falling well ── */
function DropBoard({ grid, cols = 6, fit = false, active = null, ghostCell = null, matched = [], clearCls = '', shuffling = false, rocking = false, swapping = false }) {
  const isMatched = (r, c) => matched.some(([mr, mc]) => mr === r && mc === c);
  const style = { '--cols': cols };
  if (fit) { style.aspectRatio = `${cols} / ${grid.length}`; style.gridTemplateRows = `repeat(${grid.length}, 1fr)`; }
  return (
    <div className={`dboard${fit ? ' dboard-fit' : ''}`} style={style}>
      {grid.map((row, r) => row.map((L, c) => {
        if (active && active.r === r && active.c === c) {
          return <DropTile key={`${r}-${c}`} L={active.L} cls={`active${swapping ? ' swapping' : ''}`} />;
        }
        if (L == null) {
          const ghost = ghostCell && ghostCell.r === r && ghostCell.c === c;
          return <div key={`${r}-${c}`} className={`cell${ghost ? ' ghost' : ''}`}></div>;
        }
        let cls = ''; let delay = null;
        if (shuffling) cls = 'shuffling';
        else if (isMatched(r, c)) cls = `matched ${clearCls}`.trim();
        else if (rocking) { cls = 'rock'; delay = c * 65; }
        return <DropTile key={`${r}-${c}`} L={L} cls={cls} delay={delay} />;
      }))}
    </div>
  );
}

/* ── Icons ── */
function JumbleIcon() {
  return (
    <svg className="jumble-die" width="26" height="26" viewBox="0 0 24 24" aria-hidden="true">
      <rect x="2.5" y="2.5" width="19" height="19" rx="6.5" fill="#ff6f91" />
      <rect x="2.5" y="2.5" width="19" height="10" rx="6.5" fill="#ffffff" opacity="0.22" />
      <circle cx="7.6" cy="7.6" r="1.95" fill="#fff" />
      <circle cx="16.4" cy="7.6" r="1.95" fill="#fff" />
      <circle cx="12" cy="12" r="1.95" fill="#fff" />
      <circle cx="7.6" cy="16.4" r="1.95" fill="#fff" />
      <circle cx="16.4" cy="16.4" r="1.95" fill="#fff" />
    </svg>
  );
}
function PauseIcon({ fill = '#fff' }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
      <rect x="5.5" y="4" width="5" height="16" rx="2.5" fill={fill} />
      <rect x="13.5" y="4" width="5" height="16" rx="2.5" fill={fill} />
    </svg>
  );
}
/* Swap: two opposing arrows — trade the live tile for a new one */
function SwapIcon() {
  return (
    <svg className="swap-glyph" width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 9 H17.5" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" />
      <path d="M14.5 6 L17.7 9 L14.5 12" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M19 15 H6.5" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" />
      <path d="M9.5 12 L6.3 15 L9.5 18" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ── Generic UI ── */
/* Candy push-button. variant: primary | ghost | gold. */
function Btn({ variant = 'primary', wide = false, lg = false, className = '', children, ...rest }) {
  const cls = ['btn', variant, wide && 'wide', lg && 'lg', className].filter(Boolean).join(' ');
  return <button className={cls} {...rest}>{children}</button>;
}
/* Dimmed modal overlay holding a centred card. */
function Modal({ children }) {
  return <div className="overlay dim"><div className="card">{children}</div></div>;
}

/* ── In-game chrome ── */
/* One labelled top-bar control (icon button + caption + optional badge). */
function AssistBtn({ label, variant = '', depleted = false, badge = null, badgeAd = false, children }) {
  const cls = ['iconbtn', variant, depleted && 'depleted'].filter(Boolean).join(' ');
  return (
    <div className="assist">
      <button className={cls}>
        {children}
        {badge != null && <span className={`badge${badgeAd ? ' ad' : ''}`}>{badge}</span>}
      </button>
      <span className="lab">{label}</span>
    </div>
  );
}
function DTopBar({ jumbles = 3, swaps = 2 }) {
  return (
    <div className="ptop">
      <div className="plogo"><Logo s={27} /></div>
      <div className="icons">
        <AssistBtn label="Jumble" depleted={jumbles === 0} badge={jumbles === 0 ? '▶' : jumbles} badgeAd={jumbles === 0}><JumbleIcon /></AssistBtn>
        <AssistBtn label="Swap" variant="swap" depleted={swaps === 0} badge={swaps === 0 ? '▶' : swaps} badgeAd={swaps === 0}><SwapIcon /></AssistBtn>
        <AssistBtn label="Pause" variant="pause"><PauseIcon /></AssistBtn>
      </div>
    </div>
  );
}
function DStats({ score = '1,240', words = '18', best = '3,910', scoreGlow = false }) {
  return (
    <div className="stats-row">
      <div className={`stat-box${scoreGlow ? ' glow' : ''}`}><div className="stat-label">Score</div><div className="stat-value">{score}</div></div>
      <div className="stat-box"><div className="stat-label">Words</div><div className="stat-value">{words}</div></div>
      <div className="stat-box"><div className="stat-label">Best</div><div className="stat-value">{best}</div></div>
    </div>
  );
}
function PlayStrip({ next = ['Q', 'U', 'A'] }) {
  return (
    <div className="playstrip">
      <div className="next-preview">
        <span className="lab">Next</span>
        <div className="next-tiles">{next.map((L, i) => <MiniTile key={i} L={L} up={i > 0} />)}</div>
      </div>
    </div>
  );
}
function PlayHint() {
  return (
    <div className="play-hint">
      <span>↔&nbsp; Drag to move</span>
      <span className="sep">·</span>
      <span>⤓&nbsp; Tap a column to drop</span>
    </div>
  );
}

/* ── Auth header (logo + title), shared by every auth screen ── */
function AuthHead({ title }) {
  return (
    <div className="auth-top">
      <div className="auth-logo-row"><Logo s={34} /></div>
      <div className="card-title auth-title">{title}</div>
    </div>
  );
}

/* ── Canonical mid-game board (DropInGame's default) ── */
const G_DEFAULT = [
  [null, null, null, null, null, null],
  [null, null, null, null, null, null],
  [null, null, null, null, null, null],
  [null, null, null, null, null, null],
  [null, 'D', null, null, null, 'S'],
  ['T', 'L', null, null, 'I', 'A'],
  ['A', 'I', 'O', 'R', 'H', 'N'],
  ['R', 'S', 'A', 'T', 'M', 'P'],
];

/* ── Queue tile, HOLD slot, vertical NEXT, quit (in-game v2 chrome) ── */
function QTile({ L, size, dim = 1 }) {
  return <div className="ig-qtile" style={{ ...tileVars(L), width: size, height: Math.round(size * 1.14), fontSize: Math.round(size * 0.5), opacity: dim }}>{L}</div>;
}
function HoldSlot({ L = null }) {
  return (
    <div className="ig-panel">
      <span className="ig-lab">Hold</span>
      {L ? <div className="ig-holdslot"><div className="ig-qtile" style={tileVars(L)}>{L}</div></div>
         : <div className="ig-holdslot empty"></div>}
    </div>
  );
}
/* vertical NEXT — next-up tile biggest, tapering down toward later tiles */
function VNext({ items, sizes = [34, 32, 30, 28, 26, 24] }) {
  return (
    <div className="ig-panel">
      <span className="ig-lab">Next</span>
      <div className="ig-vtrack">
        {items.map((L, i) => <QTile key={i} L={L} size={sizes[i] || 24} dim={1 - i * 0.07} />)}
      </div>
    </div>
  );
}
function QuitBtn() {
  return (
    <button className="ig-quit" aria-label="Quit game">
      <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
        <path d="M3.5 3.5 L12.5 12.5 M12.5 3.5 L3.5 12.5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      </svg>
    </button>
  );
}

/* ── In-game screen frame — the shell most gameplay screens build on ──
   HOLD + assists on a left rail, NEXT queue on a right rail, the well
   centred between them (a tall narrow 12-row well), stats hugging the
   board's bottom edge, logo + quit in the top bar. */
const IG_ROWS = 12;
const IG_NEXT_PAD = ['S', 'A', 'N', 'E', 'T', 'R'];
function DropInGame({
  jumbles = 3, swaps = 2, grid = G_DEFAULT, active = { r: 1, c: 3, L: 'E' }, ghost = { r: 5, c: 3 },
  matched = [], clearCls = '', shuffling = false, rocking = false, swapping = false,
  next = ['L', 'E', 'C', 'D', 'I', 'R'], hold = 'K',
  score = '1,240', words = '18', best = '3,910', scoreGlow = false, overlay = null,
}) {
  // Pad the well up to a tall 12 rows (empty rows prepended) so it reads as a
  // narrow falling well beside the rails; shift live-tile coords to match.
  const padN = Math.max(0, IG_ROWS - grid.length);
  const padGrid = padN ? [...Array.from({ length: padN }, () => Array(6).fill(null)), ...grid] : grid;
  const shiftCell = (cell) => (cell ? { ...cell, r: cell.r + padN } : cell);
  const padMatched = matched.map(([r, c]) => [r + padN, c]);
  const queue = [...next, ...IG_NEXT_PAD].slice(0, 6);
  return (
    <div className="pscreen ig">
      <div className="ptop">
        <div className="plogo"><Logo s={36} /></div>
        <div className="icons"><QuitBtn /></div>
      </div>
      <div className="ig-stage">
        <div className="ig-railL">
          <HoldSlot L={hold} />
          <div className="ig-railctrls">
            <AssistBtn label="Jumble" depleted={jumbles === 0} badge={jumbles === 0 ? '▶' : jumbles} badgeAd={jumbles === 0}><JumbleIcon /></AssistBtn>
            <AssistBtn label="Swap" variant="swap" depleted={swaps === 0} badge={swaps === 0 ? '▶' : swaps} badgeAd={swaps === 0}><SwapIcon /></AssistBtn>
            <AssistBtn label="Pause" variant="pause"><PauseIcon /></AssistBtn>
          </div>
        </div>
        <div className="ig-boardcol">
          <DropBoard fit grid={padGrid} active={shiftCell(active)} ghostCell={shiftCell(ghost)} matched={padMatched} clearCls={clearCls} shuffling={shuffling} rocking={rocking} swapping={swapping} />
          <DStats score={score} words={words} best={best} scoreGlow={scoreGlow} />
        </div>
        <div className="ig-railR">
          <VNext items={queue} />
        </div>
      </div>
      <PlayHint />
      {overlay}
    </div>
  );
}

/* ── Share everything the screens file consumes ── */
Object.assign(window, {
  FV_VALUES, FV_PAL, tileVars,
  Logo, DropTile, MiniTile, DropBoard,
  JumbleIcon, PauseIcon, SwapIcon, AssistBtn,
  Btn, Modal, AuthHead,
  DTopBar, DStats, PlayStrip, PlayHint, DropInGame,
  QTile, HoldSlot, VNext, QuitBtn,
});
