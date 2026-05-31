import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  displayName: '',
  email: '',
  avatarInitial: '',
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setProfile(state, action) {
      return { ...state, ...action.payload };
    },
    clearProfile() {
      return initialState;
    },
  },
});

export const { setProfile, clearProfile } = profileSlice.actions;
export default profileSlice.reducer;
