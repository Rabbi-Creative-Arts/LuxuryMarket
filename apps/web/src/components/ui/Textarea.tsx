import { TextareaHTMLAttributes } from "react";

interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {}

export default function Textarea({
  className = "",
  ...props
}: TextareaProps) {
  return (
    <textarea
      className={`
        w-full
        rounded-lg
        border
        border-gray-300
        px-4
        py-3
        text-sm
        text-gray-900
        placeholder:text-gray-400
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
    />
  );
}