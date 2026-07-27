interface PriceProps {
  price: number;
  originalPrice?: number;
  currency?: string;
  className?: string;
}

export default function Price({
  price,
  originalPrice,
  currency = "$",
  className = "",
}: PriceProps) {
  const discount =
    originalPrice && originalPrice > price
      ? Math.round(
          ((originalPrice - price) / originalPrice) * 100
        )
      : null;

  return (
    <div
      className={`flex items-center gap-2 flex-wrap ${className}`}
    >
      <span className="text-2xl font-bold text-green-600">
        {currency}
        {price.toFixed(2)}
      </span>

      {originalPrice && originalPrice > price && (
        <>
          <span className="text-gray-500 line-through">
            {currency}
            {originalPrice.toFixed(2)}
          </span>

          <span className="rounded bg-red-100 px-2 py-1 text-sm font-semibold text-red-600">
            -{discount}%
          </span>
        </>
      )}
    </div>
  );
}