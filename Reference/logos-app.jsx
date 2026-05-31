/* LettrDrop — logo / wordmark exploration canvas. */
const { DesignCanvas, DCSection, DCArtboard } = window;

const PAL = {
  pink:   { c: '#ff6f91', cl: '#ffd2dd', cd: '#d44e6e' },
  orange: { c: '#ff924c', cl: '#ffd9bf', cd: '#d96b2c' },
  yellow: { c: '#ffc83d', cl: '#fff0c2', cd: '#e0a212' },
  blue:   { c: '#4cc4ff', cl: '#c8ecff', cd: '#1f97d6' },
  purple: { c: '#9b8cff', cl: '#ddd6ff', cd: '#6f5de0' },
  teal:   { c: '#2fd6ad', cl: '#b8f5e6', cd: '#14a883' },
};
const T = (k) => ({ '--c': PAL[k].c, '--cl': PAL[k].cl, '--cd': PAL[k].cd });

const Card = ({ cap, dark, children }) => (
  <div className={`logo-card${dark ? ' dark' : ''}`}>
    {children}
    {cap && <div className="cap">{cap}</div>}
  </div>
);

/* A · Classic two-tone (current) */
const Classic = () => (
  <Card cap="Current · Baloo two-tone">
    <div className="wm wm-classic"><span className="ink">Lettr</span><span className="pop">Drop</span></div>
  </Card>
);

/* B · "Lettr" + DROP candy tiles */
const TileMark = () => {
  const tiles = [['D', 'pink', 0], ['R', 'orange', 0], ['O', 'teal', 0], ['P', 'purple', -15]];
  return (
    <Card cap="Game tiles spell DROP">
      <div className="wm-tiles">
        <span className="pre ink">Lettr</span>
        <div className="tilerow">
          {tiles.map(([L, k, dy], i) => <span key={i} className="ltile" style={{ ...T(k), transform: `translateY(${dy}px)` }}><span className="gl">{L}</span></span>)}
        </div>
      </div>
    </Card>
  );
};

/* C · Falling / staggered letters */
const Falling = () => {
  const word = [['L', 'ink', -18], ['e', 'ink', 6], ['t', 'ink', -8], ['t', 'ink', 10], ['r', 'ink', -4],
                ['D', 'pop', 14], ['r', 'pop', -10], ['o', 'pop', 8], ['p', 'pop', 18]];
  return (
    <Card cap="Letters mid-drop">
      <div className="wm-fall">
        {word.map(([L, c, dy], i) => <span key={i} className={c} style={{ transform: `translateY(${dy}px)` }}>{L}</span>)}
      </div>
    </Card>
  );
};

/* D · Droplet "o" */
const Droplet = () => (
  <Card cap="The drop, literally">
    <div className="wm-drop">
      <span className="ink">LettrDr</span>
      <span className="droplet"></span>
      <span className="ink">p</span>
    </div>
  </Card>
);

/* D2 · L + D as two game blocks (monogram mark) */
const LDBlocks = () => (
  <Card cap="L + D as two game blocks">
    <div className="ld-blocks">
      <span className="ltile" style={{ ...T('teal'), transform: 'rotate(-5deg)' }}><span className="gl">L</span></span>
      <span className="ltile" style={{ ...T('pink'), transform: 'rotate(5deg)' }}><span className="gl">D</span></span>
    </div>
  </Card>
);

/* E · Alternate typeface */
const Fredoka = () => (
  <Card cap="Alt face · Fredoka rounded">
    <div className="wm-fredoka"><span className="ink">Lettr</span><span className="pop">Drop</span></div>
  </Card>
);

/* F · Sticker badge */
const Badge = () => (
  <Card cap="Sticker / app-store badge">
    <div className="wm-badge"><span className="ink">Lettr</span><span className="pop">Drop</span></div>
  </Card>
);

/* G · Stacked lockup */
const Stacked = () => (
  <Card cap="Stacked lockup">
    <div className="wm-stack">
      <span className="l1 ink">LETTR</span>
      <span className="l2 pop">Drop</span>
    </div>
  </Card>
);

/* H · On dark */
const OnDark = () => (
  <Card cap="On dark" dark>
    <div className="wm wm-classic"><span className="ink">Lettr</span><span className="pop">Drop</span></div>
  </Card>
);

/* ── App icons ── */
const IconMono = () => (
  <Card cap="Monogram">
    <div className="icon-tile" style={T('pink')}><span className="mono">LD</span></div>
    <div className="icon-name ink">LettrDrop</div>
  </Card>
);
const IconDrop = () => (
  <Card cap="Falling L">
    <div className="icon-stack">
      <div className="icon-tile" style={{ ...T('purple'), width: 110, height: 110 }}><span className="single">L</span></div>
      <div className="ghost-slot" style={{ width: 110 }}></div>
    </div>
    <div className="icon-name ink">LettrDrop</div>
  </Card>
);
const IconDroplet = () => (
  <Card cap="Droplet mark">
    <div className="icon-tile" style={T('teal')}>
      <span className="droplet" style={{ width: 64, height: 64, background: 'linear-gradient(160deg,#fff,#d6fff0 60%)', boxShadow: 'inset 0 3px 0 rgba(255,255,255,.8), 0 5px 9px rgba(0,0,0,.18)' }}></span>
    </div>
    <div className="icon-name ink">LettrDrop</div>
  </Card>
);

const IconBlocks = () => (
  <Card cap="L + D blocks">
    <div className="ld-blocks" style={{ gap: 9 }}>
      <span className="ltile" style={{ ...T('teal'), width: 92, height: 104, fontSize: 60, borderRadius: 24, transform: 'rotate(-5deg)' }}><span className="gl">L</span></span>
      <span className="ltile" style={{ ...T('pink'), width: 92, height: 104, fontSize: 60, borderRadius: 24, transform: 'rotate(5deg)' }}><span className="gl">D</span></span>
    </div>
    <div className="icon-name ink">LettrDrop</div>
  </Card>
);

function LogoApp() {
  return (
    <DesignCanvas>
      <DCSection
        id="wordmarks"
        title="LettrDrop · wordmark directions"
        subtitle="A handful of takes on the name, each shown on the candy mint so they read in context. The two-tone (green LETTR / pink DROP) split carries through most of them — that's the throughline. Tell me which to push further."
      >
        <DCArtboard id="wm-classic" label="A · Classic (current)" width={520} height={260}><Classic /></DCArtboard>
        <DCArtboard id="wm-tiles" label="B · DROP as game tiles" width={520} height={260}><TileMark /></DCArtboard>
        <DCArtboard id="wm-fall" label="C · Falling letters" width={520} height={260}><Falling /></DCArtboard>
        <DCArtboard id="wm-drop" label="D · Droplet 'o'" width={520} height={260}><Droplet /></DCArtboard>
        <DCArtboard id="wm-ldblocks" label="D2 · L + D game blocks" width={520} height={260}><LDBlocks /></DCArtboard>
        <DCArtboard id="wm-fredoka" label="E · Fredoka rounded" width={520} height={260}><Fredoka /></DCArtboard>
        <DCArtboard id="wm-badge" label="F · Sticker badge" width={520} height={260}><Badge /></DCArtboard>
        <DCArtboard id="wm-stack" label="G · Stacked lockup" width={520} height={260}><Stacked /></DCArtboard>
        <DCArtboard id="wm-dark" label="H · On dark" width={520} height={260}><OnDark /></DCArtboard>
      </DCSection>

      <DCSection
        id="icons"
        title="App icon / monogram"
        subtitle="How the mark compresses into a home-screen tile. Each is a candy game-tile so the icon ties straight back to the board."
      >
        <DCArtboard id="ic-mono" label="LD monogram" width={300} height={320}><IconMono /></DCArtboard>
        <DCArtboard id="ic-blocks" label="L + D blocks" width={300} height={320}><IconBlocks /></DCArtboard>
        <DCArtboard id="ic-drop" label="Falling L + slot" width={300} height={320}><IconDrop /></DCArtboard>
        <DCArtboard id="ic-droplet" label="Droplet" width={300} height={320}><IconDroplet /></DCArtboard>
      </DCSection>
    </DesignCanvas>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<LogoApp />);
