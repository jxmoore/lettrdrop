import { useState, useEffect } from 'react';
import DropTile from './DropTile';

const TS_PILE = [
  [null, null, null, null],
  [null, null, null, null],
  [null, 'M', 'S', null],
  ['T', 'A', 'R', 'E'],
];

const STEPS = [
  { L: 'Q', sw: false, d: 1150 },
  { L: 'Q', sw: true, d: 260 },
  { L: 'E', sw: true, d: 320 },
  { L: 'E', sw: false, d: 1300 },
];

export default function TutoSwap() {
  const [s, setS] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setS((s + 1) % STEPS.length), STEPS[s].d);
    return () => clearTimeout(t);
  }, [s]);

  const st = STEPS[s];

  return (
    <div className="dboard tuto-board" style={{ position: 'relative', gridTemplateColumns: 'repeat(4, 48px)' }}>
      {TS_PILE.map((row, r) => row.map((L, c) => {
        if (r === 0 && c === 1)
          return <DropTile key={`${r}-${c}`} L={st.L} cls={`active${st.sw ? ' swapping' : ''}`} />;
        if (L == null) return <div key={`${r}-${c}`} className="cell" />;
        return <DropTile key={`${r}-${c}`} L={L} />;
      }))}
    </div>
  );
}
