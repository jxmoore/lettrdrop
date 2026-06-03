import { useState, useEffect, useCallback } from 'react';
import { AuthHead, Btn } from '../components';
import { signUp, checkDisplayNameAvailable } from '../services/auth';

export default function AuthCreatePage({
  email,
  onBack,
  onSuccess,
}) {
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [nameStatus, setNameStatus] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const checkName = useCallback(async (name) => {
    if (name.length < 2) {
      setNameStatus(null);
      return;
    }
    setNameStatus('checking');
    try {
      const available = await checkDisplayNameAvailable(name);
      setNameStatus(available ? 'ok' : 'taken');
    } catch {
      setNameStatus(null);
    }
  }, []);

  useEffect(() => {
    const trimmed = displayName.trim();
    if (trimmed.length < 2) {
      setNameStatus(null);
      return;
    }
    const timer = setTimeout(() => checkName(trimmed), 400);
    return () => clearTimeout(timer);
  }, [displayName, checkName]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedName = displayName.trim();
    if (!trimmedName || !password || nameStatus !== 'ok') return;

    setError('');
    setLoading(true);
    try {
      await signUp({ email, password, displayName: trimmedName });
      onSuccess();
    } catch (err) {
      if (err.message?.includes('duplicate key')) {
        setNameStatus('taken');
      } else if (err.message?.includes('already been registered')) {
        setError('This email is already registered. Try signing in instead.');
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const canSubmit =
    displayName.trim().length >= 2 &&
    password.length >= 6 &&
    nameStatus === 'ok' &&
    !loading;

  return (
    <div className="pscreen auth">
      <AuthHead title="Create your account" />

      <div className="email-chip">
        <span className="em">{email}</span>
        <a onClick={onBack}>Change</a>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'contents' }}>
        <input
          className="field"
          type="text"
          placeholder="Display name (e.g. Jordan S.)"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          autoComplete="username"
          maxLength={20}
          required
        />

        {nameStatus === 'ok' && (
          <div className="avail ok">&#10003; Name available</div>
        )}
        {nameStatus === 'taken' && (
          <div className="avail no">&#10007; Name taken</div>
        )}
        {nameStatus === 'checking' && (
          <div className="avail" style={{ color: '#80bba8' }}>
            Checking...
          </div>
        )}

        <input
          className="field"
          type="password"
          placeholder="Create a password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
          minLength={6}
          required
        />

        {error && (
          <div style={{ color: '#e0567a', fontSize: 13, fontWeight: 700 }}>
            {error}
          </div>
        )}

        <Btn variant="gold" wide type="submit" disabled={!canSubmit}>
          {loading ? 'Creating...' : 'Create account'}
        </Btn>
      </form>

      <div className="fineprint">
        No account for that email yet &mdash; let&apos;s set one up.
      </div>
    </div>
  );
}
