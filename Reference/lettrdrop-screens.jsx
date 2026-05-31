/* ══════════════════════════════════════════════════════════════
   LettrDrop — feature mockup screens (candy)
   Screen compositions + looping demos + the first-run tutorial.
   Consumes the design system from lettrdrop-components.jsx (loaded
   first) and exports each screen to window for lettrdrop-app.jsx.
   ══════════════════════════════════════════════════════════════ */

const { Logo, DropTile, DropInGame, SwapIcon, Btn, Modal, AuthHead } = window;

/* ── Mid-game board snapshots (screen-specific) ── */
const G_FORMING = [
  [null, null, null, null, null, null],
  [null, null, null, null, null, null],
  [null, null, null, null, null, null],
  [null, null, null, null, null, null],
  [null, null, null, null, null, null],
  [null, null, null, null, null, 'U'],
  ['S', 'T', 'A', 'R', null, 'L'],
  ['H', 'O', 'N', 'D', 'K', 'G'],
];
const G_DANGER = [
  [null, null, null, null, null, null],
  ['B', 'E', 'A', 'D', 'O', 'T'],
  ['R', 'I', 'S', 'L', 'U', 'A'],
  ['T', 'O', 'N', 'E', 'C', 'R'],
  ['A', 'S', 'T', 'I', 'L', 'E'],
  ['M', 'P', 'A', 'R', 'N', 'O'],
  ['E', 'A', 'I', 'S', 'T', 'D'],
  ['R', 'N', 'O', 'T', 'E', 'L'],
];
/* freshly jumbled: every letter redistributed into random columns (heights not preserved) */
const G_JUMBLED = [
  [null, null, null, null, null, null],
  [null, null, null, null, null, null],
  [null, null, null, null, 'M', null],
  [null, 'I', null, null, 'S', null],
  [null, 'R', null, 'C', 'R', null],
  [null, 'O', null, 'U', 'E', 'I'],
  ['A', 'T', null, 'D', 'A', 'H'],
  ['E', 'S', 'N', 'L', 'T', 'P'],
];

/* ── In-game ── */
/* A · default */
window.IGDefault = () => <DropInGame />;
/* B · word forming (active tile completing STARE) */
window.IGForming = () => (
  <DropInGame
    grid={G_FORMING} active={{ r: 2, c: 4, L: 'E' }} ghost={{ r: 6, c: 4 }}
    matched={[[6, 0], [6, 1], [6, 2], [6, 3]]} next={['T', 'I', 'O']} words="11"
  />
);
/* C · danger (stack near top — letters rocking) */
window.IGDanger = () => (
  <DropInGame
    grid={G_DANGER} active={{ r: 0, c: 2, L: 'N' }} ghost={null} rocking={true}
    next={['Z', 'E', 'A']} score="2,860" words="31"
  />
);

/* ── Paused overlay ── */
window.Paused = () => (
  <DropInGame
    active={null} ghost={null} score="1,240" words="18"
    overlay={
      <Modal>
        <div className="pause-badge">
          <svg width="30" height="30" viewBox="0 0 24 24" aria-hidden="true">
            <rect x="5.5" y="4" width="5" height="16" rx="2.5" fill="#1f97d6" />
            <rect x="13.5" y="4" width="5" height="16" rx="2.5" fill="#1f97d6" />
          </svg>
        </div>
        <div className="card-title">Paused</div>
        <div className="card-sub">Score <b style={{ color: '#1f6f57' }}>1,240</b> &nbsp;·&nbsp; 18 words</div>
        <Btn variant="primary" wide lg>▶ &nbsp;Resume</Btn>
        <Btn variant="ghost" wide>↺ &nbsp;Restart</Btn>
        <div className="skiplink" style={{ color: '#c98a9a' }}>Quit to Home</div>
      </Modal>
    }
  />
);

/* ── Jumble assist states ── */
window.JumbleDefault = () => <DropInGame jumbles={3} next={['F', 'A', 'E']} score="980" words="9" />;
window.JumbleActive = () => (
  <DropInGame
    grid={G_JUMBLED} jumbles={2} active={null} ghost={null} shuffling={true} next={['F', 'A', 'E']} score="980" words="9"
    overlay={<div className="jumble-flash"><div className="jb">🔀 Jumbling!</div></div>}
  />
);
window.JumbleSpent = () => (
  <DropInGame
    jumbles={0} next={['W', 'O', 'R']} score="1,540" words="16"
    overlay={
      <Modal>
        <div style={{ fontSize: 44 }}>🔀</div>
        <div className="card-title">Out of jumbles!</div>
        <div className="card-sub">You've used all three this game. Watch a quick ad to scramble the stack one more time?</div>
        <Btn variant="primary" wide lg>▶ &nbsp;Watch ad for +1 jumble</Btn>
        <div className="skiplink">No thanks</div>
      </Modal>
    }
  />
);

/* ── Swap: trade the live falling tile for a new random letter ── */
/* A · two swaps ready (live tile is an awkward Q — motivates the swap) */
window.SwapReady = () => (
  <DropInGame
    swaps={2} jumbles={3} active={{ r: 1, c: 3, L: 'Q' }} ghost={{ r: 5, c: 3 }} next={['U', 'A', 'E']}
    overlay={
      <div className="swap-coach">
        Stuck with a <b>Q</b>? <b>Swap</b> trades the falling tile for a fresh random letter — <b>2 free</b> every game.
      </div>
    }
  />
);
/* B · the swap in motion — the live tile flips and morphs, badge counts down (loops) */
function SwapDemo() {
  const steps = [
    { letter: 'Q', swaps: 2, swapping: false, flash: false, dwell: 1150 },
    { letter: 'Q', swaps: 2, swapping: true,  flash: true,  dwell: 250 },
    { letter: 'E', swaps: 1, swapping: true,  flash: true,  dwell: 320 },
    { letter: 'E', swaps: 1, swapping: false, flash: false, dwell: 1150 },
    { letter: 'J', swaps: 1, swapping: true,  flash: true,  dwell: 250 },
    { letter: 'A', swaps: 0, swapping: true,  flash: true,  dwell: 320 },
    { letter: 'A', swaps: 0, swapping: false, flash: false, dwell: 1600 },
  ];
  const [s, setS] = React.useState(0);
  React.useEffect(() => {
    const t = setTimeout(() => setS((s + 1) % steps.length), steps[s].dwell);
    return () => clearTimeout(t);
  }, [s]);
  const st = steps[s];
  return (
    <DropInGame
      swaps={st.swaps} jumbles={3} active={{ r: 1, c: 3, L: st.letter }} ghost={{ r: 5, c: 3 }}
      swapping={st.swapping} next={['U', 'A', 'E']}
      overlay={st.flash ? <div className="swap-flash"><div className="sb"><SwapIcon /> Swap!</div></div> : null}
    />
  );
}
window.SwapDemo = SwapDemo;
/* C · both swaps spent → rewarded ad for +1 (mirrors out-of-jumbles) */
window.SwapSpent = () => (
  <DropInGame
    swaps={0} jumbles={2} active={{ r: 1, c: 3, L: 'Z' }} ghost={{ r: 5, c: 3 }} next={['Q', 'I', 'O']} score="1,540" words="16"
    overlay={
      <Modal>
        <div style={{ fontSize: 42 }}>🔁</div>
        <div className="card-title">Out of swaps!</div>
        <div className="card-sub">You've used both free swaps this game. Watch a quick ad to swap the falling tile one more time?</div>
        <Btn variant="primary" wide lg>▶ &nbsp;Watch ad for +1 swap</Btn>
        <div className="skiplink">No thanks</div>
      </Modal>
    }
  />
);

/* ── Word-cleared animation (looping demo) ── */
const DEMO_BEFORE = [
  [null, null, 'M', null, null],
  [null, 'B', 'A', null, null],
  [null, 'R', 'E', 'K', null],
  ['S', 'T', 'A', 'R', 'E'],
];
const DEMO_AFTER = [
  [null, null, null, null, null],
  [null, null, 'M', null, null],
  [null, 'B', 'A', null, null],
  [null, 'R', 'E', 'K', null],
];
const DEMO_MATCH = [[3, 0], [3, 1], [3, 2], [3, 3], [3, 4]];
const DEMO_GRAV = [[1, 2], [2, 1], [2, 2], [3, 1], [3, 2], [3, 3]];
const inList = (list, r, c) => list.some(([a, b]) => a === r && b === c);

function ClearDemo({ variant, label, desc }) {
  const [phase, setPhase] = React.useState('idle');
  React.useEffect(() => {
    const seq = ['idle', 'match', 'clear', 'drop'];
    const durs = { idle: 850, match: 600, clear: 440, drop: 560 };
    let i = 0, t;
    const step = () => { const ph = seq[i]; setPhase(ph); t = setTimeout(() => { i = (i + 1) % seq.length; step(); }, durs[ph]); };
    step();
    return () => clearTimeout(t);
  }, []);

  const showAfter = phase === 'drop';
  const grid = showAfter ? DEMO_AFTER : DEMO_BEFORE;
  const sparks = [];
  if (variant === 'pop' && phase === 'clear') {
    const cols = ['#ff6f91', '#4cc4ff', '#ffc83d', '#2fd6ad', '#9b8cff', '#ff924c'];
    for (let i = 0; i < 14; i++) {
      const ang = (i / 14) * Math.PI * 2;
      sparks.push({
        left: (12 + (i * 6.1) % 76) + '%', top: '74%',
        sx: Math.cos(ang) * (40 + (i % 3) * 16) + 'px',
        sy: (Math.sin(ang) * 36 - 30) + 'px', c: cols[i % cols.length], round: i % 2 === 0,
      });
    }
  }

  return (
    <div className="pscreen" style={{ justifyContent: 'center', alignItems: 'center', gap: 20 }}>
      <div className="demo-cap" style={{ maxWidth: 290 }}><b>{label}</b><br />{desc}</div>
      <div className="dboard" style={{ position: 'relative', gridTemplateColumns: 'repeat(5, 60px)', flex: '0 0 auto' }}>
        {grid.map((row, r) => row.map((L, c) => {
          if (L == null) return <div key={`${r}-${c}`} className="cell"></div>;
          let cls = '';
          if (!showAfter && inList(DEMO_MATCH, r, c)) {
            if (phase === 'match') cls = 'matched';
            else if (phase === 'clear') cls = `matched ${variant}`;
          }
          if (showAfter && inList(DEMO_GRAV, r, c)) cls = 'gravity';
          return <DropTile key={`${r}-${c}`} L={L} cls={cls} drop={cls.includes('gravity') ? -66 : null} />;
        }))}
        {sparks.map((s, i) => (
          <span key={i} className="spark go" style={{ left: s.left, top: s.top, background: s.c, borderRadius: s.round ? '50%' : '2px', '--sx': s.sx, '--sy': s.sy }}></span>
        ))}
        {(phase === 'clear' || phase === 'drop') && (
          <div className="score-float">+5</div>
        )}
      </div>
    </div>
  );
}
window.ClearPop = () => <ClearDemo variant="pop" label="A · Pop & sparkle" desc="Tiles scale up and burst into confetti, then the stack drops in." />;

/* ── Pending clear · the longest-word grace window (looping demo) ──
   Spell STAR and it doesn't vanish instantly — it THROBS for ~1.5s ("I see it,
   holding") so you can grow it. Drop an E → STARE, the timer resets, and only the
   longest version clears. The throb tells the player we didn't forget. */
function PendingClearDemo() {
  const [phase, setPhase] = React.useState('idle'); // idle → detect → extend → clear → gap
  React.useEffect(() => {
    const seq = ['idle', 'detect', 'extend', 'clear', 'gap'];
    const durs = { idle: 950, detect: 1500, extend: 1500, clear: 620, gap: 750 };
    let i = 0, t;
    const step = () => { const ph = seq[i]; setPhase(ph); t = setTimeout(() => { i = (i + 1) % seq.length; step(); }, durs[ph]); };
    step();
    return () => clearTimeout(t);
  }, []);

  const eLanded = phase === 'extend' || phase === 'clear';
  const clearing = phase === 'clear';
  // STAR occupies r1 c0..c3; the E lands into r1 c4 to make STARE.
  const starCells = [[1, 0], [1, 1], [1, 2], [1, 3]];
  const stareCells = [...starCells, [1, 4]];
  const pendingCells = phase === 'detect' ? starCells : (phase === 'extend' ? stareCells : []);
  const isPending = (r, c) => pendingCells.some(([a, b]) => a === r && b === c);
  const isClearing = (r, c) => clearing && stareCells.some(([a, b]) => a === r && b === c);

  const board = [
    [null, null, null, null, eLanded ? null : 'E'], // E waits up top, then drops into the row
    ['S', 'T', 'A', 'R', eLanded ? 'E' : null],
  ];

  const sparks = [];
  if (clearing) {
    const cols = ['#ff6f91', '#4cc4ff', '#ffc83d', '#2fd6ad', '#9b8cff', '#ff924c'];
    for (let i = 0; i < 14; i++) {
      const ang = (i / 14) * Math.PI * 2;
      sparks.push({
        left: (12 + (i * 6.1) % 76) + '%', top: '74%',
        sx: Math.cos(ang) * (40 + (i % 3) * 16) + 'px',
        sy: (Math.sin(ang) * 36 - 30) + 'px', c: cols[i % cols.length], round: i % 2 === 0,
      });
    }
  }

  const cap = {
    idle: <><b>STAR</b> just landed — a valid word.</>,
    detect: <>Instead of vanishing, it <b>throbs ~1.5s</b> — &ldquo;I see it, hold on.&rdquo;</>,
    extend: <>An <b>E</b> drops in → <b>STARE</b>. Timer <b>resets</b>; the longer word wins.</>,
    clear: <>Nothing else extends it → clear the <b>longest</b> version. <b>+5</b></>,
    gap: <>&nbsp;</>,
  }[phase];

  return (
    <div className="pscreen" style={{ justifyContent: 'center', alignItems: 'center', gap: 20 }}>
      <div className="demo-cap" style={{ maxWidth: 300 }}><b>Pending clear · grace window</b><br />{cap}</div>
      <div className="dboard" style={{ position: 'relative', gridTemplateColumns: 'repeat(5, 60px)', flex: '0 0 auto' }}>
        {board.map((row, r) => row.map((L, c) => {
          if (L == null) return <div key={`${r}-${c}`} className="cell"></div>;
          let cls = ''; let delay = null; let drop = null;
          if (isClearing(r, c)) { cls = 'matched pop'; }
          else if (isPending(r, c)) { cls = 'pending'; delay = c * 90; }
          // the E falling into place on extend
          if (phase === 'extend' && r === 1 && c === 4) { drop = -60; cls = 'gravity pending'; delay = 4 * 90; }
          return <DropTile key={`${r}-${c}`} L={L} cls={cls} delay={delay} drop={drop} />;
        }))}
        {sparks.map((s, i) => (
          <span key={i} className="spark go" style={{ left: s.left, top: s.top, background: s.c, borderRadius: s.round ? '50%' : '2px', '--sx': s.sx, '--sy': s.sy }}></span>
        ))}
        {clearing && <div className="score-float">+5</div>}
      </div>
    </div>
  );
}
window.PendingClear = PendingClearDemo;

/* ── Rewarded ad & revive ── */
window.AdOverlay = () => (
  <DropInGame
    jumbles={0} next={['M', 'A', 'E']} score="1,120" words="12"
    overlay={
      <Modal>
        <div className="adlabel">Rewarded Ad</div>
        <div className="adview">
          <div className="adskip">Skip in 5s</div>
          <div className="adbrand">YOUR AD</div>
          <div className="adnote">— 0:05 —</div>
        </div>
        <div className="reward-pill">🎁 Reward: +1 Jumble</div>
        <div className="card-sub">Watch the full video to earn your reward.</div>
      </Modal>
    }
  />
);
window.Revive = () => (
  <DropInGame
    grid={G_DANGER} active={null} ghost={null} jumbles={1} next={['Z', 'E', 'A']} score="2,860" words="31"
    overlay={
      <Modal>
        <div className="card-title" style={{ color: '#ff6f91' }}>Stacked Out!</div>
        <div className="card-sub">Score so far</div>
        <div className="result-score">2,860</div>
        <Btn variant="primary" wide lg>▶ &nbsp;Watch ad to clear 4 rows</Btn>
        <div className="card-sub" style={{ fontSize: 12, marginTop: -4 }}>One revive per game</div>
        <window.RankPeek
          label="Global rank"
          of="#840 of 8,420"
          rows={[
            { rank: '#839', name: 'BrickBard', score: '2,910' },
            { rank: '#840', name: 'You', score: '2,860', me: true },
            { rank: '#841', name: 'SpellSpree', score: '2,820' },
          ]}
        />
        <Btn variant="ghost" wide>▶ &nbsp;Play Again</Btn>
        <Btn variant="ghost" wide>🏠 &nbsp;Home</Btn>
      </Modal>
    }
  />
);

/* ── Game over ── */
/* Compact slice of the global leaderboard centered on the player — shown on both
   game-over faces so the score lands against the competition, not in a vacuum. */
function RankPeek({ label, of, up, rows }) {
  return (
    <div className="rankpeek">
      <div className="rp-head">
        <span className="rp-label">{label}</span>
        <span className="rp-of">{of}{up && <span className="up">↑ {up}</span>}</span>
      </div>
      <div className="rp-list">
        {rows.map((row, i) => (
          <div key={i} className={`rp-row${row.me ? ' me' : ''}`}>
            <span className="rp-rank">{row.rank}</span>
            <span className="rp-name">{row.name}{row.me && <span className="rp-you">YOU</span>}</span>
            <span className="rp-score">{row.score}</span>
          </div>
        ))}
      </div>
      <div className="rp-link">See full leaderboard ›</div>
    </div>
  );
}
window.RankPeek = RankPeek;

window.GameOver = () => (
  <DropInGame
    grid={G_DANGER} active={null} ghost={null} jumbles={0} next={['Z', 'E', 'A']} score="2,180" words="24"
    overlay={
      <Modal>
        <div className="card-title" style={{ color: '#5a9486' }}>Stacked Out</div>
        <div className="card-sub">Final score</div>
        <div className="result-score">2,180</div>
        <div className="card-sub" style={{ marginTop: -2 }}>Best <b style={{ color: '#1f6f57' }}>3,910</b> · 1,730 to go</div>
        <RankPeek
          label="Global rank"
          of="#1,240 of 8,420"
          rows={[
            { rank: '#1,239', name: 'WordWizz', score: '2,205' },
            { rank: '#1,240', name: 'You', score: '2,180', me: true },
            { rank: '#1,241', name: 'Lexi_88', score: '2,150' },
          ]}
        />
        <Btn variant="primary" wide lg>▶ &nbsp;Play Again</Btn>
        <Btn variant="ghost" wide>🏠 &nbsp;Home</Btn>
      </Modal>
    }
  />
);

/* in-game NEW BEST flourish (live, non-blocking) */
window.NewBestMoment = () => {
  const cols = ['#ff6f91', '#4cc4ff', '#ffc83d', '#2fd6ad', '#9b8cff', '#ff924c'];
  const spots = [
    [8, 12], [14, 30], [6, 52], [10, 72], [16, 88], [24, 6], [22, 94], [30, 20], [28, 80], [34, 46],
    [60, 8], [64, 92], [70, 22], [68, 78], [74, 50], [80, 12], [82, 88], [88, 34], [86, 66], [92, 50],
    [40, 4], [44, 96], [54, 16], [58, 84],
  ];
  const conf = spots.map(([t, l], i) => ({
    top: t + '%', left: l + '%', c: cols[i % cols.length], r: (i * 47) % 360, sz: 9 + (i % 4) * 3, round: i % 3 === 0,
  }));
  return (
    <DropInGame
      jumbles={2} next={['Q', 'U', 'A']} score="3,950" best="3,950" words="38" scoreGlow={true}
      overlay={
        <div className="best-layer">
          {conf.map((k, i) => (
            <span key={i} className="confetti" style={{ top: k.top, left: k.left, width: k.sz, height: k.sz, background: k.c, borderRadius: k.round ? '50%' : '3px', transform: `rotate(${k.r}deg)` }}></span>
          ))}
          <div className="burst"></div>
          <div className="bestglow"></div>
          <div className="bestbanner">
            <div className="bb-top">🎉 NEW BEST! 🎉</div>
            <div className="bb-score">3,950</div>
          </div>
        </div>
      }
    />
  );
};

window.NewHighScore = () => {
  const conf = [
    { top: '12%', left: '14%', c: '#ff6f91', r: -18 }, { top: '18%', left: '82%', c: '#4cc4ff', r: 22 },
    { top: '30%', left: '8%', c: '#ffc83d', r: 12 }, { top: '26%', left: '90%', c: '#2fd6ad', r: -28 },
    { top: '44%', left: '18%', c: '#9b8cff', r: 30 }, { top: '40%', left: '78%', c: '#ff924c', r: -12 },
    { top: '58%', left: '10%', c: '#2fd6ad', r: 16 }, { top: '62%', left: '88%', c: '#ff6f91', r: -22 },
    { top: '8%', left: '50%', c: '#ffc83d', r: 8 }, { top: '72%', left: '30%', c: '#4cc4ff', r: -16 },
    { top: '70%', left: '66%', c: '#9b8cff', r: 24 },
  ];
  return (
    <div className="pscreen celebrate">
      {conf.map((k, i) => <span key={i} className="confetti" style={{ top: k.top, left: k.left, background: k.c, transform: `rotate(${k.r}deg)` }}></span>)}
      <div className="tada-emoji">🎉</div>
      <div className="nhs-banner">New High Score!</div>
      <div className="nhs-score">4,180</div>
      <div className="nhs-prev">Previous best <s>3,910</s> · +270</div>
      <div style={{ width: '100%', maxWidth: 320 }}>
        <RankPeek
          label="You climbed to"
          of="#3"
          up="9"
          rows={[
            { rank: '#2', name: 'QuibbleQueen', score: '4,520' },
            { rank: '#3', name: 'You', score: '4,180', me: true },
            { rank: '#4', name: 'StackKing', score: '3,990' },
          ]}
        />
      </div>
      <div className="nhs-actions">
        <Btn variant="primary" wide lg>▶ &nbsp;Play Again</Btn>
        <Btn variant="ghost" wide lg>📤 &nbsp;Share</Btn>
      </div>
    </div>
  );
};

/* ── Auth (identifier-first) ── */
window.AuthEntry = () => (
  <div className="pscreen auth">
    <AuthHead title="Log in or sign up" />
    <button className="authbtn apple">&#63743;&nbsp; Continue with Apple</button>
    <button className="authbtn google"><span className="gl" style={{ color: '#4285F4' }}>G</span>&nbsp; Continue with Google</button>
    <button className="authbtn facebook"><span className="gl">f</span>&nbsp; Continue with Facebook</button>
    <div className="divider">or</div>
    <input className="field" placeholder="you@email.com" />
    <button className="authbtn email">Continue</button>
    <div className="helper">We'll check if you already have an account.</div>
  </div>
);
window.AuthPassword = () => (
  <div className="pscreen auth">
    <AuthHead title="Welcome back 👋" />
    <div className="email-chip"><span className="em">jordan@email.com</span><a>Change</a></div>
    <input className="field" type="password" placeholder="Password" />
    <button className="authbtn email">Log in</button>
    <div className="forgot">Forgot password?</div>
  </div>
);
window.AuthCreate = () => (
  <div className="pscreen auth">
    <AuthHead title="Create your account" />
    <div className="email-chip"><span className="em">newplayer@email.com</span><a>Change</a></div>
    <input className="field" placeholder="Display name (e.g. Jordan S.)" />
    <input className="field" type="password" placeholder="Create a password" />
    <button className="authbtn email">Create account</button>
    <div className="helper">No account for that email yet — let's set one up.</div>
  </div>
);
window.AuthSocialName = () => (
  <div className="pscreen auth">
    <AuthHead title="Pick a display name" />
    <div className="card-sub" style={{ maxWidth: 270 }}>Apple didn't share a name — choose one to finish. You can edit it later.</div>
    <input className="field" defaultValue="Jordan" />
    <div className="avail ok">✓ &nbsp;That name is available</div>
    <button className="authbtn email">Continue</button>
    <div className="helper">Display names must be unique. &nbsp;·&nbsp; Signed in with Apple</div>
  </div>
);

window.Profile = ({ premium = false }) => (
  <div className="pscreen profile">
    <div className="ptop" style={{ width: '100%' }}>
      <div className="skiplink">‹ Back</div>
      <div className="plogo"><Logo s={17} /></div>
    </div>
    <div className="profile-head">
      <div className={`bigavatar ${premium ? 'prem' : ''}`}>JS{premium && <span className="crown">👑</span>}</div>
      <div className="pname">Jordan S.</div>
      <div className="pemail">jordan@email.com</div>
    </div>
    <div className="pcard">
      <div className="row"><span className="k">Display name</span><span className="editlink">Edit</span></div>
      <div className="v" style={{ fontSize: 18 }}>Jordan S.</div>
      <div className="note">Must be unique — this is how you appear on the leaderboard.</div>
    </div>
    <div className="pcard"><div className="row"><span className="k">Best Score</span><span className="v">3,910</span></div></div>
    <div className="pcard"><div className="row"><span className="k">Most Words / Game</span><span className="v">142</span></div></div>
    {premium
      ? <div className="adfree-banner">👑 &nbsp;LettrDrop Premium active — ad-free &amp; unlimited jumbles</div>
      : (
        <div className="premcard">
          <div className="prem-head"><span className="prem-crown">👑</span><span className="prem-title">Go Premium</span></div>
          <div className="perk" style={{ color: '#7a4a00' }}>No ads · Unlimited jumbles · $5 one-time</div>
          <Btn variant="gold" wide style={{ background: '#fff', color: '#b07b00', boxShadow: '0 5px 0 #e6c97a' }}>Upgrade</Btn>
        </div>
      )}
    <div className="skiplink" style={{ marginTop: 'auto', color: '#c98a9a' }}>Sign out</div>
  </div>
);

window.Paywall = () => (
  <div className="pscreen auth" style={{ justifyContent: 'flex-start', gap: 14, paddingTop: 24 }}>
    <div className="ptop" style={{ width: '100%' }}>
      <div className="skiplink">✕</div>
      <div className="adlabel" style={{ fontSize: 11 }}>Restore</div>
    </div>
    <div className="paywall-hero">
      <div style={{ fontSize: 46 }}>👑</div>
      <div className="paywall-title"><Logo s={22} /><span style={{ color: '#1f6f57' }}>Premium</span></div>
    </div>
    <div className="premcard">
      <div className="perks">
        <div className="perk"><span className="pdot">🚫</span> No ads, ever</div>
        <div className="perk"><span className="pdot">🔀</span> Unlimited jumbles</div>
      </div>
    </div>
    <div className="oneprice"><b>$5</b> &nbsp;one-time</div>
    <Btn variant="gold" wide lg>Unlock Premium</Btn>
    <div className="fineprint" style={{ textAlign: 'center' }}>One-time purchase — yours forever. No subscription.</div>
  </div>
);

window.Home = ({ premium = false }) => (
  <div className="pscreen home">
    <div className="home-top">
      <div style={{ width: 40 }}></div>
      <div className="assist">
        {premium ? <div className="avatar prem">JS<span className="crown">👑</span></div> : <div className="avatar">JS</div>}
      </div>
    </div>
    <div className="home-hero">
      <Logo s={40} />
      <div className="welcome" style={{ marginTop: 0 }}>Welcome back, Jordan 👋</div>
    </div>
    <div className="bestchip"><span className="k">Best</span> 3,910</div>
    <div className="menu-btns">
      <Btn variant="primary" wide lg>▶ &nbsp;New Game</Btn>
      <Btn variant="ghost" wide lg>🏆 &nbsp;High Scores</Btn>
      {!premium && <Btn variant="gold" wide lg>👑 &nbsp;Go Premium</Btn>}
    </div>
    {premium && <div className="adfree-banner" style={{ maxWidth: 300 }}>👑 &nbsp;Premium · ad-free &amp; unlimited jumbles</div>}
  </div>
);

window.HighScores = () => {
  const rows = [
    { r: '🥇', s: '3,910', when: 'Today · 142 words', me: true },
    { r: '🥈', s: '3,420', when: 'Yesterday · 128 words' },
    { r: '🥉', s: '2,980', when: 'Mon · 109 words' },
    { r: '4', s: '2,510', when: 'Sun · 96 words' },
    { r: '5', s: '2,205', when: 'Sat · 84 words' },
    { r: '6', s: '1,870', when: 'Fri · 71 words' },
  ];
  return (
    <div className="pscreen" style={{ gap: 14 }}>
      <div className="hs-head">
        <div className="skiplink">‹ Back</div>
        <div className="hs-title">High Scores</div>
        <div style={{ width: 36 }}></div>
      </div>
      <div className="hs-list">
        {rows.map((row, i) => (
          <div key={i} className={`hs-row${row.me ? ' me' : ''}`}>
            <div className={`hs-rank${i < 3 ? ' top' : ''}`}>{row.r}</div>
            <div className="hs-meta">
              {row.me && <span className="hs-tag">YOU</span>}
              <span className="hs-when">{row.when}</span>
            </div>
            <div className="hs-score">{row.s}</div>
          </div>
        ))}
      </div>
      <Btn variant="primary" wide lg style={{ marginTop: 'auto' }}>▶ &nbsp;New Game</Btn>
    </div>
  );
};

/* ── Account management ── */
window.EditName = () => (
  <div className="screen-stack">
    <window.Profile premium={false} />
    <Modal>
      <div className="card-title" style={{ fontSize: 24 }}>Edit display name</div>
      <input className="field" defaultValue="JordanScores" />
      <div className="avail ok">✓ &nbsp;That name is available</div>
      <Btn variant="primary" wide lg>Save</Btn>
      <Btn variant="ghost" wide>Cancel</Btn>
      <div className="note" style={{ textAlign: 'center' }}>Display names must be unique.</div>
    </Modal>
  </div>
);
window.ForgotSent = () => (
  <div className="screen-stack">
    <window.AuthPassword />
    <Modal>
      <div style={{ fontSize: 48 }}>✉️</div>
      <div className="card-title">Check your email</div>
      <div className="card-sub">We sent a password reset link to<br /><b style={{ color: '#1f6f57' }}>jordan@email.com</b></div>
      <Btn variant="primary" wide lg>Open email app</Btn>
      <div className="skiplink">Resend email</div>
    </Modal>
  </div>
);
window.ResetPassword = () => (
  <div className="pscreen auth">
    <AuthHead title="Set a new password" />
    <div className="card-sub" style={{ maxWidth: 250 }}>Resetting the password for <b style={{ color: '#1f6f57' }}>jordan@email.com</b></div>
    <input className="field" type="password" placeholder="New password" />
    <input className="field" type="password" placeholder="Confirm new password" />
    <button className="authbtn email">Reset password</button>
    <div className="helper">Use at least 8 characters.</div>
  </div>
);

/* ════════════════════════════════════════════════════════════════
   First-time tutorial · How to Play
   Shown the first time a new player taps New Game. Each step plays a
   looping mini-animation built from the same tile/clear/swap/shuffle
   pieces the live game uses.
   ════════════════════════════════════════════════════════════════ */

/* Step 1 · spell a word → it pops & the stack drops (reuses the clear demo grids) */
function TutoClear() {
  const [phase, setPhase] = React.useState('idle'); // idle → detect → extend → clear → drop
  React.useEffect(() => {
    const seq = ['idle', 'detect', 'extend', 'clear', 'drop'];
    const durs = { idle: 900, detect: 1300, extend: 1100, clear: 460, drop: 680 };
    let i = 0, t;
    const step = () => { const ph = seq[i]; setPhase(ph); t = setTimeout(() => { i = (i + 1) % seq.length; step(); }, durs[ph]); };
    step();
    return () => clearTimeout(t);
  }, []);
  const showAfter = phase === 'drop';
  const eLanded = phase === 'extend' || phase === 'clear';
  const clearing = phase === 'clear';
  // STAR fills the bottom row c0..c3; the falling E drops into c4 to make STARE.
  const starCells = [[3, 0], [3, 1], [3, 2], [3, 3]];
  const stareCells = [...starCells, [3, 4]];
  const pending = phase === 'detect' ? starCells : (phase === 'extend' ? stareCells : []);
  const isPending = (r, c) => pending.some(([a, b]) => a === r && b === c);
  const isClearing = (r, c) => clearing && stareCells.some(([a, b]) => a === r && b === c);

  const grid = showAfter ? DEMO_AFTER : DEMO_BEFORE;
  const sparks = [];
  if (clearing) {
    const cols = ['#ff6f91', '#4cc4ff', '#ffc83d', '#2fd6ad', '#9b8cff', '#ff924c'];
    for (let i = 0; i < 12; i++) {
      const ang = (i / 12) * Math.PI * 2;
      sparks.push({ left: (14 + (i * 6.4) % 72) + '%', top: '76%', sx: Math.cos(ang) * (32 + (i % 3) * 12) + 'px', sy: (Math.sin(ang) * 28 - 22) + 'px', c: cols[i % cols.length], round: i % 2 === 0 });
    }
  }
  return (
    <div className="dboard tuto-board" style={{ position: 'relative', gridTemplateColumns: 'repeat(5, 42px)' }}>
      {grid.map((row, r) => row.map((L, c) => {
        // the E that completes STARE is held back (still falling) until the extend beat
        if (!showAfter && r === 3 && c === 4 && !eLanded) return <div key={`${r}-${c}`} className="cell"></div>;
        if (L == null) {
          // show that E falling in column 4 above the gap during idle/detect
          if (!showAfter && !eLanded && r === 1 && c === 4) return <DropTile key={`${r}-${c}`} L="E" cls="active" />;
          return <div key={`${r}-${c}`} className="cell"></div>;
        }
        let cls = ''; let delay = null; let drop = null;
        if (isClearing(r, c)) cls = 'matched pop';
        else if (isPending(r, c)) { cls = 'pending'; delay = c * 80; }
        if (phase === 'extend' && r === 3 && c === 4) { cls = 'gravity pending'; drop = -96; delay = 4 * 80; }
        if (showAfter && inList(DEMO_GRAV, r, c)) { cls = 'gravity'; drop = -48; }
        return <DropTile key={`${r}-${c}`} L={L} cls={cls} delay={delay} drop={drop} />;
      }))}
      {sparks.map((s, i) => <span key={i} className="spark go" style={{ left: s.left, top: s.top, background: s.c, borderRadius: s.round ? '50%' : '2px', '--sx': s.sx, '--sy': s.sy }}></span>)}
      {clearing && <div className="score-float" style={{ fontSize: 34 }}>+5</div>}
    </div>
  );
}

/* Step 2 · the live tile flies left↔right, then drops into a column */
const TM_PILE = [
  [null, null, null, null],
  [null, null, null, null],
  [null, null, null, null],
  ['S', 'T', 'O', 'E'],
  ['A', 'R', 'N', 'D'],
];
function TutoMove() {
  return (
    <div className="dboard tuto-board" style={{ position: 'relative', gridTemplateColumns: 'repeat(4, 48px)' }}>
      {TM_PILE.map((row, r) => row.map((L, c) => (
        L == null ? <div key={`${r}-${c}`} className="cell"></div> : <DropTile key={`${r}-${c}`} L={L} />
      )))}
      <span className="tuto-h">⟵&nbsp; drag &nbsp;⟶</span>
      <span className="tuto-v">⤓&nbsp; tap to drop faster</span>
      <div className="tuto-live"><DropTile L="B" cls="active" /></div>
    </div>
  );
}

/* Step 3 · Swap — the falling tile flips into a new letter (loops) */
const TS_PILE = [
  [null, null, null, null],
  [null, null, null, null],
  [null, 'M', 'S', null],
  ['T', 'A', 'R', 'E'],
];
function TutoSwap() {
  const steps = [
    { L: 'Q', sw: false, d: 1150 },
    { L: 'Q', sw: true, d: 260 },
    { L: 'E', sw: true, d: 320 },
    { L: 'E', sw: false, d: 1300 },
  ];
  const [s, setS] = React.useState(0);
  React.useEffect(() => {
    const t = setTimeout(() => setS((s + 1) % steps.length), steps[s].d);
    return () => clearTimeout(t);
  }, [s]);
  const st = steps[s];
  return (
    <div className="dboard tuto-board" style={{ position: 'relative', gridTemplateColumns: 'repeat(4, 48px)' }}>
      {TS_PILE.map((row, r) => row.map((L, c) => {
        if (r === 0 && c === 1) return <DropTile key={`${r}-${c}`} L={st.L} cls={`active${st.sw ? ' swapping' : ''}`} />;
        if (L == null) return <div key={`${r}-${c}`} className="cell"></div>;
        return <DropTile key={`${r}-${c}`} L={L} />;
      }))}
    </div>
  );
}

/* Step 4 · Jumble — the whole stack reshuffles into fresh columns (loops) */
const TJ_A = [
  [null, null, null, null],
  [null, 'M', null, null],
  ['B', 'A', null, 'D'],
  ['R', 'E', 'K', 'S'],
];
const TJ_B = [
  [null, null, null, null],
  [null, null, 'A', null],
  ['E', 'M', 'R', null],
  ['B', 'D', 'K', 'S'],
];
function TutoJumble() {
  const [grid, setGrid] = React.useState(TJ_A);
  const [sh, setSh] = React.useState(false);
  const flip = React.useRef(true);
  React.useEffect(() => {
    let t;
    const cycle = () => {
      t = setTimeout(() => {
        setSh(true);
        t = setTimeout(() => {
          flip.current = !flip.current;
          setGrid(flip.current ? TJ_A : TJ_B);
          t = setTimeout(() => { setSh(false); cycle(); }, 140);
        }, 640);
      }, 1250);
    };
    cycle();
    return () => clearTimeout(t);
  }, []);
  return (
    <div className="dboard tuto-board" style={{ gridTemplateColumns: 'repeat(4, 48px)' }}>
      {grid.map((row, r) => row.map((L, c) => (
        L == null ? <div key={`${r}-${c}`} className="cell"></div> : <DropTile key={`${r}-${c}`} L={L} cls={sh ? 'shuffling' : ''} />
      )))}
    </div>
  );
}

/* Shared tutorial card chrome */
function TutoFrame({ step, total = 4, title, desc, cta, children }) {
  return (
    <div className="pscreen tuto">
      <div className="tuto-head">
        <div className="plogo"><Logo s={17} /></div>
        <div className="skiplink">Skip</div>
      </div>
      <div className="tuto-stage">{children}</div>
      <div className="tuto-cap">
        <div className="tuto-title">{title}</div>
        <div className="tuto-desc">{desc}</div>
      </div>
      <div className="tuto-dots">
        {Array.from({ length: total }).map((_, i) => <span key={i} className={`dot${i === step ? ' on' : ''}`}></span>)}
      </div>
      <Btn variant="primary" wide lg>{cta}</Btn>
    </div>
  );
}

window.TutoWelcome = () => (
  <div className="pscreen tuto cover">
    <div style={{ flex: 1 }}></div>
    <div className="tuto-cover-art"><Logo s={42} /></div>
    <div className="tuto-cap" style={{ marginTop: 18 }}>
      <div className="tuto-title">Welcome! 👋</div>
      <div className="tuto-desc">New here? Here's the 30-second rundown on how to play.</div>
    </div>
    <div style={{ flex: 1 }}></div>
    <Btn variant="primary" wide lg>Show me how ›</Btn>
    <div className="skiplink" style={{ alignSelf: 'center' }}>I've played before — skip</div>
  </div>
);
window.TutoMatch = () => (
  <TutoFrame step={0} title="Spell a word to clear it" cta="Next ›"
    desc="Line up a real word across a row or down a column and it lights up. Add a letter to make it longer for more points — when you can't extend it, it pops.">
    <TutoClear />
  </TutoFrame>
);
window.TutoControl = () => (
  <TutoFrame step={1} title="Steer the falling tile" cta="Next ›"
    desc="The tile falls on its own — drag left or right to line it up, and tap or hold to drop it faster.">
    <TutoMove />
  </TutoFrame>
);
window.TutoSwapHow = () => (
  <TutoFrame step={2} title="Swap a letter you can't place" cta="Next ›"
    desc="Stuck with a tricky Q or Z? Tap Swap to trade the falling tile for a fresh random letter — two free every game.">
    <TutoSwap />
  </TutoFrame>
);
window.TutoJumbleHow = () => (
  <TutoFrame step={3} title="Jumble for a fresh board" cta="Let's play ▶"
    desc="In a jam? Jumble sweeps every landed letter into new columns to open things up. Three per game.">
    <TutoJumble />
  </TutoFrame>
);
