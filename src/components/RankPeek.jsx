import { useNavigate } from 'react-router-dom';

/**
 * Compact 3-row slice of the global leaderboard centered on the player.
 *
 * Props:
 *   label   – heading text ("Global rank" or "You climbed to")
 *   of      – rank string ("#1,240 of 8,420")
 *   up      – rank delta on a new record (e.g. 9 → shows "↑ 9"), or null
 *   rows    – [{ rank, name, score, me }]  (above, me, below)
 *   loading – show skeleton while data loads
 */
export default function RankPeek({ label, of, up, rows = [], loading = false }) {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="rankpeek">
        <div className="rp-head">
          <span className="rp-label">{label || 'Global rank'}</span>
          <span className="rp-of" style={{ opacity: 0.4 }}>Loading…</span>
        </div>
        <div className="rp-list">
          {[0, 1, 2].map((i) => (
            <div key={i} className="rp-row" style={{ opacity: 0.3 }}>
              <span className="rp-rank">—</span>
              <span className="rp-name">···</span>
              <span className="rp-score">—</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rankpeek">
      <div className="rp-head">
        <span className="rp-label">{label}</span>
        <span className="rp-of">
          {of}
          {up != null && <span className="up">↑ {up}</span>}
        </span>
      </div>
      <div className="rp-list">
        {rows.map((row, i) => (
          <div key={i} className={`rp-row${row.me ? ' me' : ''}`}>
            <span className="rp-rank">#{row.rank.toLocaleString()}</span>
            <span className="rp-name">
              {row.name}
              {row.me && <span className="rp-you">YOU</span>}
            </span>
            <span className="rp-score">{row.score.toLocaleString()}</span>
          </div>
        ))}
      </div>
      <div className="rp-link" onClick={() => navigate('/scores')}>
        See full leaderboard ›
      </div>
    </div>
  );
}
