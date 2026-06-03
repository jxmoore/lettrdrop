import { Logo, Btn } from './';

export default function TutoFrame({ step, total = 4, title, desc, cta, onNext, onSkip, children }) {
  return (
    <div className="pscreen tuto">
      <div className="tuto-head">
        <div className="plogo"><Logo s={17} /></div>
        <div className="skiplink" onClick={onSkip}>Skip</div>
      </div>
      <div className="tuto-stage">{children}</div>
      <div className="tuto-cap">
        <div className="tuto-title">{title}</div>
        <div className="tuto-desc">{desc}</div>
      </div>
      <div className="tuto-dots">
        {Array.from({ length: total }).map((_, i) => (
          <span key={i} className={`dot${i === step ? ' on' : ''}`} />
        ))}
      </div>
      <Btn variant="primary" wide lg onClick={onNext}>{cta}</Btn>
    </div>
  );
}
