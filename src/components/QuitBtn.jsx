/**
 * Quit / close button — a muted white candy chip with a stroked X.
 * Sits in the top-right of the v2 in-game layout.
 */
export default function QuitBtn({ onClick }) {
  return (
    <button className="ig-quit" aria-label="Quit game" onClick={onClick}>
      <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
        <path
          d="M3.5 3.5 L12.5 12.5 M12.5 3.5 L3.5 12.5"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
      </svg>
    </button>
  );
}
