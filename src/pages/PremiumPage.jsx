import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Logo, Btn } from '../components';
import { setPremium } from '../store/slices/settingsSlice';
import { purchasePremium, restorePurchases } from '../services/purchases';

export default function PremiumPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userId = useSelector((s) => s.session.userId);
  const isPremium = useSelector((s) => s.settings.isPremium);
  const [purchasing, setPurchasing] = useState(false);

  const [error, setError] = useState(null);

  const handlePurchase = async () => {
    setPurchasing(true);
    setError(null);
    const result = await purchasePremium(userId);
    if (result.success) {
      dispatch(setPremium(true));
    } else if (result.error !== 'cancelled') {
      setError(result.error);
    }
    setPurchasing(false);
  };

  const handleRestore = async () => {
    setPurchasing(true);
    setError(null);
    const result = await restorePurchases(userId);
    if (result.success) {
      dispatch(setPremium(true));
    } else {
      setError(result.error);
    }
    setPurchasing(false);
  };

  if (isPremium) {
    return (
      <div className="pscreen" style={{ gap: 16, padding: 24, alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: 64 }}>👑</div>
        <div className="card-title">You're Premium!</div>
        <div className="adfree-banner" style={{ maxWidth: 300 }}>
          👑 &nbsp;Premium &middot; ad-free &amp; unlimited jumbles
        </div>
        <Btn variant="ghost" wide onClick={() => navigate(-1)}>
          Back
        </Btn>
      </div>
    );
  }

  return (
    <div className="pscreen auth" style={{ justifyContent: 'flex-start', gap: 14, paddingTop: 24 }}>
      {/* Top bar: close + restore */}
      <div className="ptop" style={{ width: '100%' }}>
        <div className="skiplink" onClick={() => navigate(-1)}>✕</div>
        <div
          className="skiplink"
          style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 1.5 }}
          onClick={handleRestore}
        >
          Restore
        </div>
      </div>

      {/* Hero */}
      <div className="paywall-hero">
        <div style={{ fontSize: 46 }}>👑</div>
        <div className="paywall-title">
          <Logo s={22} />
          <span style={{ color: '#1f6f57' }}>Premium</span>
        </div>
      </div>

      {/* Perks card */}
      <div className="premcard">
        <div className="perks">
          <div className="perk"><span className="pdot">🚫</span> No ads, ever</div>
          <div className="perk"><span className="pdot">🔀</span> Unlimited jumbles</div>
          <div className="perk"><span className="pdot">🔁</span> Unlimited swaps</div>
        </div>
      </div>

      {/* Price */}
      <div className="oneprice"><b>$5</b> &nbsp;one-time</div>

      {/* Purchase button */}
      <Btn variant="gold" wide lg onClick={handlePurchase} disabled={purchasing}>
        {purchasing ? 'Processing...' : 'Unlock Premium'}
      </Btn>

      <div className="fineprint" style={{ textAlign: 'center' }}>
        One-time purchase — yours forever. No subscription.
      </div>

      {error && (
        <div className="fineprint" style={{ textAlign: 'center', color: '#c94a5e' }}>
          {error}
        </div>
      )}
    </div>
  );
}
