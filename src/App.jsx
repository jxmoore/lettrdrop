import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import useAuthListener from './hooks/useAuthListener';
import { getSession } from './services/auth';
import { Logo } from './components';

import AuthPage from './pages/AuthPage';
import HomePage from './pages/HomePage';
import TutorialPage from './pages/TutorialPage';
import PlayPage from './pages/PlayPage';
import ResultsPage from './pages/ResultsPage';
import HighScoresPage from './pages/HighScoresPage';
import ProfilePage from './pages/ProfilePage';
import PremiumPage from './pages/PremiumPage';

function RequireAuth({ children }) {
  const { isAuthenticated } = useSelector((state) => state.session);
  if (!isAuthenticated) return <Navigate to="/auth" replace />;
  return children;
}

function RequireGuest({ children }) {
  const { isAuthenticated } = useSelector((state) => state.session);
  if (isAuthenticated) return <Navigate to="/home" replace />;
  return children;
}

function RootRedirect() {
  const { isAuthenticated } = useSelector((state) => state.session);
  return <Navigate to={isAuthenticated ? '/home' : '/auth'} replace />;
}

function SplashScreen() {
  return (
    <div className="pscreen" style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Logo s={52} />
    </div>
  );
}

export default function App() {
  const [ready, setReady] = useState(false);

  useAuthListener();

  useEffect(() => {
    getSession().then(() => setReady(true));
  }, []);

  if (!ready) {
    return (
      <div className="app-shell">
        <SplashScreen />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className="app-shell">
        <Routes>
          <Route
            path="/auth"
            element={
              <RequireGuest>
                <AuthPage />
              </RequireGuest>
            }
          />
          <Route
            path="/home"
            element={
              <RequireAuth>
                <HomePage />
              </RequireAuth>
            }
          />
          <Route
            path="/tutorial"
            element={
              <RequireAuth>
                <TutorialPage />
              </RequireAuth>
            }
          />
          <Route
            path="/play"
            element={
              <RequireAuth>
                <PlayPage />
              </RequireAuth>
            }
          />
          <Route
            path="/results"
            element={
              <RequireAuth>
                <ResultsPage />
              </RequireAuth>
            }
          />
          <Route
            path="/scores"
            element={
              <RequireAuth>
                <HighScoresPage />
              </RequireAuth>
            }
          />
          <Route
            path="/profile"
            element={
              <RequireAuth>
                <ProfilePage />
              </RequireAuth>
            }
          />
          <Route
            path="/premium"
            element={
              <RequireAuth>
                <PremiumPage />
              </RequireAuth>
            }
          />
          <Route path="*" element={<RootRedirect />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
