import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Btn from './Btn';
import RankPeek from './RankPeek';
import { getAroundMe } from '../services/leaderboard';

const CONFETTI_COLORS = ['#ff6f91', '#4cc4ff', '#ffc83d', '#2fd6ad', '#9b8cff', '#ff924c'];

/**
 * Full-screen celebration overlay — shown when the player sets a new personal best.
 *
 * Props:
 *   score      – new high score
 *   words      – words cleared this game
 *   prevBest   – previous best score (before this game)
 *   onRestart  – callback to restart game
 *   onShare    – callback for share button
 */
export default function NewHighScoreOverlay({ score, words, prevBest, onRestart, onShare }) {
  const navigate = useNavigate();
  const userId = useSelector((s) => s.session.userId);
  const [rankData, setRankData] = useState(null);
  const [rankLoading, setRankLoading] = useState(true);
  const [prevRank, setPrevRank] = useState(null);

  useEffect(() => {
    if (!userId) { setRankLoading(false); return; }
    getAroundMe(userId)
      .then((data) => {
        setRankData(data);
      })
      .catch(() => {})
      .finally(() => setRankLoading(false));
  }, [userId]);

  // Generate confetti particles once
  const confetti = useMemo(() => {
    const spots = [];
    for (let i = 0; i < 20; i++) {
      spots.push({
        top: `${5 + Math.random() * 85}%`,
        left: `${3 + Math.random() * 94}%`,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        rotation: Math.floor(Math.random() * 360),
        size: 9 + (i % 4) * 3,
        round: i % 3 === 0,
        delay: (i * 0.12).toFixed(2),
      });
    }
    return spots;
  }, []);

  const delta = score - prevBest;

  return (
    <div className="nhs-screen">
      {/* Confetti particles */}
      {confetti.map((k, i) => (
        <span
          key={i}
          className="confetti confetti-fall"
          style={{
            top: k.top,
            left: k.left,
            width: k.size,
            height: k.size,
            background: k.color,
            borderRadius: k.round ? '50%' : '3px',
            transform: `rotate(${k.rotation}deg)`,
            animationDelay: `${k.delay}s`,
          }}
        />
      ))}

      <div className="tada-emoji">🎉</div>
      <div className="nhs-banner">New High Score!</div>
      <div className="nhs-score">{score.toLocaleString()}</div>
      <div className="nhs-prev">
        Previous best <s>{prevBest.toLocaleString()}</s> · +{delta.toLocaleString()}
      </div>
      <div className="nhs-words">{words} word{words !== 1 ? 's' : ''} cleared</div>

      {userId && (
        <div style={{ width: '100%', maxWidth: 320 }}>
          <RankPeek
            label="You climbed to"
            of={rankData ? `#${rankData.myRank.toLocaleString()}` : ''}
            up={prevRank && rankData ? prevRank - rankData.myRank : null}
            rows={rankData ? rankData.rows : []}
            loading={rankLoading}
          />
        </div>
      )}

      <div className="nhs-actions">
        <Btn variant="primary" wide lg onClick={onRestart}>
          ▶ &nbsp;Play Again
        </Btn>
        {onShare && (
          <Btn variant="ghost" wide lg onClick={onShare}>
            📤 &nbsp;Share
          </Btn>
        )}
      </div>
    </div>
  );
}
