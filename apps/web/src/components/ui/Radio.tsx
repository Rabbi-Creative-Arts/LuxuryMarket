import type { InputHTMLAttributes } from "react";

interface RadioProps
  extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export default function Radio({
  label,
  className = "",
  ...props
}: RadioProps) {
  return (
    <label className="inline-flex items-center gap-3 cursor-pointer">
      <input
        type="radio"
        className={`
          h-4
          w-4
          border-gray-300
          text-blue-600
          focus:ring-2
          focus:ring-blue-500
          ${className}
        `}
        {...props}
      />

      {label && (
        <span className="text-sm text-gray-700">
          {label}
        </span>
      )}
    </label>
  );
}
