interface RatingProps {
  value: number;
  max?: number;
  showValue?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function Rating({
  value,
  max = 5,
  showValue = false,
  size = "md",
  className = "",
}: RatingProps) {
  const sizeClasses = {
    sm: "text-sm",
    md: "text-lg",
    lg: "text-2xl",
  };

  return (
    <div
      className={`flex items-center gap-2 ${className}`}
      aria-label={`Rating: ${value} out of ${max}`}
    >
      <div className={`flex ${sizeClasses[size]}`}>
        {Array.from({ length: max }, (_, index) => (
          <span
            key={index}
            className={
              index < Math.round(value)
                ? "text-yellow-500"
                : "text-gray-300"
            }
          >
            ★
          </span>
        ))}
      </div>

      {showValue && (
        <span className="text-sm text-gray-600">
          {value.toFixed(1)}
        </span>
      )}
    </div>
  );
}
