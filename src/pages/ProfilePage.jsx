import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { signOut, updateProfile } from '../services/auth';
import { getProfileStats } from '../services/leaderboard';
import { setPremium } from '../store/slices/settingsSlice';
import { Logo, Btn, EditNameModal } from '../components';

export default function ProfilePage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userId = useSelector((s) => s.session.userId);
  const { displayName, email, avatarInitial } = useSelector((s) => s.profile);
  const { bestScore, isPremium } = useSelector((s) => s.settings);

  const [signingOut, setSigningOut] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [mostWords, setMostWords] = useState(null);

  // Fetch most-words-per-game stat
  useEffect(() => {
    if (!userId) return;
    getProfileStats(userId)
      .then((stats) => setMostWords(stats.mostWordsPerGame))
      .catch(() => {});
  }, [userId]);

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
      {/* Top bar */}
      <div className="ptop" style={{ width: '100%' }}>
        <div className="skiplink" onClick={() => navigate(-1)}>‹ Back</div>
        <div className="plogo"><Logo s={17} /></div>
      </div>

      {/* Avatar + name + email */}
      <div className="profile-head">
        <div className={`bigavatar${isPremium ? ' prem' : ''}`}>
          {isPremium && <span className="crown">👑</span>}
          {avatarInitial || displayName?.[0]?.toUpperCase() || '?'}
        </div>
        <div className="pname">{displayName}</div>
        <div className="pemail">{email}</div>
      </div>

      {/* Display name card with Edit */}
      <div className="pcard">
        <div className="row">
          <span className="k">Display name</span>
          <span className="editlink" onClick={() => setEditingName(true)}>Edit</span>
        </div>
        <div className="v" style={{ fontSize: 18 }}>{displayName}</div>
        <div className="note">Must be unique — this is how you appear on the leaderboard.</div>
      </div>

      {/* Stats cards */}
      <div className="pcard">
        <div className="row">
          <span className="k">Best Score</span>
          <span className="v">{bestScore.toLocaleString()}</span>
        </div>
      </div>

      <div className="pcard">
        <div className="row">
          <span className="k">Most Words / Game</span>
          <span className="v">{mostWords != null ? mostWords.toLocaleString() : '—'}</span>
        </div>
      </div>

      {/* Premium card or ad-free banner */}
      {isPremium ? (
        <div className="adfree-banner">
          👑 &nbsp;LettrDrop Premium active — ad-free &amp; unlimited jumbles
        </div>
      ) : (
        <div className="premcard">
          <div className="prem-head">
            <span className="prem-crown">👑</span>
            <span className="prem-title">Go Premium</span>
          </div>
          <div className="perk" style={{ color: '#7a4a00' }}>
            No ads · Unlimited jumbles · $5 one-time
          </div>
          <Btn
            variant="gold"
            wide
            style={{ background: '#fff', color: '#b07b00', boxShadow: '0 5px 0 #e6c97a' }}
            onClick={() => navigate('/premium')}
          >
            Upgrade
          </Btn>
        </div>
      )}

      {/* DEV ONLY — Premium toggle (remove before production) */}
      <div
        className="skiplink"
        style={{ cursor: 'pointer', fontSize: 11, color: '#b0b0b0' }}
        onClick={async () => {
          const next = !isPremium;
          try {
            await updateProfile(userId, { is_premium: next });
            dispatch(setPremium(next));
          } catch { /* ignore */ }
        }}
      >
        [DEV] {isPremium ? 'Disable' : 'Enable'} Premium
      </div>

      {/* Sign out */}
      <div
        className="skiplink"
        style={{ marginTop: 'auto', color: '#c98a9a', cursor: 'pointer' }}
        onClick={handleSignOut}
      >
        {signingOut ? 'Signing out...' : 'Sign out'}
      </div>

      {/* Edit name modal */}
      {editingName && (
        <EditNameModal onClose={() => setEditingName(false)} />
      )}
    </div>
  );
}
