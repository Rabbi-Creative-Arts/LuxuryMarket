import Image from "next/image";
import Card from "./Card";
import Button from "./Button";
import Rating from "./Rating";
import Price from "./Price";
import ProductBadge from "./ProductBadge";

interface ProductCardProps {
  image: string;
  title: string;
  category?: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews?: number;
  badge?:
    | "new"
    | "sale"
    | "hot"
    | "bestSeller"
    | "freeShipping"
    | "inStock"
    | "outOfStock"
    | "limited";
  onAddToCart?: () => void;
}

export default function ProductCard({
  image,
  title,
  category,
  price,
  originalPrice,
  rating,
  reviews,
  badge,
  onAddToCart,
}: ProductCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="relative">
        <Image
          src={image}
          alt={title}
          width={400}
          height={400}
          className="h-64 w-full object-cover"
        />

        {badge && (
          <div className="absolute left-3 top-3">
            <ProductBadge variant={badge} />
          </div>
        )}
      </div>

      <div className="space-y-3 p-4">
        {category && (
          <p className="text-sm text-gray-500">
            {category}
          </p>
        )}

        <h3 className="line-clamp-2 text-lg font-semibold">
          {title}
        </h3>

        <div className="flex items-center gap-2">
          <Rating value={rating} />

          {reviews !== undefined && (
            <span className="text-sm text-gray-500">
              ({reviews})
            </span>
          )}
        </div>

        <Price
          price={price}
          originalPrice={originalPrice}
        />

        <Button
          className="w-full"
          onClick={onAddToCart}
        >
          Add to Cart
        </Button>
      </div>
    </Card>
  );
}
