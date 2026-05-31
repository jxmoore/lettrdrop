import { useNavigate } from 'react-router-dom';
import { Btn } from '../components';

export default function HighScoresPage() {
  const navigate = useNavigate();

  return (
    <div className="pscreen" style={{ gap: 16, padding: 24 }}>
      <div className="hs-head">
        <div className="hs-title">High Scores</div>
        <Btn variant="ghost" onClick={() => navigate('/home')}>
          Back
        </Btn>
      </div>
      <div className="hs-list">
        <div className="card-sub" style={{ textAlign: 'center', marginTop: 40 }}>
          Leaderboard coming in Phase 5
        </div>
      </div>
    </div>
  );
}
