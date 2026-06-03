import { VOWEL_INTERVAL } from './config';

// Weighted letter frequencies based on English language occurrence.
// Higher weight = more common = appears more often in the pool.
const WEIGHTS = {
  A: 8.2, B: 1.5, C: 2.8, D: 4.3, E: 12.7, F: 2.2,
  G: 2.0, H: 6.1, I: 7.0, J: 0.15, K: 0.77, L: 4.0,
  M: 2.4, N: 6.7, O: 7.5, P: 1.9, Q: 0.10, R: 6.0,
  S: 6.3, T: 9.1, U: 2.8, V: 0.98, W: 2.4, X: 0.15,
  Y: 2.0, Z: 0.07,
};

const VOWELS = new Set(['A', 'E', 'I', 'O', 'U']);

const pool = [];
const vowelPool = [];
const totalWeight = Object.values(WEIGHTS).reduce((a, b) => a + b, 0);

for (const [letter, weight] of Object.entries(WEIGHTS)) {
  const count = Math.max(1, Math.round((weight / totalWeight) * 1000));
  for (let i = 0; i < count; i++) {
    pool.push(letter);
    if (VOWELS.has(letter)) vowelPool.push(letter);
  }
}

export function randomLetter() {
  return pool[Math.floor(Math.random() * pool.length)];
}

function randomVowel() {
  return vowelPool[Math.floor(Math.random() * vowelPool.length)];
}

// Tracks consecutive consonants across fills so the guarantee spans calls
let consonantRun = 0;

export function fillNextQueue(queue, count) {
  const q = [...queue];
  while (q.length < count) {
    // If we've had VOWEL_INTERVAL-1 consonants in a row, force a vowel
    if (consonantRun >= VOWEL_INTERVAL - 1) {
      const v = randomVowel();
      q.push(v);
      consonantRun = 0;
    } else {
      const L = randomLetter();
      q.push(L);
      consonantRun = VOWELS.has(L) ? 0 : consonantRun + 1;
    }
  }
  return q;
}

/** Reset the vowel tracking (call on game restart) */
export function resetVowelTracking() {
  consonantRun = 0;
}
