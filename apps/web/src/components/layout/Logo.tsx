import Link from "next/link";

export default function Logo() {
  return (
    <Link
      href="/"
      className="flex items-center gap-3 select-none"
      aria-label="LuxuryMarket Home"
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-black text-lg font-bold text-white shadow">
        LM
      </div>

      <div className="leading-tight">
        <h1 className="text-xl font-extrabold tracking-tight text-black">
          LuxuryMarket
        </h1>

        <p className="text-xs text-gray-500">
          Premium Marketplace
        </p>
      </div>
    </Link>
  );
}
