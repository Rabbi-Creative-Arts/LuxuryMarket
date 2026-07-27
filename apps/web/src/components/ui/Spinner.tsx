interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function Spinner({
  size = "md",
  className = "",
}: SpinnerProps) {
  const sizes = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-10 w-10",
  };

  return (
    <div
      className={`
        inline-block
        animate-spin
        rounded-full
        border-4
        border-gray-300
        border-t-blue-600
        ${sizes[size]}
        ${className}
      `}
    />
  );
}