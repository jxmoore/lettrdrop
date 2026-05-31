import { tileVars } from '../constants/letters';

export default function MiniTile({ L, up = false }) {
  return (
    <div className={`mini-tile${up ? ' up' : ''}`} style={tileVars(L)}>
      {L}
    </div>
  );
}
