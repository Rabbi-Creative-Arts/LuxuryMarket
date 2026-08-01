import Link from "next/link";

export default function UserMenu() {
  return (
    <Link
      href="/login"
      className="rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-800"
    >
      Sign In
    </Link>
  );
}
