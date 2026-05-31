import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { signOut } from '../services/auth';
import { Btn } from '../components';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { displayName, email, avatarInitial } = useSelector(
    (state) => state.profile
  );
  const { bestScore, isPremium } = useSelector((state) => state.settings);
  const [signingOut, setSigningOut] = useState(false);

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await signOut();
      navigate('/auth');
    } catch {
      setSigningOut(false);
    }
  };

  return (
    <div className="pscreen profile">
      <div className="profile-head">
        <div className={`bigavatar${isPremium ? ' prem' : ''}`}>
          {isPremium && <span className="crown">👑</span>}
          {avatarInitial || displayName?.[0]?.toUpperCase() || '?'}
        </div>
        <div className="pname">{displayName}</div>
        <div className="pemail">{email}</div>
      </div>

      <div className="pcard">
        <div className="row">
          <span className="k">Best Score</span>
          <span className="v">{bestScore.toLocaleString()}</span>
        </div>
      </div>

      {!isPremium && (
        <Btn variant="gold" wide onClick={() => navigate('/premium')}>
          Go Premium
        </Btn>
      )}

      <Btn variant="ghost" wide onClick={() => navigate('/home')}>
        Back
      </Btn>
      <Btn
        variant="ghost"
        wide
        onClick={handleSignOut}
        disabled={signingOut}
      >
        {signingOut ? 'Signing out...' : 'Sign Out'}
      </Btn>
    </div>
  );
}
