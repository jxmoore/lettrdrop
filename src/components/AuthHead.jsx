import Logo from './Logo';

export default function AuthHead({ title }) {
  return (
    <div className="auth-top">
      <div className="auth-logo-row">
        <Logo s={34} />
      </div>
      <div className="card-title auth-title">{title}</div>
    </div>
  );
}
