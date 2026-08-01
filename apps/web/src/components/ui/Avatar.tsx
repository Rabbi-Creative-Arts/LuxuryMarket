interface AvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export default function Avatar({
  src,
  alt = "Avatar",
  name = "",
  size = "md",
  className = "",
}: AvatarProps) {
  const sizes = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-14 w-14 text-base",
    xl: "h-20 w-20 text-xl",
  };

  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        className={`
          rounded-full
          object-cover
          ${sizes[size]}
          ${className}
        `}
      />
    );
  }

  return (
    <div
      className={`
        flex
        items-center
        justify-center
        rounded-full
        bg-gray-200
        font-semibold
        text-gray-700
        ${sizes[size]}
        ${className}
      `}
    >
      {initials || "?"}
    </div>
  );
}
