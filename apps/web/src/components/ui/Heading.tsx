import { ReactNode } from "react";

interface HeadingProps {
  children: ReactNode;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  className?: string;
}

export default function Heading({
  children,
  level = 2,
  className = "",
}: HeadingProps) {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;

  return (
    <Tag
      className={`font-bold tracking-tight text-gray-900 ${className}`}
    >
      {children}
    </Tag>
  );
}