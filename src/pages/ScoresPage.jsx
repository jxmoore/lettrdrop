import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Btn } from '../components';
import { getPersonalScores } from '../services/leaderboard';

const MEDALS = ['🥇', '🥈', '🥉'];

function formatWhen(dateStr) {
  const d = new Date(dateStr);
  const now = new Date();
  const diffMs = now - d;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) {
    return d.toLocaleDateString('en-US', { weekday: 'short' });
  }
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function ScoresPage() {
  const navigate = useNavigate();
  const userId = useSelector((s) => s.session.userId);
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) { setLoading(false); return; }
    getPersonalScores(userId, 20)
      .then(setScores)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [userId]);

  return (
    <div className="pscreen" style={{ gap: 14 }}>
      <div className="hs-head">
        <div className="skiplink" onClick={() => navigate(-1)}>‹ Back</div>
        <div className="hs-title">High Scores</div>
        <div style={{ width: 36 }} />
      </div>

      <div className="hs-list">
        {loading && (
          <div className="card-sub" style={{ textAlign: 'center', padding: 24 }}>
            Loading scores…
          </div>
        )}

        {!loading && scores.length === 0 && (
          <div className="card-sub" style={{ textAlign: 'center', padding: 24 }}>
            No games played yet. Go play!
          </div>
        )}

        {scores.map((row, i) => {
          const isTop3 = i < 3;
          return (
            <div key={row.id} className={`hs-row${i === 0 ? ' me' : ''}`}>
              <div className={`hs-rank${isTop3 ? ' top' : ''}`}>
                {isTop3 ? MEDALS[i] : i + 1}
              </div>
              <div className="hs-meta">
                {i === 0 && <span className="hs-tag">BEST</span>}
                <span className="hs-when">
                  {formatWhen(row.created_at)} · {row.words} word{row.words !== 1 ? 's' : ''}
                </span>
              </div>
              <div className="hs-score">{row.score.toLocaleString()}</div>
            </div>
          );
        })}
      </div>

      <Btn
        variant="primary"
        wide
        lg
        style={{ marginTop: 'auto' }}
        onClick={() => navigate('/play')}
      >
        ▶ &nbsp;New Game
      </Btn>
    </div>
  );
}
