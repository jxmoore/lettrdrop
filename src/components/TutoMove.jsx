import DropTile from './DropTile';

const TM_PILE = [
  [null, null, null, null],
  [null, null, null, null],
  [null, null, null, null],
  ['S', 'T', 'O', 'E'],
  ['A', 'R', 'N', 'D'],
];

export default function TutoMove() {
  return (
    <div className="dboard tuto-board" style={{ position: 'relative', gridTemplateColumns: 'repeat(4, 48px)' }}>
      {TM_PILE.map((row, r) => row.map((L, c) => (
        L == null
          ? <div key={`${r}-${c}`} className="cell" />
          : <DropTile key={`${r}-${c}`} L={L} />
      )))}
      <span className="tuto-h">{'⟵'}&nbsp; drag &nbsp;{'⟶'}</span>
      <span className="tuto-v">{'⤓'}&nbsp; double-tap to drop</span>
      <div className="tuto-live"><DropTile L="B" cls="active" /></div>
    </div>
  );
}
