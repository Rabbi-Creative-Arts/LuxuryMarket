import { InputHTMLAttributes } from "react";

interface SwitchProps
  extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export default function Switch({
  label,
  className = "",
  ...props
}: SwitchProps) {
  return (
    <label className="inline-flex items-center gap-3 cursor-pointer">
      <input
        type="checkbox"
        role="switch"
        className={`
          h-5
          w-10
          appearance-none
          rounded-full
          bg-gray-300
          transition
          checked:bg-blue-600
          relative
          before:absolute
          before:left-0.5
          before:top-0.5
          before:h-4
          before:w-4
          before:rounded-full
          before:bg-white
          before:transition-transform
          checked:before:translate-x-5
          focus:outline-none
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