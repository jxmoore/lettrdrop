import { tileVars } from '../constants/letters';

/**
 * HOLD panel — shows the stashed letter or an empty dashed slot.
 * Lives in the left rail of the v2 in-game layout.
 */
export default function HoldSlot({ L = null, onClick }) {
  return (
    <div className="ig-panel">
      <span className="ig-lab">Hold</span>
      {L ? (
        <div className="ig-holdslot" onClick={onClick}>
          <div className="ig-qtile" style={tileVars(L)}>{L}</div>
        </div>
      ) : (
        <div className="ig-holdslot empty" onClick={onClick} />
      )}
    </div>
  );
}
