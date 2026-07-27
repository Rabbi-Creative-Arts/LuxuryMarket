interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

export default function Input(props: InputProps) {
  return (
    <input
      {...props}
      style={{
        width: "100%",
        padding: "12px 16px",
        border: "1px solid #d1d5db",
        borderRadius: "12px",
        fontSize: "16px",
        outline: "none",
        boxSizing: "border-box",
      }}
    />
  );
}