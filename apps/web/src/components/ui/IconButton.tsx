import type { ButtonHTMLAttributes, ReactNode } from "react";

interface IconButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  label: string;
  size?: "sm" | "md" | "lg";
}

export default function IconButton({
  icon,
  label,
  size = "md",
  className = "",
  ...props
}: IconButtonProps) {
  const sizes = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  };

  return (
    <button
      aria-label={label}
      className={`
        inline-flex
        items-center
        justify-center
        rounded-full
        border
        border-gray-300
        bg-white
        text-gray-700
        transition
        hover:bg-gray-100
        focus:outline-none
        focus:ring-2
        focus:ring-blue-500
        ${sizes[size]}
        ${className}
      `}
      {...props}
    >
      {icon}
    </button>
  );
}
