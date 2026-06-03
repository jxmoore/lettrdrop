import { useState, useEffect, useRef } from 'react';
import Modal from './Modal';
import Btn from './Btn';

const AD_DURATION = 5; // seconds

/**
 * Mock 5-second rewarded ad overlay.
 * Props:
 *   rewardLabel — e.g. "🎁 Reward: +1 Jumble" or "🎁 Reward: Revive"
 *   onComplete  — called when the ad finishes (grant the reward)
 *   onCancel    — called if the user closes before finishing (optional)
 */
export default function AdOverlay({ rewardLabel, onComplete, onCancel }) {
  const [remaining, setRemaining] = useState(AD_DURATION);
  const done = useRef(false);

  useEffect(() => {
    if (remaining <= 0) {
      if (!done.current) {
        done.current = true;
        onComplete();
      }
      return;
    }

    const t = setTimeout(() => setRemaining((r) => r - 1), 1000);
    return () => clearTimeout(t);
  }, [remaining, onComplete]);

  const finished = remaining <= 0;

  return (
    <Modal>
      <div className="adlabel">Rewarded Ad</div>

      <div className="adview">
        <div className="adskip">
          {finished ? 'Done!' : `Skip in ${remaining}s`}
        </div>
        <div className="adbrand">YOUR AD</div>
        <div className="adnote">
          — 0:{String(remaining).padStart(2, '0')} —
        </div>
      </div>

      <div className="reward-pill">{rewardLabel}</div>

      <div className="card-sub">
        {finished
          ? 'Reward earned!'
          : 'Watch the full video to earn your reward.'}
      </div>
    </Modal>
  );
}
