import { ReactNode } from "react";

interface AlertProps {
  children: ReactNode;
  variant?: "success" | "error" | "warning" | "info";
  className?: string;
}

export default function Alert({
  children,
  variant = "info",
  className = "",
}: AlertProps) {
  const variants = {
    success: {
      container: "bg-green-50 border-green-200",
      text: "text-green-800",
    },
    error: {
      container: "bg-red-50 border-red-200",
      text: "text-red-800",
    },
    warning: {
      container: "bg-yellow-50 border-yellow-200",
      text: "text-yellow-800",
    },
    info: {
      container: "bg-blue-50 border-blue-200",
      text: "text-blue-800",
    },
  };

  return (
    <div
      className={`
        rounded-lg
        border
        p-4
        ${variants[variant].container}
        ${className}
      `}
      role="alert"
    >
      <p className={`text-sm font-medium ${variants[variant].text}`}>
        {children}
      </p>
    </div>
  );
}