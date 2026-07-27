import { InputHTMLAttributes } from "react";

interface CheckboxProps
  extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export default function Checkbox({
  label,
  className = "",
  ...props
}: CheckboxProps) {
  return (
    <label className="inline-flex items-center gap-3 cursor-pointer">
      <input
        type="checkbox"
        className={`
          h-4
          w-4
          rounded
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