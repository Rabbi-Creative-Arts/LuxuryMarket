import Link from "next/link";

export default function CartButton() {
  return (
    <Link
      href="/cart"
      className="relative rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium transition hover:border-black hover:bg-gray-100"
    >
      Cart

      <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-black text-xs text-white">
        0
      </span>
    </Link>
  );
}
