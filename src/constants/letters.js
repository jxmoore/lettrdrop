export const LETTER_VALUES = {
  A: 1, E: 1, I: 1, O: 1, S: 1, T: 1, R: 1, N: 1,
  L: 2, U: 2, D: 2, H: 2, C: 2,
  M: 3, P: 3, F: 3, G: 3, W: 3, Y: 3,
  B: 4, V: 4, K: 4,
  X: 5, J: 5,
  Q: 6,
  Z: 7,
};

export const VALUE_PALETTE = {
  1: { c: '#ff6f91', cl: '#ffd2dd', cd: '#d44e6e' },
  2: { c: '#ff924c', cl: '#ffd9bf', cd: '#d96b2c' },
  3: { c: '#ffc83d', cl: '#fff0c2', cd: '#e0a212' },
  4: { c: '#4cc4ff', cl: '#c8ecff', cd: '#1f97d6' },
  5: { c: '#9b8cff', cl: '#ddd6ff', cd: '#6f5de0' },
  6: { c: '#2fd6ad', cl: '#b8f5e6', cd: '#14a883' },
  7: { c: '#ff5fb0', cl: '#ffcfe8', cd: '#d63a8c' },
};

export function tileVars(letter) {
  const palette = VALUE_PALETTE[LETTER_VALUES[letter] || 1];
  return { '--c': palette.c, '--cl': palette.cl, '--cd': palette.cd };
}
