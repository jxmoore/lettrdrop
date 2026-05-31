export default function Btn({
  variant = 'primary',
  wide = false,
  lg = false,
  className = '',
  children,
  ...rest
}) {
  const cls = ['btn', variant, wide && 'wide', lg && 'lg', className]
    .filter(Boolean)
    .join(' ');

  return (
    <button className={cls} {...rest}>
      {children}
    </button>
  );
}
