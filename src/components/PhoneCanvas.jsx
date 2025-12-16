import "./PhoneCanvas.css";

export default function PhoneCanvas({ children }) {
  return (
    <div className="stage">
      <div className="phone">{children}</div>
    </div>
  );
}
