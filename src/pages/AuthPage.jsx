import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthHead, Btn } from '../components';
import { checkEmailExists } from '../services/auth';
import AuthPasswordPage from './AuthPasswordPage';
import AuthCreatePage from './AuthCreatePage';

const STEP_EMAIL = 'email';
const STEP_SIGNIN = 'signin';
const STEP_CREATE = 'create';

export default function AuthPage() {
  const [step, setStep] = useState(STEP_EMAIL);
  const [email, setEmail] = useState('');
  const [checking, setChecking] = useState(false);
  const navigate = useNavigate();

  const handleContinue = async (e) => {
    e.preventDefault();
    const trimmed = email.trim().toLowerCase();
    if (!trimmed) return;
    setEmail(trimmed);

    setChecking(true);
    try {
      const exists = await checkEmailExists(trimmed);
      setStep(exists ? STEP_SIGNIN : STEP_CREATE);
    } catch {
      // If lookup fails, default to sign-in flow
      setStep(STEP_SIGNIN);
    }
    setChecking(false);
  };

  const handleBack = () => {
    setStep(STEP_EMAIL);
  };

  if (step === STEP_SIGNIN) {
    return (
      <AuthPasswordPage
        email={email}
        onBack={handleBack}
        onSuccess={() => navigate('/home')}
      />
    );
  }

  if (step === STEP_CREATE) {
    return (
      <AuthCreatePage
        email={email}
        onBack={handleBack}
        onSuccess={() => navigate('/home')}
      />
    );
  }

  return (
    <div className="pscreen auth">
      <AuthHead title="Log in or sign up" />

      <button className="authbtn apple" disabled>
        <span className="gl"></span> Continue with Apple
      </button>
      <button className="authbtn google" disabled>
        <span className="gl">G</span> Continue with Google
      </button>
      <button className="authbtn facebook" disabled>
        <span className="gl">f</span> Continue with Facebook
      </button>

      <div className="divider">or</div>

      <form onSubmit={handleContinue} style={{ display: 'contents' }}>
        <input
          className="field"
          type="email"
          placeholder="you@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
        />

        <Btn variant="gold" wide type="submit" disabled={checking}>
          {checking ? 'Checking...' : 'Continue'}
        </Btn>
      </form>

      <div className="fineprint" style={{ textAlign: 'center' }}>
        We'll check if you already have an account.
      </div>
    </div>
  );
}
