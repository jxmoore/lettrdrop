import { useNavigate } from 'react-router-dom';
import { DropInGame, Modal, Btn } from '../components';

const DEMO_GRID = [
  [null, null, null, null, null, null],
  [null, null, null, null, null, null],
  [null, null, null, null, null, null],
  [null, null, null, null, null, null],
  [null, 'D', null, null, null, 'S'],
  ['T', 'L', null, null, 'I', 'A'],
  ['A', 'I', 'O', 'R', 'H', 'N'],
  ['R', 'S', 'A', 'T', 'M', 'P'],
];

export default function PlayPage() {
  const navigate = useNavigate();

  return (
    <DropInGame
      grid={DEMO_GRID}
      active={{ r: 1, c: 3, L: 'E' }}
      ghost={{ r: 5, c: 3 }}
      next={['Q', 'U', 'A']}
      score="1,240"
      words="18"
      best="3,910"
      onPause={() => navigate('/home')}
      overlay={
        <div style={{ position: 'absolute', bottom: 20, left: 0, right: 0, textAlign: 'center' }}>
          <span
            style={{
              background: 'rgba(255,255,255,.85)',
              borderRadius: 12,
              padding: '8px 16px',
              fontSize: 13,
              fontWeight: 700,
              color: '#5a9486',
            }}
          >
            Game engine coming in Phase 4
          </span>
        </div>
      }
    />
  );
}
