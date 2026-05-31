import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Logo, Btn } from '../components';

export default function HomePage() {
  const navigate = useNavigate();
  const { displayName } = useSelector((state) => state.profile);
  const { bestScore, isPremium, hasPlayedBefore } = useSelector(
    (state) => state.settings
  );

  const handleNewGame = () => {
    navigate(hasPlayedBefore ? '/play' : '/tutorial');
  };

  return (
    <div className="pscreen home">
      <div className="home-top">
        <div />
        <div
          className="avatar"
          onClick={() => navigate('/profile')}
          style={{ cursor: 'pointer' }}
        >
          {displayName?.[0]?.toUpperCase() || '?'}
        </div>
      </div>

      <div className="home-hero">
        <Logo s={52} />
        <div className="welcome">Welcome back, {displayName || 'Player'}!</div>
        <div className="bestchip">
          <span className="k">Best</span>
          {bestScore.toLocaleString()}
        </div>
      </div>

      <div className="menu-btns">
        <Btn variant="primary" wide lg onClick={handleNewGame}>
          New Game
        </Btn>
        <Btn variant="ghost" wide onClick={() => navigate('/scores')}>
          High Scores
        </Btn>
        {!isPremium && (
          <Btn variant="gold" wide onClick={() => navigate('/premium')}>
            Go Premium
          </Btn>
        )}
      </div>
    </div>
  );
}
