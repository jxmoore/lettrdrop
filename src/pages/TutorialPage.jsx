import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setHasPlayedBefore } from '../store/slices/settingsSlice';
import { Logo, Btn } from '../components';

export default function TutorialPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleFinish = () => {
    dispatch(setHasPlayedBefore(true));
    navigate('/play');
  };

  return (
    <div className="pscreen tuto cover">
      <Logo s={44} />
      <div className="tuto-cap">
        <div className="tuto-title">How to Play</div>
        <div className="tuto-desc">
          Letters fall into a 6-column well. Steer them left and right, and form
          words in any row or column to clear them. The longer the word, the
          bigger the score!
        </div>
      </div>
      <Btn variant="primary" wide lg onClick={handleFinish}>
        Let&apos;s Play!
      </Btn>
      <span className="skiplink" onClick={handleFinish}>
        Skip tutorial
      </span>
    </div>
  );
}
