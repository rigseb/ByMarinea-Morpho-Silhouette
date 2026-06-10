export default function Input({ value, onChange, placeholder }) {
  return (
    <input
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      style={{
        width: "100%",
        padding: 10,
        borderRadius: 10,
        border: "1px solid #ccc",
        fontSize: 14,
      }}
    />
  );
}
