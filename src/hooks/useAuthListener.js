import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setSession, clearSession } from '../store/slices/sessionSlice';
import { setProfile, clearProfile } from '../store/slices/profileSlice';
import { hydrate } from '../store/slices/settingsSlice';
import { onAuthStateChange, getSession, getProfile } from '../services/auth';

export default function useAuthListener() {
  const dispatch = useDispatch();

  useEffect(() => {
    async function hydrateFromSession(session) {
      if (!session) {
        dispatch(clearSession());
        dispatch(clearProfile());
        return;
      }

      dispatch(
        setSession({
          token: session.access_token,
          userId: session.user.id,
        })
      );

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
