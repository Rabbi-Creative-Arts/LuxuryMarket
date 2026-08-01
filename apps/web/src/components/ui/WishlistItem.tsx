import Image from "next/image";
import Button from "./Button";
import Rating from "./Rating";
import Price from "./Price";

interface WishlistItemProps {
  image: string;
  title: string;
  price: number;
  originalPrice?: number;
  rating: number;
  onMoveToCart?: () => void;
  onRemove?: () => void;
  className?: string;
}

export default function WishlistItem({
  image,
  title,
  price,
  originalPrice,
  rating,
  onMoveToCart,
  onRemove,
  className = "",
}: WishlistItemProps) {
  return (
    <div
      className={`flex items-center gap-4 rounded-xl border p-4 ${className}`}
    >
      <Image
        src={image}
        alt={title}
        width={100}
        height={100}
        className="rounded-lg object-cover"
      />

      <div className="flex-1 space-y-2">
        <h3 className="font-semibold">{title}</h3>

        <Rating value={rating} />

        <Price
          price={price}
          originalPrice={originalPrice}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Button onClick={onMoveToCart}>
          Move to Cart
        </Button>

        <Button
          variant="outline"
          onClick={onRemove}
        >
          Remove
        </Button>
      </div>
    </div>
  );
}
