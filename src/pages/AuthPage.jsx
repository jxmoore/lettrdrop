import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthHead, Btn } from '../components';
import AuthPasswordPage from './AuthPasswordPage';
import AuthCreatePage from './AuthCreatePage';

const STEP_EMAIL = 'email';
const STEP_SIGNIN = 'signin';
const STEP_CREATE = 'create';

export default function AuthPage() {
  const [step, setStep] = useState(STEP_EMAIL);
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleContinue = (e) => {
    e.preventDefault();
    const trimmed = email.trim().toLowerCase();
    if (!trimmed) return;
    setEmail(trimmed);
    setStep(STEP_SIGNIN);
  };

  const handleBack = () => {
    setStep(STEP_EMAIL);
  };

  if (step === STEP_SIGNIN) {
    return (
      <AuthPasswordPage
        email={email}
        onBack={handleBack}
        onCreateInstead={() => setStep(STEP_CREATE)}
        onSuccess={() => navigate('/home')}
      />
    );
  }

  if (step === STEP_CREATE) {
    return (
      <AuthCreatePage
        email={email}
        onBack={handleBack}
        onSignInInstead={() => setStep(STEP_SIGNIN)}
        onSuccess={() => navigate('/home')}
      />
    );
  }

  return (
    <div className="pscreen auth">
      <AuthHead title="Sign in to play" />

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
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
        />

        <Btn variant="primary" wide type="submit">
          Continue with Email
        </Btn>
      </form>

      <div className="fineprint">
        By continuing you agree to the{' '}
        <a href="#">Terms of Service</a> and{' '}
        <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
