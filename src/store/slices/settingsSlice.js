import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isPremium: false,
  bestScore: 0,
  hasPlayedBefore: false,
  soundEnabled: true,
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setPremium(state, action) {
      state.isPremium = action.payload;
    },
    setBestScore(state, action) {
      state.bestScore = action.payload;
    },
    setHasPlayedBefore(state, action) {
      state.hasPlayedBefore = action.payload;
    },
    setSoundEnabled(state, action) {
      state.soundEnabled = action.payload;
    },
    hydrate(state, action) {
      return { ...state, ...action.payload };
    },
  },
});

export const {
  setPremium,
  setBestScore,
  setHasPlayedBefore,
  setSoundEnabled,
  hydrate,
} = settingsSlice.actions;
export default settingsSlice.reducer;
