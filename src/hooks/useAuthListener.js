import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setSession, clearSession } from '../store/slices/sessionSlice';
import { setProfile, clearProfile } from '../store/slices/profileSlice';
import { hydrate, clearSettings } from '../store/slices/settingsSlice';
import { onAuthStateChange, getSession, getProfile } from '../services/auth';
import { identifyUser, logOutPurchases } from '../services/purchases';

export default function useAuthListener() {
  const dispatch = useDispatch();

  useEffect(() => {
    async function hydrateFromSession(session) {
      if (!session) {
        dispatch(clearSession());
        dispatch(clearProfile());
        dispatch(clearSettings());
        logOutPurchases();
        return;
      }

      const userId = session.user.id;

      dispatch(
        setSession({
          token: session.access_token,
          userId,
        })
      );

      // Reset profile + settings to defaults before hydrating from DB.
      // This prevents a previous account's data (isPremium, bestScore,
      // displayName) from leaking if the profile fetch fails (e.g. mid-signup
      // race where onAuthStateChange fires before the profiles row is inserted).
      dispatch(clearProfile());
      dispatch(clearSettings());

      // Tie RevenueCat purchases to this Supabase user
      identifyUser(userId);

      try {
        const profile = await getProfile(session.user.id);
        dispatch(
          setProfile({
            displayName: profile.display_name,
            email: profile.email,
            avatarInitial: profile.display_name?.[0]?.toUpperCase() || '?',
          })
        );
        dispatch(
          hydrate({
            isPremium: profile.is_premium,
            bestScore: profile.best_score,
            hasPlayedBefore: profile.has_played_before,
          })
        );
      } catch {
        // Profile may not exist yet (mid-signup)
      }
    }

    getSession().then(hydrateFromSession);

    const subscription = onAuthStateChange((_event, session) => {
      hydrateFromSession(session);
    });

    return () => subscription.unsubscribe();
  }, [dispatch]);
}
