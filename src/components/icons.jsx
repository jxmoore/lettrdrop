export function JumbleIcon() {
  return (
    <svg
      className="jumble-die"
      width="26"
      height="26"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <rect x="2.5" y="2.5" width="19" height="19" rx="6.5" fill="#ff6f91" />
      <rect
        x="2.5"
        y="2.5"
        width="19"
        height="10"
        rx="6.5"
        fill="#ffffff"
        opacity="0.22"
      />
      <circle cx="7.6" cy="7.6" r="1.95" fill="#fff" />
      <circle cx="16.4" cy="7.6" r="1.95" fill="#fff" />
      <circle cx="12" cy="12" r="1.95" fill="#fff" />
      <circle cx="7.6" cy="16.4" r="1.95" fill="#fff" />
      <circle cx="16.4" cy="16.4" r="1.95" fill="#fff" />
    </svg>
  );
}

export function PauseIcon({ fill = '#fff' }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
      <rect x="5.5" y="4" width="5" height="16" rx="2.5" fill={fill} />
      <rect x="13.5" y="4" width="5" height="16" rx="2.5" fill={fill} />
    </svg>
  );
}

export function SwapIcon() {
  return (
    <svg
      className="swap-glyph"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        d="M5 9 H17.5"
        fill="none"
        stroke="#fff"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <path
        d="M14.5 6 L17.7 9 L14.5 12"
        fill="none"
        stroke="#fff"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19 15 H6.5"
        fill="none"
        stroke="#fff"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <path
        d="M9.5 12 L6.3 15 L9.5 18"
        fill="none"
        stroke="#fff"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
