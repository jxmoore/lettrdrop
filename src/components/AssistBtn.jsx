export default function AssistBtn({
  label,
  variant = '',
  depleted = false,
  badge = null,
  badgeAd = false,
  children,
  onClick,
}) {
  const cls = ['iconbtn', variant, depleted && 'depleted']
    .filter(Boolean)
    .join(' ');

  return (
    <div className="assist">
      <button className={cls} onClick={onClick}>
        {children}
        {badge != null && (
          <span className={`badge${badgeAd ? ' ad' : ''}`}>{badge}</span>
        )}
      </button>
      <span className="lab">{label}</span>
    </div>
  );
}
