import DTopBar from './DTopBar';
import DStats from './DStats';
import PlayStrip from './PlayStrip';
import DropBoard from './DropBoard';
import PlayHint from './PlayHint';

const EMPTY_GRID = Array.from({ length: 8 }, () => Array(6).fill(null));

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
  score = '0',
  words = '0',
  best = '0',
  scoreGlow = false,
  overlay = null,
  onJumble,
  onSwap,
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
      <PlayStrip next={next} />
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
      <PlayHint />
      {overlay}
    </div>
  );
}
