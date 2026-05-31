import { useNavigate } from 'react-router-dom';
import { Logo, Btn } from '../components';

export default function PremiumPage() {
  const navigate = useNavigate();

  return (
    <div className="pscreen" style={{ gap: 16, padding: 24, alignItems: 'center' }}>
      <div className="paywall-hero">
        <div className="paywall-title">
          <span>👑</span>
          <Logo s={30} />
        </div>
        <div className="card-sub">Premium</div>
      </div>

      <div className="premcard">
        <div className="prem-head">
          <span className="prem-crown">👑</span>
          <span className="prem-title">Go Premium</span>
        </div>
        <div className="perks">
          <div className="perk">
            <span className="pdot">🚫</span> No ads, ever
          </div>
          <div className="perk">
            <span className="pdot">🔀</span> Unlimited Jumbles
          </div>
          <div className="perk">
            <span className="pdot">🔁</span> Unlimited Swaps
          </div>
        </div>
      </div>

      <div className="oneprice">
        One-time purchase &mdash; <b>$5</b>
      </div>

      <Btn variant="gold" wide lg>
        Purchase Premium
      </Btn>
      <div className="card-sub">IAP integration coming in Phase 7</div>
      <Btn variant="ghost" wide onClick={() => navigate(-1)}>
        Back
      </Btn>
    </div>
  );
}
