const DROP_TILES = [
  { L: 'D', c: '#ff6f91', cl: '#ffd2dd', cd: '#d44e6e', up: false },
  { L: 'R', c: '#ff924c', cl: '#ffd9bf', cd: '#d96b2c', up: false },
  { L: 'O', c: '#2fd6ad', cl: '#b8f5e6', cd: '#14a883', up: false },
  { L: 'P', c: '#9b8cff', cl: '#ddd6ff', cd: '#6f5de0', up: true },
];

export default function Logo({ s = 26 }) {
  const tw = s * 0.9;
  const th = s;
  const tf = s * 0.55;
  const gap = Math.max(2, s * 0.06);
  const pr = -(s * 0.27);
  const edge = Math.max(2, s * 0.1);

  return (
    <div className="tlogo" style={{ gap: s * 0.2 }}>
      <span
        className="pre"
        style={{
          fontSize: s,
          letterSpacing: -s * 0.03,
          transform: `translateY(${s * 0.23}px)`,
        }}
      >
        Lettr
      </span>
      <div className="row" style={{ gap }}>
        {DROP_TILES.map(({ L, c, cl, cd, up }, i) => (
          <span
            key={i}
            className="tlogo-tile"
            style={{
              width: tw,
              height: th,
              fontSize: tf,
              borderRadius: s * 0.27,
              '--c': c,
              '--cl': cl,
              '--cd': cd,
              boxShadow: `inset 0 ${s * 0.05}px 0 rgba(255,255,255,.7), inset 0 ${-s * 0.11}px ${s * 0.16}px rgba(0,0,0,.16), 0 ${edge}px 0 ${cd}, 0 ${edge * 1.6}px ${edge * 2}px rgba(40,30,60,.2)`,
              transform: up ? `translateY(${pr}px)` : 'none',
            }}
          >
            <span className="gl">{L}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
