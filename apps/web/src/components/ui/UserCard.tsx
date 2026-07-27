import Image from "next/image";
import Button from "./Button";
import Badge from "./Badge";

type UserRole =
  | "Customer"
  | "Vendor"
  | "Admin";

interface UserCardProps {
  avatar: string;
  name: string;
  email: string;
  role: UserRole;
  active?: boolean;
  onViewProfile?: () => void;
  className?: string;
}

export default function UserCard({
  avatar,
  name,
  email,
  role,
  active = true,
  onViewProfile,
  className = "",
}: UserCardProps) {
  return (
    <div
      className={`rounded-xl border bg-white p-6 shadow-sm ${className}`}
    >
      <div className="flex items-center gap-4">
        <Image
          src={avatar}
          alt={name}
          width={72}
          height={72}
          className="rounded-full object-cover"
        />

        <div className="flex-1">
          <h3 className="text-lg font-semibold">
            {name}
          </h3>

          <p className="text-sm text-gray-500">
            {email}
          </p>

          <div className="mt-2 flex gap-2">
            <Badge>{role}</Badge>

            <Badge>
              {active ? "Active" : "Inactive"}
            </Badge>
          </div>
        </div>
      </div>

      <Button
        className="mt-6 w-full"
        onClick={onViewProfile}
      >
        View Profile
      </Button>
    </div>
  );
}