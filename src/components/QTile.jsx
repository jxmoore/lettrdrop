import { tileVars } from '../constants/letters';

/**
 * Queue tile — used by VNext and HoldSlot.
 * Sized inline so NEXT can taper from large (next-up) to small (later tiles).
 */
export default function QTile({ L, size, dim = 1 }) {
  return (
    <div
      className="ig-qtile"
      style={{
        ...tileVars(L),
        width: size,
        height: Math.round(size * 1.14),
        fontSize: Math.round(size * 0.5),
        opacity: dim,
      }}
    >
      {L}
    </div>
  );
}
