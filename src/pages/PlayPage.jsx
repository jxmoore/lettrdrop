import { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { DropInGame, Modal, Btn } from '../components';
import GameOverOverlay from '../components/GameOverOverlay';
import NewHighScoreOverlay from '../components/NewHighScoreOverlay';
import AdOverlay from '../components/AdOverlay';
import ReviveOverlay from '../components/ReviveOverlay';
import useGameEngine, { GAME_STATE } from '../engine/useGameEngine';
import useTouchInput from '../engine/useTouchInput';
import { submitScore } from '../services/leaderboard';
import { updateProfile } from '../services/auth';
import { setBestScore } from '../store/slices/settingsSlice';

export default function PlayPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const boardRef = useRef(null);
  const engine = useGameEngine();

  const userId = useSelector((s) => s.session.userId);
  const storedBest = useSelector((s) => s.settings.bestScore);
  const isPremium = useSelector((s) => s.settings.isPremium);

  // Track whether this game set a new record (latched at game end)
  const [isNewBest, setIsNewBest] = useState(false);
  const [prevBest, setPrevBest] = useState(0);
  const [scoreSubmitted, setScoreSubmitted] = useState(false);

  // Ad overlay state
  const [adOverlay, setAdOverlay] = useState(null); // null | { type: 'jumble'|'swap'|'revive', label }

  const {
    grid, active, ghostRow, next, hold,
    score, words, best,
    jumbles, swaps,
    gameState,
    pending, matched, clearCls,
    shuffling, rocking, swapping,
    newBest, scoreFloats,
    init, doJumble, doSwap, doHold,
    pause, resume, restart,
    moveLeft, moveRight, moveToColumn,
    startSoftDrop,
    revive, declineRevive, grantAssist,
  } = engine;

  useTouchInput(boardRef, {
    moveLeft,
    moveRight,
    moveToColumn,
    startSoftDrop,
    doHold,
    active,
  });

  useEffect(() => {
    init();
  }, [init]);

  // Helper: persist the current game's score (idempotent via scoreSubmitted flag)
  const persistScore = useCallback(() => {
    if (scoreSubmitted || score <= 0) return;

    const isRecord = score > storedBest;
    setIsNewBest(isRecord);
    setPrevBest(storedBest);
    setScoreSubmitted(true);

    if (isRecord) {
      dispatch(setBestScore(score));
    }

    // Server-side persistence only for logged-in users
    if (userId) {
      submitScore(userId, { score, words }).catch((err) =>
        console.error('[persistScore] submitScore failed:', err.message)
      );
      if (isRecord) {
        updateProfile(userId, { best_score: score }).catch((err) =>
          console.error('[persistScore] updateProfile failed:', err.message)
        );
      }
    }
  }, [score, words, storedBest, userId, scoreSubmitted, dispatch]);

  // Submit score to Supabase when game ends OR when stacked out
  // (so the ReviveOverlay leaderboard shows the current score)
  useEffect(() => {
    if (gameState === GAME_STATE.GAME_OVER || gameState === GAME_STATE.STACKED_OUT) {
      persistScore();
    }
    // If player revived, reset the flag so the final score can be submitted again
    if (gameState === GAME_STATE.PLAYING && scoreSubmitted) {
      setScoreSubmitted(false);
    }
  }, [gameState, persistScore, scoreSubmitted]);

  const ghost = active && ghostRow != null
    ? { r: ghostRow, c: active.c }
    : null;

  const handleRestart = useCallback(() => {
    // Save score if restarting from stacked-out (skipping GAME_OVER)
    if (gameState === GAME_STATE.STACKED_OUT) {
      persistScore();
    }
    setIsNewBest(false);
    setPrevBest(0);
    setScoreSubmitted(false);
    setAdOverlay(null);
    restart();
  }, [restart, gameState, persistScore]);

  const handleQuit = useCallback(() => {
    // Save score if quitting from stacked-out (skipping GAME_OVER)
    if (gameState === GAME_STATE.STACKED_OUT) {
      persistScore();
    }
    navigate('/home');
  }, [navigate, gameState, persistScore]);

  const handleShare = useCallback(async () => {
    const text = `I scored ${score.toLocaleString()} in LettrDrop! 🎉 ${words} words cleared.`;
    if (navigator.share) {
      try {
        await navigator.share({ title: 'LettrDrop', text });
      } catch {
        // User cancelled or share failed — fall back to clipboard
        await navigator.clipboard?.writeText(text).catch(() => {});
      }
    } else {
      await navigator.clipboard?.writeText(text).catch(() => {});
    }
  }, [score, words]);

  // --- Assist ad flow ---
  // When a depleted assist is tapped, show the ad (or grant instantly for premium)
  const handleJumble = useCallback(() => {
    if (jumbles > 0) {
      doJumble();
      return;
    }
    // Depleted — offer ad
    if (isPremium) {
      grantAssist('jumble');
    } else {
      setAdOverlay({ type: 'jumble', label: '🎁 Reward: +1 Jumble' });
    }
  }, [jumbles, doJumble, isPremium, grantAssist]);

  const handleSwap = useCallback(() => {
    if (swaps > 0) {
      doSwap();
      return;
    }
    // Depleted — offer ad
    if (isPremium) {
      grantAssist('swap');
    } else {
      setAdOverlay({ type: 'swap', label: '🎁 Reward: +1 Swap' });
    }
  }, [swaps, doSwap, isPremium, grantAssist]);

  // --- Ad completion callbacks ---
  const handleAdComplete = useCallback(() => {
    if (!adOverlay) return;
    const { type } = adOverlay;
    setAdOverlay(null);

    if (type === 'jumble' || type === 'swap') {
      grantAssist(type);
    } else if (type === 'revive') {
      revive();
    }
  }, [adOverlay, grantAssist, revive]);

  // --- Revive flow ---
  const handleWatchReviveAd = useCallback(() => {
    if (isPremium) {
      revive();
    } else {
      setAdOverlay({ type: 'revive', label: '🎁 Reward: Revive' });
    }
  }, [isPremium, revive]);

  const handleDeclineRevive = useCallback(() => {
    declineRevive();
  }, [declineRevive]);

  // --- Overlay logic ---
  let overlay = null;

  // Ad overlay takes precedence over everything
  if (adOverlay) {
    overlay = (
      <AdOverlay
        rewardLabel={adOverlay.label}
        onComplete={handleAdComplete}
      />
    );
  } else if (gameState === GAME_STATE.PAUSED) {
    overlay = (
      <Modal>
        <div className="pause-badge">
          <svg width="30" height="30" viewBox="0 0 24 24" aria-hidden="true">
            <rect x="5.5" y="4" width="5" height="16" rx="2.5" fill="#1f97d6" />
            <rect x="13.5" y="4" width="5" height="16" rx="2.5" fill="#1f97d6" />
          </svg>
        </div>
        <div className="card-title">Paused</div>
        <div className="card-sub">
          Score <b style={{ color: '#1f6f57' }}>{score.toLocaleString()}</b>
          {' '}&middot; {words} words
        </div>
        <Btn variant="primary" wide lg onClick={resume}>
          ▶ &nbsp;Resume
        </Btn>
        <Btn variant="ghost" wide onClick={handleRestart}>
          ↺ &nbsp;Restart
        </Btn>
        <div className="skiplink" style={{ color: '#c98a9a' }} onClick={handleQuit}>
          Quit to Home
        </div>
      </Modal>
    );
  } else if (gameState === GAME_STATE.STACKED_OUT) {
    overlay = (
      <ReviveOverlay
        score={score}
        words={words}
        isPremium={isPremium}
        onReviveNow={() => revive()}
        onWatchAd={handleWatchReviveAd}
        onRestart={handleRestart}
        onQuit={handleQuit}
      />
    );
  } else if (gameState === GAME_STATE.GAME_OVER) {
    if (isNewBest) {
      overlay = (
        <NewHighScoreOverlay
          score={score}
          words={words}
          prevBest={prevBest}
          onRestart={handleRestart}
          onShare={handleShare}
        />
      );
    } else {
      overlay = (
        <GameOverOverlay
          score={score}
          words={words}
          best={best}
          onRestart={handleRestart}
        />
      );
    }
  } else if (gameState === GAME_STATE.LOADING) {
    overlay = (
      <Modal>
        <div className="card-title">Loading...</div>
        <div className="card-sub">Preparing dictionary</div>
      </Modal>
    );
  }

  return (
    <DropInGame
      grid={grid}
      active={active}
      ghost={ghost}
      next={next}
      hold={hold}
      score={score.toLocaleString()}
      words={String(words)}
      best={best.toLocaleString()}
      jumbles={jumbles}
      swaps={swaps}
      matched={matched}
      clearCls={clearCls}
      pending={pending}
      shuffling={shuffling}
      rocking={rocking}
      swapping={swapping}
      scoreGlow={newBest}
      scoreFloats={scoreFloats}
      boardRef={boardRef}
      onJumble={handleJumble}
      onSwap={handleSwap}
      onHold={doHold}
      onPause={pause}
      overlay={overlay}
    />
  );
}
