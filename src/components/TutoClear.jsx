import { useState, useEffect } from 'react';
import DropTile from './DropTile';

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
const DEMO_GRAV = [[1, 2], [2, 1], [2, 2], [3, 1], [3, 2], [3, 3]];
const inList = (list, r, c) => list.some(([a, b]) => a === r && b === c);

export default function TutoClear() {
  const [phase, setPhase] = useState('idle');

  useEffect(() => {
    const seq = ['idle', 'detect', 'extend', 'clear', 'drop'];
    const durs = { idle: 900, detect: 1300, extend: 1100, clear: 460, drop: 0 };
    let i = 0, t;
    const step = () => {
      const ph = seq[i];
      setPhase(ph);
      if (i >= seq.length - 1) return; // hold on final phase
      t = setTimeout(() => { i++; step(); }, durs[ph]);
    };
    step();
    return () => clearTimeout(t);
  }, []);

  const showAfter = phase === 'drop';
  const eLanded = phase === 'extend' || phase === 'clear';
  const clearing = phase === 'clear';

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
      sparks.push({
        left: (14 + (i * 6.4) % 72) + '%',
        top: '76%',
        sx: Math.cos(ang) * (32 + (i % 3) * 12) + 'px',
        sy: (Math.sin(ang) * 28 - 22) + 'px',
        c: cols[i % cols.length],
        round: i % 2 === 0,
      });
    }
  }

  return (
    <div className="dboard tuto-board" style={{ position: 'relative', gridTemplateColumns: 'repeat(5, 42px)' }}>
      {grid.map((row, r) => row.map((L, c) => {
        if (!showAfter && r === 3 && c === 4 && !eLanded)
          return <div key={`${r}-${c}`} className="cell" />;
        if (L == null) {
          if (!showAfter && !eLanded && r === 1 && c === 4)
            return <DropTile key={`${r}-${c}`} L="E" cls="active" />;
          return <div key={`${r}-${c}`} className="cell" />;
        }
        let cls = '';
        let delay = null;
        let drop = null;
        if (isClearing(r, c)) cls = 'matched pop';
        else if (isPending(r, c)) { cls = 'pending'; delay = c * 80; }
        if (phase === 'extend' && r === 3 && c === 4) { cls = 'gravity pending'; drop = -96; delay = 4 * 80; }
        if (showAfter && inList(DEMO_GRAV, r, c)) { cls = 'gravity'; drop = -48; }
        return <DropTile key={`${r}-${c}`} L={L} cls={cls} delay={delay} drop={drop} />;
      }))}
      {sparks.map((s, i) => (
        <span
          key={i}
          className="spark go"
          style={{ left: s.left, top: s.top, background: s.c, borderRadius: s.round ? '50%' : '2px', '--sx': s.sx, '--sy': s.sy }}
        />
      ))}
      {clearing && <div className="score-float" style={{ fontSize: 34 }}>+5</div>}
    </div>
  );
}
