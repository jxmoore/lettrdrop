import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthHead, Btn } from '../components';
import { updateUserPassword } from '../services/auth';

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await updateUserPassword(password);
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="pscreen auth">
        <AuthHead title="Password updated!" />
        <div className="card-sub" style={{ textAlign: 'center' }}>
          Your password has been reset. You can now sign in with your new password.
        </div>
        <Btn variant="gold" wide lg onClick={() => navigate('/auth')}>
          Sign In
        </Btn>
      </div>
    );
  }

  return (
    <div className="pscreen auth">
      <AuthHead title="Set a new password" />

      <form onSubmit={handleSubmit} style={{ display: 'contents' }}>
        <input
          className="field"
          type="password"
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
          required
        />
        <input
          className="field"
          type="password"
          placeholder="Confirm new password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          autoComplete="new-password"
          required
        />

        {error && (
          <div style={{ color: '#e0567a', fontSize: 13, fontWeight: 700 }}>
            {error}
          </div>
        )}

        <Btn variant="gold" wide type="submit" disabled={loading}>
          {loading ? 'Resetting...' : 'Reset password'}
        </Btn>
      </form>

      <div className="fineprint">Use at least 8 characters.</div>
    </div>
  );
}
