import type { ReactNode } from "react";

interface TextProps {
  children: ReactNode;
  className?: string;
}

export default function Text({
  children,
  className = "",
}: TextProps) {
  return (
    <p className={`text-base leading-7 text-gray-600 ${className}`}>
      {children}
    </p>
  );
}
