import { isWord } from './dictionary';
import { MIN_WORD_LENGTH, COLS, ROWS } from './config';
import { LETTER_VALUES } from '../constants/letters';
import {
  LENGTH_BONUS_THRESHOLD,
  LENGTH_BONUS_PER_CHAR,
} from './config';

// Extracts all contiguous letter spans from a line of cells.
// Each span is { word, cells: [[r,c], ...] }.
function extractSpans(cells) {
  const spans = [];
  let run = [];
  for (const [r, c, letter] of cells) {
    if (letter != null) {
      run.push([r, c, letter]);
    } else {
      if (run.length >= MIN_WORD_LENGTH) spans.push(run);
      run = [];
    }
  }
  if (run.length >= MIN_WORD_LENGTH) spans.push(run);
  return spans;
}

// Finds all valid words within a contiguous span of letters.
// Checks every substring of length >= MIN_WORD_LENGTH,
// and returns only the longest non-overlapping matches.
function findWordsInSpan(span) {
  const results = [];

  // Check all substrings, longest first
  for (let len = span.length; len >= MIN_WORD_LENGTH; len--) {
    for (let start = 0; start <= span.length - len; start++) {
      const slice = span.slice(start, start + len);
      const word = slice.map(([, , l]) => l).join('').toLowerCase();
      if (isWord(word)) {
        const cells = slice.map(([r, c]) => [r, c]);
        // Check this word doesn't overlap with an already-found longer word
        const overlaps = results.some((prev) =>
          prev.cells.some(([pr, pc]) =>
            cells.some(([cr, cc]) => pr === cr && pc === cc)
          )
        );
        if (!overlaps) {
          results.push({ word, cells, score: scoreWord(slice) });
        }
      }
    }
  }

  return results;
}

function scoreWord(slice) {
  let base = 0;
  for (const [, , letter] of slice) {
    base += LETTER_VALUES[letter] || 1;
  }
  const len = slice.length;
  if (len > LENGTH_BONUS_THRESHOLD) {
    const bonus = 1 + (len - LENGTH_BONUS_THRESHOLD) * LENGTH_BONUS_PER_CHAR;
    base = Math.round(base * bonus);
  }
  return base;
}

// Scans the entire grid for valid words.
// Returns an array of { word, cells: [[r,c],...], score }.
export function scanGrid(grid) {
  const allWords = [];

  // Rows: left-to-right only
  for (let r = 0; r < ROWS; r++) {
    const line = [];
    for (let c = 0; c < COLS; c++) {
      line.push([r, c, grid[r][c]]);
    }
    const spans = extractSpans(line);
    for (const span of spans) {
      allWords.push(...findWordsInSpan(span));
    }
  }

  // Columns: top-to-bottom
  for (let c = 0; c < COLS; c++) {
    const line = [];
    for (let r = 0; r < ROWS; r++) {
      line.push([r, c, grid[r][c]]);
    }
    const spans = extractSpans(line);
    for (const span of spans) {
      allWords.push(...findWordsInSpan(span));
    }
  }

  // Columns: bottom-to-top
  for (let c = 0; c < COLS; c++) {
    const line = [];
    for (let r = ROWS - 1; r >= 0; r--) {
      line.push([r, c, grid[r][c]]);
    }
    const spans = extractSpans(line);
    for (const span of spans) {
      // Deduplicate against T→B words already found
      const found = findWordsInSpan(span);
      for (const w of found) {
        const isDupe = allWords.some(
          (prev) =>
            prev.cells.length === w.cells.length &&
            prev.cells.every(([pr, pc], i) => pr === w.cells[i][0] && pc === w.cells[i][1])
        );
        if (!isDupe) allWords.push(w);
      }
    }
  }

  return allWords;
}

// Creates a key for a word's cell set (for grace timer tracking)
export function wordKey(cells) {
  return cells.map(([r, c]) => `${r},${c}`).sort().join('|');
}

// Checks if word B is an extension of word A (same axis, superset of cells)
export function isExtension(oldCells, newCells) {
  if (newCells.length <= oldCells.length) return false;
  return oldCells.every(([or, oc]) =>
    newCells.some(([nr, nc]) => nr === or && nc === oc)
  );
}
