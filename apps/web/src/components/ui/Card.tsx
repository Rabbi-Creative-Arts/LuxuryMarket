import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export default function Card({
  children,
  className = "",
}: CardProps) {
  return (
    <div
      className={`rounded-2xl border border-gray-200 bg-white p-6 shadow-md ${className}`}
    >
      {children}
    </div>
  );
}
