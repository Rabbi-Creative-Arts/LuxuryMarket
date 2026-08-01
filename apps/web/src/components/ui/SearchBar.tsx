import type { InputHTMLAttributes } from "react";

interface SearchBarProps
  extends InputHTMLAttributes<HTMLInputElement> {
  placeholder?: string;
}

export default function SearchBar({
  placeholder = "Search...",
  className = "",
  ...props
}: SearchBarProps) {
  return (
    <div className="w-full">
      <input
        type="search"
        placeholder={placeholder}
        className={`
          w-full
          rounded-lg
          border
          border-gray-300
          px-4
          py-3
          text-sm
          outline-none
          transition
          focus:border-blue-500
          focus:ring-2
          focus:ring-blue-500
          ${className}
        `}
        {...props}
      />
    </div>
  );
}
