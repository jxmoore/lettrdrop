export default function DStats({
  score = '0',
  words = '0',
  best = '0',
  scoreGlow = false,
}) {
  return (
    <div className="stats-row">
      <div className={`stat-box${scoreGlow ? ' glow' : ''}`}>
        <div className="stat-label">Score</div>
        <div className="stat-value">{score}</div>
      </div>
      <div className="stat-box">
        <div className="stat-label">Words</div>
        <div className="stat-value">{words}</div>
      </div>
      <div className="stat-box">
        <div className="stat-label">Best</div>
        <div className="stat-value">{best}</div>
      </div>
    </div>
  );
}
