import { ButtonHTMLAttributes } from "react";

interface DropdownItemProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {}

export default function DropdownItem({
  children,
  className = "",
  ...props
}: DropdownItemProps) {
  return (
    <button
      className={`
        w-full
        px-4
        py-3
        text-left
        text-sm
        hover:bg-gray-100
        transition-colors
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}