interface LogoProps {
  size?: "sm" | "md" | "lg";
}

export default function Logo({
  size = "md",
}: LogoProps) {
  const sizes = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-4xl",
  };

  return (
    <h1
      className={`
        font-extrabold
        tracking-tight
        text-blue-600
        ${sizes[size]}
      `}
    >
      LuxuryMarket
    </h1>
  );
}
