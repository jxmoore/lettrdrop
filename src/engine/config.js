export const ROWS = 12;
export const COLS = 6;
export const SPAWN_COL = 3;
export const NEXT_COUNT = 6;
export const MIN_WORD_LENGTH = 3;

// Grace window before a detected word commits to clearing
export const GRACE_MS = 2000;

// Danger: rocking starts when any column reaches this row (0-indexed)
export const DANGER_ROW = 1;

// Assists
export const INITIAL_JUMBLES = 3;
export const INITIAL_SWAPS = 2;
export const MAX_JUMBLES = 5;
export const WORDS_PER_RECHARGE = 15;

// Vowel guarantee: at least 1 vowel in every N tiles
export const VOWEL_INTERVAL = 3;

// Soft-drop speed multiplier (applied to current tick interval)
export const SOFT_DROP_MULTIPLIER = 0.15;

// Speed levels: each level triggered every 25 moves OR every 5 minutes
export const MOVES_PER_LEVEL = 25;
export const TIME_PER_LEVEL_MS = 5 * 60 * 1000;

// Interval in ms at each speed level (index = level)
export const SPEED_LEVELS = [
  650,  // Level 0 (start)
  550,  // Level 1  (-100)
  475,  // Level 2  (-75)
  400,  // Level 3  (-75)
  350,  // Level 4  (-50)
  300,  // Level 5  (-50)
  260,  // Level 6  (-40)
  230,  // Level 7  (-30)
  200,  // Level 8  (-30)
  180,  // Level 9  (-20)
  165,  // Level 10 (-15)
  150,  // Level 11 (-15) — floor
];

// Scoring
export const LENGTH_BONUS_THRESHOLD = 5;
export const LENGTH_BONUS_PER_CHAR = 0.2;
export const CHAIN_MULTIPLIER = 2;
