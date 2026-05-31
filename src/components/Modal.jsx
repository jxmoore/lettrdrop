export default function Modal({ children }) {
  return (
    <div className="overlay dim">
      <div className="card">{children}</div>
    </div>
  );
}
