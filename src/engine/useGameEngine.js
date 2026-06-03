import { useState, useRef, useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  ROWS, COLS, SPAWN_COL, NEXT_COUNT,
  GRACE_MS, DANGER_ROW,
  INITIAL_JUMBLES, INITIAL_SWAPS,
  MAX_JUMBLES, WORDS_PER_RECHARGE,
  SOFT_DROP_MULTIPLIER,
  MOVES_PER_LEVEL, TIME_PER_LEVEL_MS,
  SPEED_LEVELS, CHAIN_MULTIPLIER,
} from './config';
import { randomLetter, fillNextQueue, resetVowelTracking } from './letterPool';
import { scanGrid, wordKey, isExtension } from './wordScanner';
import { loadDictionary } from './dictionary';

function emptyGrid() {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(null));
}

function cloneGrid(g) {
  return g.map((row) => [...row]);
}

function computeGhost(grid, col, fromRow) {
  let r = fromRow;
  while (r + 1 < ROWS && grid[r + 1][col] == null) r++;
  return r;
}

function applyGravity(grid) {
  const g = cloneGrid(grid);
  let moved = false;
  for (let c = 0; c < COLS; c++) {
    let write = ROWS - 1;
    for (let r = ROWS - 1; r >= 0; r--) {
      if (g[r][c] != null) {
        if (r !== write) {
          g[write][c] = g[r][c];
          g[r][c] = null;
          moved = true;
        }
        write--;
      }
    }
  }
  return { grid: g, moved };
}

export const GAME_STATE = {
  LOADING: 'loading',
  PLAYING: 'playing',
  PAUSED: 'paused',
  STACKED_OUT: 'stacked_out',
  GAME_OVER: 'game_over',
};

export default function useGameEngine() {
  const bestScore = useSelector((s) => s.settings.bestScore);

  const [grid, setGrid] = useState(emptyGrid);
  const [active, setActive] = useState(null);
  const [ghostRow, setGhostRow] = useState(null);
  const [next, setNext] = useState([]);
  const [score, setScore] = useState(0);
  const [words, setWords] = useState(0);
  const [best, setBest] = useState(bestScore);
  const [jumbles, setJumbles] = useState(INITIAL_JUMBLES);
  const [swaps, setSwaps] = useState(INITIAL_SWAPS);
  const [gameState, setGameState] = useState(GAME_STATE.LOADING);
  const [pending, setPending] = useState([]);
  const [matched, setMatched] = useState([]);
  const [clearCls, setClearCls] = useState('');
  const [shuffling, setShuffling] = useState(false);
  const [rocking, setRocking] = useState(false);
  const [swapping, setSwapping] = useState(false);
  const [newBest, setNewBest] = useState(false);
  const [scoreFloats, setScoreFloats] = useState([]);
  const [hold, setHold] = useState(null);

  const g = useRef({
    grid: emptyGrid(),
    active: null,
    next: [],
    score: 0,
    words: 0,
    best: bestScore,
    level: 0,
    moveCount: 0,
    levelMoves: 0,
    levelTime: 0,
    jumbles: INITIAL_JUMBLES,
    swaps: INITIAL_SWAPS,
    state: GAME_STATE.LOADING,
    softDrop: false,
    newBestFired: false,
    chainDepth: 0,
    floatId: 0,
    reviveUsed: false,
    hold: null,
    holdUsed: false,
    lastRechargeWords: 0,
  });
  const tickTimer = useRef(null);
  const graceTimers = useRef(new Map());
  const fn = useRef({});

  // Keep Redux bestScore accessible from refs
  g.current.storedBest = bestScore;

  // --- Sync refs → React state ---
  const syncAll = useCallback(() => {
    const s = g.current;
    setGrid(cloneGrid(s.grid));
    setScore(s.score);
    setWords(s.words);
    setBest(s.best);
    setJumbles(s.jumbles);
    setSwaps(s.swaps);
    setGameState(s.state);

    if (s.active) {
      setActive({ ...s.active });
      setGhostRow(computeGhost(s.grid, s.active.c, s.active.r));
    } else {
      setActive(null);
      setGhostRow(null);
    }
    setNext([...s.next]);
    setHold(s.hold);
  }, []);
  fn.current.syncAll = syncAll;

  const syncActive = useCallback(() => {
    const s = g.current;
    if (s.active) {
      setActive({ ...s.active });
      setGhostRow(computeGhost(s.grid, s.active.c, s.active.r));
    } else {
      setActive(null);
      setGhostRow(null);
    }
  }, []);
  fn.current.syncActive = syncActive;

  // --- Tick scheduling ---
  const getInterval = useCallback(() => {
    const s = g.current;
    const lvl = Math.min(s.level, SPEED_LEVELS.length - 1);
    const base = SPEED_LEVELS[lvl];
    return s.softDrop ? Math.round(base * SOFT_DROP_MULTIPLIER) : base;
  }, []);
  fn.current.getInterval = getInterval;

  const scheduleTick = useCallback(() => {
    if (tickTimer.current) clearTimeout(tickTimer.current);
    if (g.current.state !== GAME_STATE.PLAYING) return;
    tickTimer.current = setTimeout(() => {
      fn.current.tick();
      fn.current.scheduleTick();
    }, fn.current.getInterval());
  }, []);
  fn.current.scheduleTick = scheduleTick;

  // --- Check danger ---
  const checkDanger = useCallback(() => {
    const grid = g.current.grid;
    let danger = false;
    for (let c = 0; c < COLS; c++) {
      if (grid[DANGER_ROW][c] != null) { danger = true; break; }
    }
    setRocking(danger);
  }, []);
  fn.current.checkDanger = checkDanger;

  // --- Check level up ---
  const checkLevelUp = useCallback(() => {
    const s = g.current;
    const maxLevel = SPEED_LEVELS.length - 1;
    if (s.level >= maxLevel) return;

    const now = Date.now();
    const movesReady = s.levelMoves >= MOVES_PER_LEVEL;
    const timeReady = (now - s.levelTime) >= TIME_PER_LEVEL_MS;

    if (movesReady || timeReady) {
      s.level = Math.min(s.level + 1, maxLevel);
      s.levelMoves = 0;
      s.levelTime = now;
    }
  }, []);
  fn.current.checkLevelUp = checkLevelUp;

  // --- Spawn tile ---
  const spawnTile = useCallback(() => {
    const s = g.current;
    const q = fillNextQueue(s.next, NEXT_COUNT + 1);
    const letter = q.shift();
    s.next = q;

    if (s.grid[0][SPAWN_COL] != null) {
      if (tickTimer.current) clearTimeout(tickTimer.current);
      if (!s.reviveUsed) {
        s.state = GAME_STATE.STACKED_OUT;
      } else {
        s.state = GAME_STATE.GAME_OVER;
      }
      fn.current.syncAll();
      return;
    }

    s.active = { r: 0, c: SPAWN_COL, L: letter };
    s.holdUsed = false;
    s.moveCount++;
    s.levelMoves++;
    fn.current.checkLevelUp();
    fn.current.syncAll();
    fn.current.scheduleTick();
  }, []);
  fn.current.spawnTile = spawnTile;

  // --- Word resolution ---
  const commitWord = useCallback((key) => {
    const entry = graceTimers.current.get(key);
    if (!entry) return;
    graceTimers.current.delete(key);
    const s = g.current;

    const chainMult = s.chainDepth > 0 ? Math.pow(CHAIN_MULTIPLIER, s.chainDepth) : 1;
    const finalScore = Math.round(entry.score * chainMult);

    setMatched(entry.cells);
    setClearCls('pop');

    const avgR = entry.cells.reduce((sum, [r]) => sum + r, 0) / entry.cells.length;
    const avgC = entry.cells.reduce((sum, [, c]) => sum + c, 0) / entry.cells.length;
    const floatId = ++s.floatId;
    setScoreFloats((prev) => [...prev, { id: floatId, score: finalScore, r: avgR, c: avgC }]);
    setTimeout(() => setScoreFloats((prev) => prev.filter((f) => f.id !== floatId)), 1100);

    s.score += finalScore;
    s.words++;

    // Assist recharge: every WORDS_PER_RECHARGE words, grant +1 jumble (capped) & +1 swap
    if (s.words > 0 && s.words % WORDS_PER_RECHARGE === 0 && s.words !== s.lastRechargeWords) {
      s.lastRechargeWords = s.words;
      if (s.jumbles < MAX_JUMBLES) {
        s.jumbles++;
        setJumbles(s.jumbles);
      }
      s.swaps++;
      setSwaps(s.swaps);
    }

    if (s.score > s.best) {
      s.best = s.score;
      if (!s.newBestFired) {
        s.newBestFired = true;
        setNewBest(true);
        setTimeout(() => setNewBest(false), 2500);
      }
    }

    fn.current.syncAll();

    setTimeout(() => {
      for (const [r, c] of entry.cells) {
        s.grid[r][c] = null;
      }
      setMatched([]);
      setClearCls('');

      const { grid: newGrid, moved } = applyGravity(s.grid);
      s.grid = newGrid;

      // Gravity may have shifted tiles out from under other pending words.
      // Cancel any grace timer whose cells no longer spell its original word.
      for (const [k, e] of graceTimers.current) {
        const current = e.cells.map(([r, c]) => (s.grid[r][c] || '')).join('').toLowerCase();
        if (current !== e.word) {
          clearTimeout(e.timer);
          graceTimers.current.delete(k);
        }
      }

      // Rebuild pending from surviving timers
      const remainPending = [];
      for (const [, e] of graceTimers.current) {
        remainPending.push(...e.cells);
      }
      setPending(remainPending);

      fn.current.syncAll();

      if (moved) s.chainDepth++;

      setTimeout(() => {
        const newWords = scanGrid(s.grid);
        if (newWords.length > 0) {
          fn.current.resolveWords();
        } else {
          if (graceTimers.current.size === 0) s.chainDepth = 0;
          fn.current.checkDanger();
          if (!s.active) fn.current.spawnTile();
        }
      }, 150);
    }, 460);
  }, []);
  fn.current.commitWord = commitWord;

  const resolveWords = useCallback(() => {
    const s = g.current;
    const found = scanGrid(s.grid);

    if (found.length === 0 && graceTimers.current.size === 0) {
      s.chainDepth = 0;
      fn.current.spawnTile();
      return;
    }

    for (const w of found) {
      const key = wordKey(w.cells);
      if (graceTimers.current.has(key)) continue;

      let extended = false;
      for (const [existingKey, existing] of graceTimers.current) {
        if (isExtension(existing.cells, w.cells)) {
          clearTimeout(existing.timer);
          graceTimers.current.delete(existingKey);
          const newKey = wordKey(w.cells);
          const timer = setTimeout(() => fn.current.commitWord(newKey), GRACE_MS);
          graceTimers.current.set(newKey, { timer, cells: w.cells, score: w.score, word: w.word });
          extended = true;
          break;
        }
      }

      if (!extended) {
        const timer = setTimeout(() => fn.current.commitWord(key), GRACE_MS);
        graceTimers.current.set(key, { timer, cells: w.cells, score: w.score, word: w.word });
      }
    }

    const allPending = [];
    for (const [, entry] of graceTimers.current) {
      allPending.push(...entry.cells);
    }
    setPending(allPending);

    // Spawn the next tile immediately — don't block while grace windows run
    if (!s.active) {
      fn.current.spawnTile();
    }
  }, []);
  fn.current.resolveWords = resolveWords;

  // --- Lock tile ---
  const lockTile = useCallback(() => {
    const s = g.current;
    if (!s.active) return;
    s.grid[s.active.r][s.active.c] = s.active.L;
    s.active = null;
    s.softDrop = false;
    fn.current.syncActive();
    fn.current.syncAll();
    fn.current.checkDanger();
    fn.current.resolveWords();
  }, []);
  fn.current.lockTile = lockTile;

  // --- Gravity tick ---
  const tick = useCallback(() => {
    const s = g.current;
    if (s.state !== GAME_STATE.PLAYING || !s.active) return;

    if (s.active.r + 1 < ROWS && s.grid[s.active.r + 1][s.active.c] == null) {
      s.active = { ...s.active, r: s.active.r + 1 };
      fn.current.syncActive();
    } else {
      fn.current.lockTile();
    }
  }, []);
  fn.current.tick = tick;

  // --- Movement ---
  const moveLeft = useCallback(() => {
    const s = g.current;
    if (!s.active || s.state !== GAME_STATE.PLAYING) return;
    if (s.active.c > 0 && s.grid[s.active.r][s.active.c - 1] == null) {
      s.active = { ...s.active, c: s.active.c - 1 };
      fn.current.syncActive();
    }
  }, []);

  const moveRight = useCallback(() => {
    const s = g.current;
    if (!s.active || s.state !== GAME_STATE.PLAYING) return;
    if (s.active.c < COLS - 1 && s.grid[s.active.r][s.active.c + 1] == null) {
      s.active = { ...s.active, c: s.active.c + 1 };
      fn.current.syncActive();
    }
  }, []);

  const moveToColumn = useCallback((targetCol) => {
    const s = g.current;
    if (!s.active || s.state !== GAME_STATE.PLAYING) return;
    const col = Math.max(0, Math.min(COLS - 1, targetCol));
    const dir = col > s.active.c ? 1 : -1;
    let c = s.active.c;
    while (c !== col) {
      c += dir;
      if (s.grid[s.active.r][c] != null) return;
    }
    s.active = { ...s.active, c: col };
    fn.current.syncActive();
  }, []);

  const startSoftDrop = useCallback(() => {
    const s = g.current;
    if (s.state !== GAME_STATE.PLAYING) return;
    s.softDrop = true;
    fn.current.scheduleTick();
  }, []);

  const stopSoftDrop = useCallback(() => {
    g.current.softDrop = false;
    fn.current.scheduleTick();
  }, []);

  // --- Assists ---
  const doJumble = useCallback(() => {
    const s = g.current;
    if (s.state !== GAME_STATE.PLAYING || s.jumbles <= 0) return;

    s.jumbles--;
    setJumbles(s.jumbles);

    // Record per-column tile counts so we preserve stack heights
    const colCounts = Array(COLS).fill(0);
    const letters = [];
    for (let c = 0; c < COLS; c++) {
      for (let r = 0; r < ROWS; r++) {
        if (s.grid[r][c] != null) {
          colCounts[c]++;
          letters.push(s.grid[r][c]);
        }
      }
    }

    for (const [, entry] of graceTimers.current) clearTimeout(entry.timer);
    graceTimers.current.clear();
    setPending([]);
    setShuffling(true);

    setTimeout(() => {
      // Shuffle all letters
      for (let i = letters.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [letters[i], letters[j]] = [letters[j], letters[i]];
      }

      // Place them back into the same column heights
      const newGrid = emptyGrid();
      let idx = 0;
      for (let c = 0; c < COLS; c++) {
        for (let i = 0; i < colCounts[c]; i++) {
          newGrid[ROWS - 1 - i][c] = letters[idx++];
        }
      }

      s.grid = newGrid;
      setShuffling(false);
      fn.current.syncAll();
      fn.current.checkDanger();
      setTimeout(() => fn.current.resolveWords(), 200);
    }, 640);
  }, []);

  const doSwap = useCallback(() => {
    const s = g.current;
    if (s.state !== GAME_STATE.PLAYING || s.swaps <= 0 || !s.active) return;

    s.swaps--;
    setSwaps(s.swaps);
    setSwapping(true);

    setTimeout(() => {
      let newLetter = randomLetter();
      while (newLetter === s.active.L) newLetter = randomLetter();
      s.active = { ...s.active, L: newLetter };
      setTimeout(() => {
        setSwapping(false);
        fn.current.syncActive();
      }, 300);
    }, 260);
  }, []);

  // --- Hold slot (like Tetris) ---
  const doHold = useCallback(() => {
    const s = g.current;
    if (s.state !== GAME_STATE.PLAYING || !s.active || s.holdUsed) return;

    s.holdUsed = true;
    const currentLetter = s.active.L;

    if (s.hold == null) {
      // First hold: stash the letter, spawn next tile
      s.hold = currentLetter;
      s.active = null;
      s.softDrop = false;
      fn.current.syncAll();
      fn.current.spawnTile();
    } else {
      // Swap: hold ↔ active
      const fromHold = s.hold;
      s.hold = currentLetter;
      s.active = { ...s.active, L: fromHold };
      fn.current.syncAll();
    }
  }, []);
  fn.current.doHold = doHold;

  // --- Revive: clear bottom 4 rows and resume ---
  const revive = useCallback(() => {
    const s = g.current;
    if (s.state !== GAME_STATE.STACKED_OUT) return;

    s.reviveUsed = true;

    // Clear the bottom 4 rows
    for (let r = ROWS - 4; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        s.grid[r][c] = null;
      }
    }

    // Apply gravity to settled tiles
    const { grid: newGrid } = applyGravity(s.grid);
    s.grid = newGrid;

    s.state = GAME_STATE.PLAYING;
    fn.current.syncAll();
    fn.current.checkDanger();
    fn.current.spawnTile();
  }, []);
  fn.current.revive = revive;

  // --- Decline revive: go to game over ---
  const declineRevive = useCallback(() => {
    const s = g.current;
    if (s.state !== GAME_STATE.STACKED_OUT) return;
    s.state = GAME_STATE.GAME_OVER;
    fn.current.syncAll();
  }, []);
  fn.current.declineRevive = declineRevive;

  // --- Grant +1 assist (after watching ad) ---
  const grantAssist = useCallback((type) => {
    const s = g.current;
    if (type === 'jumble') {
      s.jumbles++;
      setJumbles(s.jumbles);
    } else if (type === 'swap') {
      s.swaps++;
      setSwaps(s.swaps);
    }
  }, []);
  fn.current.grantAssist = grantAssist;

  // --- Pause ---
  const pause = useCallback(() => {
    const s = g.current;
    if (s.state !== GAME_STATE.PLAYING) return;
    s.state = GAME_STATE.PAUSED;
    setGameState(GAME_STATE.PAUSED);
    if (tickTimer.current) clearTimeout(tickTimer.current);
  }, []);

  const resume = useCallback(() => {
    const s = g.current;
    if (s.state !== GAME_STATE.PAUSED) return;
    s.state = GAME_STATE.PLAYING;
    setGameState(GAME_STATE.PLAYING);
    fn.current.scheduleTick();
  }, []);

  const restart = useCallback(() => {
    if (tickTimer.current) clearTimeout(tickTimer.current);
    for (const [, entry] of graceTimers.current) clearTimeout(entry.timer);
    graceTimers.current.clear();

    resetVowelTracking();

    Object.assign(g.current, {
      grid: emptyGrid(),
      active: null,
      next: [],
      score: 0,
      words: 0,
      best: g.current.storedBest,
      level: 0,
      moveCount: 0,
      levelMoves: 0,
      levelTime: Date.now(),
      jumbles: INITIAL_JUMBLES,
      swaps: INITIAL_SWAPS,
      state: GAME_STATE.PLAYING,
      softDrop: false,
      newBestFired: false,
      chainDepth: 0,
      reviveUsed: false,
      hold: null,
      holdUsed: false,
      lastRechargeWords: 0,
    });

    setPending([]);
    setMatched([]);
    setClearCls('');
    setShuffling(false);
    setRocking(false);
    setSwapping(false);
    setNewBest(false);
    setScoreFloats([]);
    fn.current.syncAll();
    fn.current.spawnTile();
  }, []);

  const init = useCallback(async () => {
    await loadDictionary();
    fn.current.restart();
  }, []);
  fn.current.init = init;
  fn.current.restart = restart;

  useEffect(() => {
    return () => {
      if (tickTimer.current) clearTimeout(tickTimer.current);
      for (const [, entry] of graceTimers.current) clearTimeout(entry.timer);
    };
  }, []);

  return {
    grid, active, ghostRow, next, hold,
    score, words, best,
    jumbles, swaps,
    gameState,
    pending, matched, clearCls,
    shuffling, rocking, swapping,
    newBest, scoreFloats,

    init, moveLeft, moveRight, moveToColumn,
    startSoftDrop, stopSoftDrop,
    doJumble, doSwap, doHold,
    pause, resume, restart,
    revive, declineRevive, grantAssist,
  };
}
