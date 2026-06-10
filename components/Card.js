export default function Card({ children }) {
  return (
    <div
      style={{
        background: "#FFFFFF",
        borderRadius: 20,
        padding: 20,
        border: "1px solid #E7DFDC",
        boxShadow: "0 6px 18px rgba(0,0,0,0.04)",
      }}
    >
      {children}
    </div>
  );
}
