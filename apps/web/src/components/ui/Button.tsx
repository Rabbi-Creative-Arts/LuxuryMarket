type ButtonVariant = "primary" | "secondary" | "outline";

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children: React.ReactNode;
}

export default function Button({
  variant = "primary",
  children,
  ...props
}: ButtonProps) {
  const styles = {
    primary: {
      backgroundColor: "#2563eb",
      color: "#ffffff",
      border: "none",
    },
    secondary: {
      backgroundColor: "#111827",
      color: "#ffffff",
      border: "none",
    },
    outline: {
      backgroundColor: "transparent",
      color: "#111827",
      border: "2px solid #111827",
    },
  };

  return (
    <button
      {...props}
      style={{
        ...styles[variant],
        padding: "12px 24px",
        borderRadius: "12px",
        cursor: "pointer",
        fontSize: "16px",
        fontWeight: 600,
        transition: "0.2s",
      }}
    >
      {children}
    </button>
  );
}
