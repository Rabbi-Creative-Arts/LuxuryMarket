import type { ReactNode } from "react";

interface StackProps {
  children: ReactNode;
  className?: string;
  gap?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12;
}

export default function Stack({
  children,
  className = "",
  gap = 4,
}: StackProps) {
  const gaps = {
    0: "space-y-0",
    1: "space-y-1",
    2: "space-y-2",
    3: "space-y-3",
    4: "space-y-4",
    5: "space-y-5",
    6: "space-y-6",
    8: "space-y-8",
    10: "space-y-10",
    12: "space-y-12",
  };

  return (
    <div
      className={`
        ${gaps[gap]}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
