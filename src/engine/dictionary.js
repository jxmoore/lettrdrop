let dict = null;
let loading = null;

export async function loadDictionary() {
  if (dict) return dict;
  if (loading) return loading;

  loading = fetch('/dictionary.txt')
    .then((res) => res.text())
    .then((text) => {
      dict = new Set(text.split('\n'));
      loading = null;
      return dict;
    });

  return loading;
}

export function isWord(word) {
  if (!dict) return false;
  return dict.has(word.toLowerCase());
}

export function isDictionaryReady() {
  return dict !== null;
}
