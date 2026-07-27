import Image from "next/image";
import Button from "./Button";
import Rating from "./Rating";
import Badge from "./Badge";

interface VendorCardProps {
  logo: string;
  name: string;
  rating: number;
  products: number;
  followers?: number;
  verified?: boolean;
  onVisitStore?: () => void;
  className?: string;
}

export default function VendorCard({
  logo,
  name,
  rating,
  products,
  followers,
  verified = false,
  onVisitStore,
  className = "",
}: VendorCardProps) {
  return (
    <div
      className={`rounded-xl border bg-white p-6 shadow-sm ${className}`}
    >
      <div className="flex flex-col items-center text-center">
        <Image
          src={logo}
          alt={name}
          width={80}
          height={80}
          className="rounded-full object-cover"
        />

        <div className="mt-4 flex items-center gap-2">
          <h3 className="text-lg font-semibold">
            {name}
          </h3>

          {verified && (
            <Badge>
              ✔ Verified
            </Badge>
          )}
        </div>

        <div className="mt-3">
          <Rating
            value={rating}
            showValue
          />
        </div>

        <div className="mt-4 text-sm text-gray-600 space-y-1">
          <p>{products} Products</p>

          {followers !== undefined && (
            <p>{followers.toLocaleString()} Followers</p>
          )}
        </div>

        <Button
          className="mt-6 w-full"
          onClick={onVisitStore}
        >
          Visit Store
        </Button>
      </div>
    </div>
  );
}