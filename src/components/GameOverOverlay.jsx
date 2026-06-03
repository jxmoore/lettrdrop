import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Modal from './Modal';
import Btn from './Btn';
import RankPeek from './RankPeek';
import { getAroundMe } from '../services/leaderboard';

/**
 * "Stacked Out" overlay — shown when the game ends without beating the best score.
 *
 * Props:
 *   score     – final score this game
 *   words     – words cleared this game
 *   best      – all-time best score
 *   onRestart – callback to restart game
 */
export default function GameOverOverlay({ score, words, best, onRestart }) {
  const navigate = useNavigate();
  const userId = useSelector((s) => s.session.userId);
  const [rankData, setRankData] = useState(null);
  const [rankLoading, setRankLoading] = useState(true);

  useEffect(() => {
    if (!userId) { setRankLoading(false); return; }
    getAroundMe(userId)
      .then(setRankData)
      .catch(() => {})
      .finally(() => setRankLoading(false));
  }, [userId]);

  const gap = best - score;

  return (
    <Modal>
      <div className="card-title" style={{ color: '#5a9486' }}>Stacked Out</div>
      <div className="card-sub">Final score</div>
      <div className="result-score">{score.toLocaleString()}</div>
      <div className="card-sub" style={{ marginTop: -2 }}>
        Best <b style={{ color: '#1f6f57' }}>{best.toLocaleString()}</b>
        {gap > 0 && <> · {gap.toLocaleString()} to go</>}
      </div>
      <div className="card-sub" style={{ marginTop: -4, fontSize: 13 }}>
        {words} word{words !== 1 ? 's' : ''} cleared
      </div>

      {userId && (
        <div style={{ width: '100%', marginTop: 6 }}>
          <RankPeek
            label="Global rank"
            of={rankData ? `#${rankData.myRank.toLocaleString()} of ${rankData.total.toLocaleString()}` : ''}
            rows={rankData ? rankData.rows : []}
            loading={rankLoading}
          />
        </div>
      )}

      <Btn variant="primary" wide lg onClick={onRestart}>
        ▶ &nbsp;Play Again
      </Btn>
      <Btn variant="ghost" wide onClick={() => navigate('/home')}>
        🏠 &nbsp;Home
      </Btn>
    </Modal>
  );
}
