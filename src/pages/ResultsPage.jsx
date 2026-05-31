import { useNavigate } from 'react-router-dom';
import { Logo, Btn } from '../components';

export default function ResultsPage() {
  const navigate = useNavigate();

  return (
    <div className="pscreen celebrate">
      <Logo s={30} />
      <div className="card-title">Stacked Out!</div>
      <div className="result-score">1,240</div>
      <div className="card-sub">Game results coming in Phase 5</div>
      <div className="nhs-actions">
        <Btn variant="primary" wide onClick={() => navigate('/play')}>
          Play Again
        </Btn>
        <Btn variant="ghost" wide onClick={() => navigate('/home')}>
          Home
        </Btn>
      </div>
    </div>
  );
}
