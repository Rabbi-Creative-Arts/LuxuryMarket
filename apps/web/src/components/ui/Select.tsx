import type { SelectHTMLAttributes } from "react";

interface SelectProps
  extends SelectHTMLAttributes<HTMLSelectElement> {}

export default function Select({
  className = "",
  children,
  ...props
}: SelectProps) {
  return (
    <select
      className={`
        w-full
        rounded-lg
        border
        border-gray-300
        bg-white
        px-4
        py-3
        text-sm
        text-gray-900
        transition
        outline-none
        focus:border-blue-500
        focus:ring-2
        focus:ring-blue-500
        disabled:cursor-not-allowed
        disabled:bg-gray-100
        ${className}
      `}
      {...props}
    >
      {children}
    </select>
  );
}
