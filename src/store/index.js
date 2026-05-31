import { configureStore } from '@reduxjs/toolkit';
import sessionReducer from './slices/sessionSlice';
import profileReducer from './slices/profileSlice';
import settingsReducer from './slices/settingsSlice';
import { loadPersistedState, createPersistenceMiddleware } from './persistence';

export const store = configureStore({
  reducer: {
    session: sessionReducer,
    profile: profileReducer,
    settings: settingsReducer,
  },
  preloadedState: loadPersistedState(),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(createPersistenceMiddleware()),
});
