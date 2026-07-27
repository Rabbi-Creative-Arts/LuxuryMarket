import Image from "next/image";
import Button from "./Button";
import Price from "./Price";

interface CartItemProps {
  image: string;
  title: string;
  price: number;
  quantity: number;
  onIncrease?: () => void;
  onDecrease?: () => void;
  onRemove?: () => void;
  className?: string;
}

export default function CartItem({
  image,
  title,
  price,
  quantity,
  onIncrease,
  onDecrease,
  onRemove,
  className = "",
}: CartItemProps) {
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

      <div className="flex-1">
        <h3 className="font-semibold">{title}</h3>

        <Price price={price} />

        <div className="mt-3 flex items-center gap-2">
          <Button onClick={onDecrease}>−</Button>

          <span className="min-w-[2rem] text-center">
            {quantity}
          </span>

          <Button onClick={onIncrease}>+</Button>
        </div>
      </div>

      <Button onClick={onRemove}>
        Remove
      </Button>
    </div>
  );
}