import MiniTile from './MiniTile';

export default function PlayStrip({ next = [] }) {
  return (
    <div className="playstrip">
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
