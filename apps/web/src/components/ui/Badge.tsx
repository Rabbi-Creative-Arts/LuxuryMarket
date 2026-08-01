interface BadgeProps {
  children: React.ReactNode;
}

export default function Badge({ children }: BadgeProps) {
  return (
    <span
      style={{
        display: "inline-block",
        backgroundColor: "#2563eb",
        color: "#ffffff",
        padding: "4px 10px",
        borderRadius: "9999px",
        fontSize: "12px",
        fontWeight: 600,
      }}
    >
      {children}
    </span>
  );
}
