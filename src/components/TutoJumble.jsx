import { useState, useEffect, useRef } from 'react';
import DropTile from './DropTile';

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

export default function TutoJumble() {
  const [grid, setGrid] = useState(TJ_A);
  const [sh, setSh] = useState(false);
  const flip = useRef(true);

  useEffect(() => {
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
        L == null
          ? <div key={`${r}-${c}`} className="cell" />
          : <DropTile key={`${r}-${c}`} L={L} cls={sh ? 'shuffling' : ''} />
      )))}
    </div>
  );
}
