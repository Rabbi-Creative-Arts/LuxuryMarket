type ProductBadgeVariant =
  | "new"
  | "sale"
  | "hot"
  | "bestSeller"
  | "freeShipping"
  | "inStock"
  | "outOfStock"
  | "limited";

interface ProductBadgeProps {
  variant: ProductBadgeVariant;
  className?: string;
}

const badgeStyles: Record<ProductBadgeVariant, string> = {
  new: "bg-blue-100 text-blue-700",
  sale: "bg-red-100 text-red-700",
  hot: "bg-orange-100 text-orange-700",
  bestSeller: "bg-yellow-100 text-yellow-800",
  freeShipping: "bg-green-100 text-green-700",
  inStock: "bg-emerald-100 text-emerald-700",
  outOfStock: "bg-gray-200 text-gray-700",
  limited: "bg-purple-100 text-purple-700",
};

const badgeLabels: Record<ProductBadgeVariant, string> = {
  new: "New",
  sale: "Sale",
  hot: "Hot",
  bestSeller: "Best Seller",
  freeShipping: "Free Shipping",
  inStock: "In Stock",
  outOfStock: "Out of Stock",
  limited: "Limited",
};

export default function ProductBadge({
  variant,
  className = "",
}: ProductBadgeProps) {
  return (
    <span
      className={`
        inline-flex
        items-center
        rounded-full
        px-3
        py-1
        text-xs
        font-semibold
        ${badgeStyles[variant]}
        ${className}
      `}
    >
      {badgeLabels[variant]}
    </span>
  );
}