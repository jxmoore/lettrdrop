import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  token: null,
  userId: null,
  isAuthenticated: false,
};

const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    setSession(state, action) {
      state.token = action.payload.token;
      state.userId = action.payload.userId;
      state.isAuthenticated = true;
    },
    clearSession() {
      return initialState;
    },
  },
});

export const { setSession, clearSession } = sessionSlice.actions;
export default sessionSlice.reducer;
