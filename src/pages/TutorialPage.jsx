import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setHasPlayedBefore } from '../store/slices/settingsSlice';
import { updateProfile } from '../services/auth';
import {
  Logo,
  Btn,
  TutoFrame,
  TutoClear,
  TutoMove,
  TutoSwap,
  TutoJumble,
} from '../components';

const STEPS = [
  {
    type: 'cover',
  },
  {
    title: 'Spell a word to clear it',
    desc: 'Line up a real word across a row or down a column and it lights up. Add a letter to make it longer for more points — when you can’t extend it, it pops.',
    cta: 'Next ›',
    Demo: TutoClear,
  },
  {
    title: 'Steer the falling tile',
    desc: 'The tile falls on its own — drag left or right to move it, and double-tap to drop it faster. Double-tap another column to shift there and drop.',
    cta: 'Next ›',
    Demo: TutoMove,
  },
  {
    title: 'Swap a letter you can’t place',
    desc: 'Stuck with a tricky Q or Z? Tap Swap to trade the falling tile for a fresh random letter — two free every game.',
    cta: 'Next ›',
    Demo: TutoSwap,
  },
  {
    title: 'Jumble for a fresh board',
    desc: 'In a jam? Jumble sweeps every landed letter into new columns to open things up. Three per game.',
    cta: 'Let’s play ▶',
    Demo: TutoJumble,
  },
];

export default function TutorialPage() {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userId } = useSelector((state) => state.session);

  const finish = () => {
    dispatch(setHasPlayedBefore(true));
    updateProfile(userId, { has_played_before: true });
    navigate('/play');
  };

  const handleNext = () => {
    if (step < STEPS.length - 1) setStep(step + 1);
    else finish();
  };

  const current = STEPS[step];

  if (current.type === 'cover') {
    return (
      <div className="pscreen tuto cover">
        <div style={{ flex: 1 }} />
        <div className="tuto-cover-art"><Logo s={42} /></div>
        <div className="tuto-cap" style={{ marginTop: 18 }}>
          <div className="tuto-title">Welcome! 👋</div>
          <div className="tuto-desc">New here? Here&apos;s the 30-second rundown on how to play.</div>
        </div>
        <div style={{ flex: 1 }} />
        <Btn variant="primary" wide lg onClick={handleNext}>Show me how ›</Btn>
        <div className="skiplink" style={{ alignSelf: 'center' }} onClick={finish}>
          I&apos;ve played before — skip
        </div>
      </div>
    );
  }

  return (
    <TutoFrame
      step={step - 1}
      total={STEPS.length - 1}
      title={current.title}
      desc={current.desc}
      cta={current.cta}
      onNext={handleNext}
      onSkip={finish}
    >
      <current.Demo />
    </TutoFrame>
  );
}
