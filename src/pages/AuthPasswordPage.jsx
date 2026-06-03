import { useState } from 'react';
import { AuthHead, Btn, Modal } from '../components';
import { signIn, resetPasswordForEmail } from '../services/auth';

export default function AuthPasswordPage({
  email,
  onBack,
  onSuccess,
}) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);
  const [sendingReset, setSendingReset] = useState(false);

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

  const handleForgotPassword = async () => {
    setSendingReset(true);
    try {
      await resetPasswordForEmail(email);
      setForgotSent(true);
    } catch {
      setError('Failed to send reset email. Try again.');
    }
    setSendingReset(false);
  };

  const handleResend = async () => {
    setSendingReset(true);
    try {
      await resetPasswordForEmail(email);
    } catch {
      // Silently fail
    }
    setSendingReset(false);
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

        <Btn variant="gold" wide type="submit" disabled={loading}>
          {loading ? 'Signing in...' : 'Log in'}
        </Btn>
      </form>

      <span
        className="forgot"
        style={{ cursor: 'pointer' }}
        onClick={handleForgotPassword}
      >
        {sendingReset ? 'Sending...' : 'Forgot password?'}
      </span>

      {/* Forgot password confirmation modal */}
      {forgotSent && (
        <Modal>
          <div style={{ fontSize: 48 }}>✉️</div>
          <div className="card-title">Check your email</div>
          <div className="card-sub">
            We sent a password reset link to<br />
            <b style={{ color: '#1f6f57' }}>{email}</b>
          </div>
          <Btn variant="gold" wide lg onClick={() => setForgotSent(false)}>
            Got it
          </Btn>
          <div
            className="skiplink"
            style={{ cursor: 'pointer' }}
            onClick={handleResend}
          >
            {sendingReset ? 'Sending...' : 'Resend email'}
          </div>
        </Modal>
      )}
    </div>
  );
}
