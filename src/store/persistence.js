const STORAGE_KEY = 'lettrdrop_state';

const PERSISTED_SLICES = ['session', 'profile', 'settings'];

export function loadPersistedState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return undefined;
    const parsed = JSON.parse(raw);
    const result = {};
    for (const key of PERSISTED_SLICES) {
      if (parsed[key]) result[key] = parsed[key];
    }
    return Object.keys(result).length > 0 ? result : undefined;
  } catch {
    return undefined;
  }
}

export function createPersistenceMiddleware() {
  let debounceTimer = null;
  return (store) => (next) => (action) => {
    const result = next(action);
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      const state = store.getState();
      const toPersist = {};
      for (const key of PERSISTED_SLICES) {
        toPersist[key] = state[key];
      }
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(toPersist));
      } catch {
        // storage full or unavailable
      }
    }, 300);
    return result;
  };
}
