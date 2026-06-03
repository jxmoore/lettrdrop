import QTile from './QTile';

const DEFAULT_SIZES = [34, 32, 30, 28, 26, 24];

/**
 * Vertical NEXT queue — next-up tile biggest at the top, tapering down.
 * Lives in the right rail of the v2 in-game layout.
 */
export default function VNext({ items, sizes = DEFAULT_SIZES }) {
  return (
    <div className="ig-panel">
      <span className="ig-lab">Next</span>
      <div className="ig-vtrack">
        {items.map((L, i) => (
          <QTile key={i} L={L} size={sizes[i] || 24} dim={1 - i * 0.07} />
        ))}
      </div>
    </div>
  );
}
