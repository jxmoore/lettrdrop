import MiniTile from './MiniTile';

export default function PlayStrip({ next = [], hold = null, onHold }) {
  return (
    <div className="playstrip">
      <div className="hold-slot" onClick={onHold}>
        <span className="lab">Hold</span>
        {hold ? <MiniTile L={hold} /> : <div className="hold-empty" />}
      </div>
      <div className="next-preview">
        <span className="lab">Next</span>
        <div className="next-tiles">
          {next.map((L, i) => (
            <MiniTile key={i} L={L} up={i > 0} />
          ))}
        </div>
      </div>
    </div>
  );
}
