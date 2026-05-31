import DropTile from './DropTile';

export default function DropBoard({
  grid,
  cols = 6,
  active = null,
  ghostCell = null,
  matched = [],
  clearCls = '',
  pending = [],
  shuffling = false,
  rocking = false,
  swapping = false,
}) {
  const isMatched = (r, c) => matched.some(([mr, mc]) => mr === r && mc === c);
  const isPending = (r, c) => pending.some(([pr, pc]) => pr === r && pc === c);

  return (
    <div className="dboard" style={{ '--cols': cols }}>
      {grid.map((row, r) =>
        row.map((L, c) => {
          if (active && active.r === r && active.c === c) {
            return (
              <DropTile
                key={`${r}-${c}`}
                L={active.L}
                cls={`active${swapping ? ' swapping' : ''}`}
              />
            );
          }

          if (L == null) {
            const ghost = ghostCell && ghostCell.r === r && ghostCell.c === c;
            return (
              <div
                key={`${r}-${c}`}
                className={`cell${ghost ? ' ghost' : ''}`}
              />
            );
          }

          let cls = '';
          let delay = null;

          if (shuffling) {
            cls = 'shuffling';
          } else if (isPending(r, c)) {
            cls = 'pending';
            delay = c * 80;
          } else if (isMatched(r, c)) {
            cls = `matched ${clearCls}`.trim();
          } else if (rocking) {
            cls = 'rock';
            delay = c * 65;
          }

          return <DropTile key={`${r}-${c}`} L={L} cls={cls} delay={delay} />;
        })
      )}
    </div>
  );
}
