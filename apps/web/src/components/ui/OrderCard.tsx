import Button from "./Button";
import Price from "./Price";
import ProductBadge from "./ProductBadge";

type OrderStatus =
  | "Pending"
  | "Processing"
  | "Shipped"
  | "Delivered"
  | "Cancelled";

interface OrderCardProps {
  orderNumber: string;
  orderDate: string;
  total: number;
  status: OrderStatus;
  itemCount: number;
  onViewDetails?: () => void;
  className?: string;
}

const statusToBadge = {
  Pending: "limited",
  Processing: "hot",
  Shipped: "freeShipping",
  Delivered: "inStock",
  Cancelled: "outOfStock",
} as const;

export default function OrderCard({
  orderNumber,
  orderDate,
  total,
  status,
  itemCount,
  onViewDetails,
  className = "",
}: OrderCardProps) {
  return (
    <div
      className={`rounded-xl border p-6 shadow-sm ${className}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500">
            Order #{orderNumber}
          </p>

          <h3 className="mt-1 text-lg font-semibold">
            {itemCount} Item{itemCount !== 1 ? "s" : ""}
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            {orderDate}
          </p>
        </div>

        <ProductBadge
          variant={statusToBadge[status]}
        />
      </div>

      <div className="mt-6 flex items-center justify-between">
        <Price price={total} />

        <Button onClick={onViewDetails}>
          View Details
        </Button>
      </div>
    </div>
  );
}