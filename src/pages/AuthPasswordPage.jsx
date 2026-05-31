import { useState } from 'react';
import { AuthHead, Btn } from '../components';
import { signIn } from '../services/auth';

export default function AuthPasswordPage({
  email,
  onBack,
  onCreateInstead,
  onSuccess,
}) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password) return;

    setError('');
    setLoading(true);
    try {
      await signIn({ email, password });
      onSuccess();
    } catch (err) {
      setError(
        err.message === 'Invalid login credentials'
          ? 'Wrong password or no account with this email.'
          : err.message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pscreen auth">
      <AuthHead title="Welcome back!" />

      <div className="email-chip">
        <span className="em">{email}</span>
        <a onClick={onBack}>Change</a>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'contents' }}>
        <input
          className="field"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
        />

        {error && (
          <div style={{ color: '#e0567a', fontSize: 13, fontWeight: 700 }}>
            {error}
          </div>
        )}

        <Btn variant="primary" wide type="submit" disabled={loading}>
          {loading ? 'Signing in...' : 'Sign In'}
        </Btn>
      </form>

      <span className="forgot">Forgot password?</span>

      <div className="auth-switch">
        Don&apos;t have an account?{' '}
        <a onClick={onCreateInstead}>Create one</a>
      </div>
    </div>
  );
}
