import Logo from './Logo';
import AssistBtn from './AssistBtn';
import { JumbleIcon, SwapIcon, PauseIcon } from './icons';
import QuitBtn from './QuitBtn';
import HoldSlot from './HoldSlot';
import VNext from './VNext';
import DropBoard from './DropBoard';
import DStats from './DStats';
import PlayHint from './PlayHint';
import { ROWS, COLS } from '../engine/config';

/** Display rows — the well is padded up to this height so it reads as a
 *  tall narrow falling well beside the rails. */
const IG_ROWS = 12;

/** Fallback letters used to pad a short next queue up to 6 tiles. */
const IG_NEXT_PAD = ['S', 'A', 'N', 'E', 'T', 'R'];

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
  onQuit,
}) {
  // ── Pad the engine grid up to IG_ROWS for display ──
  const padN = Math.max(0, IG_ROWS - grid.length);
  const padGrid = padN
    ? [...Array.from({ length: padN }, () => Array(COLS).fill(null)), ...grid]
    : grid;

  // Shift a {r, c, …} cell reference by the padding offset
  const shiftCell = (cell) => (cell ? { ...cell, r: cell.r + padN } : cell);

  // Shift coordinate arrays ([r, c] pairs)
  const padMatched = matched.map(([r, c]) => [r + padN, c]);
  const padPending = pending.map(([r, c]) => [r + padN, c]);

  // Pad the next queue up to 6 tiles
  const queue = [...next, ...IG_NEXT_PAD].slice(0, 6);

  return (
    <div className="pscreen ig">
      {/* ── Top bar: logo + quit ── */}
      <div className="ptop">
        <div className="plogo"><Logo s={36} /></div>
        <div className="icons"><QuitBtn onClick={onQuit || onPause} /></div>
      </div>

      {/* ── Three-column play area ── */}
      <div className="ig-stage">
        {/* LEFT rail: hold + assists */}
        <div className="ig-railL">
          <HoldSlot L={hold} onClick={onHold} />
          <div className="ig-railctrls">
            <AssistBtn
              label="Jumble"
              depleted={jumbles === 0}
              badge={jumbles === 0 ? '▶' : jumbles}
              badgeAd={jumbles === 0}
              onClick={onJumble}
            >
              <JumbleIcon />
            </AssistBtn>
            <AssistBtn
              label="Swap"
              variant="swap"
              depleted={swaps === 0}
              badge={swaps === 0 ? '▶' : swaps}
              badgeAd={swaps === 0}
              onClick={onSwap}
            >
              <SwapIcon />
            </AssistBtn>
            <AssistBtn label="Pause" variant="pause" onClick={onPause}>
              <PauseIcon />
            </AssistBtn>
          </div>
        </div>

        {/* CENTER: board + stats */}
        <div className="ig-boardcol">
          <div ref={boardRef} style={{ position: 'relative' }}>
            <DropBoard
              fit
              grid={padGrid}
              active={shiftCell(active)}
              ghostCell={shiftCell(ghost)}
              matched={padMatched}
              pending={padPending}
              clearCls={clearCls}
              shuffling={shuffling}
              rocking={rocking}
              swapping={swapping}
            />
            {/* Score floats — shifted to padded coordinates */}
            {scoreFloats.map((f) => (
              <div
                key={f.id}
                className="score-float"
                style={{
                  left: `${((f.c + 0.5) / COLS) * 100}%`,
                  top: `${((f.r + padN + 0.5) / IG_ROWS) * 100}%`,
                }}
              >
                +{f.score}
              </div>
            ))}
            {/* Assist flash pills */}
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
            {/* In-game new-best gold banner */}
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
          <DStats score={score} words={words} best={best} scoreGlow={scoreGlow} />
        </div>

        {/* RIGHT rail: next queue */}
        <div className="ig-railR">
          <VNext items={queue} />
        </div>
      </div>

      <PlayHint />
      {overlay}
    </div>
  );
}
