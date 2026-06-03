import DTopBar from './DTopBar';
import DStats from './DStats';
import PlayStrip from './PlayStrip';
import DropBoard from './DropBoard';
import PlayHint from './PlayHint';
import { ROWS, COLS } from '../engine/config';

const EMPTY_GRID = Array.from({ length: ROWS }, () => Array(COLS).fill(null));

export default function DropInGame({
  jumbles = 3,
  swaps = 2,
  grid = EMPTY_GRID,
  active = null,
  ghost = null,
  matched = [],
  clearCls = '',
  pending = [],
  shuffling = false,
  rocking = false,
  swapping = false,
  next = [],
  hold = null,
  score = '0',
  words = '0',
  best = '0',
  scoreGlow = false,
  overlay = null,
  scoreFloats = [],
  boardRef,
  onJumble,
  onSwap,
  onHold,
  onPause,
}) {
  return (
    <div className="pscreen">
      <DTopBar
        jumbles={jumbles}
        swaps={swaps}
        onJumble={onJumble}
        onSwap={onSwap}
        onPause={onPause}
      />
      <DStats score={score} words={words} best={best} scoreGlow={scoreGlow} />
      <PlayStrip next={next} hold={hold} onHold={onHold} />
      <div ref={boardRef} style={{ position: 'relative' }}>
        <DropBoard
          grid={grid}
          active={active}
          ghostCell={ghost}
          matched={matched}
          clearCls={clearCls}
          pending={pending}
          shuffling={shuffling}
          rocking={rocking}
          swapping={swapping}
        />
        {scoreFloats.map((f) => (
          <div
            key={f.id}
            className="score-float"
            style={{
              left: `${((f.c + 0.5) / COLS) * 100}%`,
              top: `${((f.r + 0.5) / ROWS) * 100}%`,
            }}
          >
            +{f.score}
          </div>
        ))}
        {shuffling && (
          <div className="assist-flash jumble-flash">
            <span className="af-pill jb">🔀 Jumble!</span>
          </div>
        )}
        {swapping && (
          <div className="assist-flash swap-flash">
            <span className="af-pill sb">🔄 Swap!</span>
          </div>
        )}
        {scoreGlow && (
          <div className="best-layer">
            <div className="burst" />
            <div className="bestglow" />
            <div className="bestbanner">
              <span className="bb-top">🎉 NEW BEST! 🎉</span>
              <span className="bb-score">{score}</span>
            </div>
          </div>
        )}
      </div>
      <PlayHint />
      {overlay}
    </div>
  );
}
