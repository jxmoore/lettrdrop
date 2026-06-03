import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Modal from './Modal';
import Btn from './Btn';
import RankPeek from './RankPeek';
import { getAroundMe } from '../services/leaderboard';

/**
 * "Stacked Out!" revive overlay — shown when the player tops out
 * for the first time in a game (before revive is used).
 *
 * Props:
 *   score     — current score
 *   words     — words cleared
 *   isPremium — skip ad for premium users
 *   onWatchAd — called when "Watch ad" tapped (shows AdOverlay upstream)
 *   onRestart — Play Again
 *   onQuit    — Home
 */
export default function ReviveOverlay({
  score,
  words,
  isPremium,
  onReviveNow,
  onWatchAd,
  onRestart,
  onQuit,
}) {
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

  return (
    <Modal>
      <div className="card-title" style={{ color: '#ff6f91' }}>Stacked Out!</div>
      <div className="card-sub">Score so far</div>
      <div className="result-score">{score.toLocaleString()}</div>

      {isPremium ? (
        <Btn variant="primary" wide lg onClick={onReviveNow}>
          ✨ &nbsp;Revive — clear 4 rows
        </Btn>
      ) : (
        <Btn variant="primary" wide lg onClick={onWatchAd}>
          ▶ &nbsp;Watch ad to clear 4 rows
        </Btn>
      )}
      <div className="card-sub" style={{ fontSize: 12, marginTop: -4 }}>
        One revive per game
      </div>

      {rankData && !rankLoading && (
        <RankPeek
          label="Global rank"
          of={`#${rankData.myRank} of ${rankData.total}`}
          rows={rankData.rows}
          loading={false}
        />
      )}
      {rankLoading && (
        <RankPeek label="Global rank" loading />
      )}

      <Btn variant="ghost" wide onClick={onRestart}>
        ▶ &nbsp;Play Again
      </Btn>
      <Btn variant="ghost" wide onClick={onQuit}>
        🏠 &nbsp;Home
      </Btn>
    </Modal>
  );
}
