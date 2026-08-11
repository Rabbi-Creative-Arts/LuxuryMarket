import Link from "next/link";

import { auth } from "@/auth";

import { siteConfig } from "@/config/site";

import { cartService } from "@/features/cart/services/cart.service";

const navigation = [
  {
    name: "Categories",
    href: "/categories",
  },
  {
    name: "Brands",
    href: "/brands",
  },
  {
    name: "Products",
    href: "/products",
  },
  {
    name: "Partners",
    href: "/partners",
  },
];

export default async function Header() {
  // ============================================
  // Get Current User
  // ============================================

  const session = await auth();

  const userId =
    (session?.user as {
      id?: string;
    } | undefined)?.id;

  // ============================================
  // Get Cart Count
  // ============================================

  let cartItemCount = 0;

  if (userId) {
    const cart = await cartService.getCart(userId);

    if (cart) {
      cartItemCount = cart.items.reduce(
        (total, item) => total + item.quantity,
        0
      );
    }
  }

  // ============================================
  // Header
  // ============================================

  return (
    <header className="border-b bg-white">
      <div className="mx-auto flex max-w-7xl items-center gap-8 px-6 py-4">

        {/* ============================================
            Logo
        ============================================ */}

        <Link
          href="/"
          className="flex shrink-0 flex-col leading-none"
        >
          <span className="text-3xl font-bold tracking-tight">
            {siteConfig.logoText}
          </span>

          <span className="text-xs font-medium uppercase tracking-[0.25em] text-gray-500">
            {siteConfig.slogan}
          </span>
        </Link>

        {/* ============================================
            Navigation
        ============================================ */}

        <nav className="hidden items-center gap-8 lg:flex">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-medium text-gray-700 transition hover:text-black"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* ============================================
            Search
        ============================================ */}

        <div className="hidden min-w-0 flex-1 lg:block">
          <input
            type="search"
            placeholder="Search luxury brands or products..."
            className="w-full rounded-full border px-5 py-3 outline-none transition focus:ring-2 focus:ring-black"
          />
        </div>

        {/* ============================================
            Actions
        ============================================ */}

        <div className="flex shrink-0 items-center gap-3">

          {/* Login */}

          <Link
            href="/login"
            className="rounded-lg border px-4 py-2 text-sm font-medium transition hover:bg-gray-100"
          >
            Login
          </Link>

          {/* Cart */}

          <Link
            href="/cart"
            className="relative rounded-lg bg-black px-5 py-2 text-sm font-semibold text-white transition hover:bg-gray-900"
          >
            Cart

            {cartItemCount > 0 && (
              <span className="ml-2 inline-flex min-w-5 items-center justify-center rounded-full bg-white px-1.5 py-0.5 text-xs font-bold text-black">
                {cartItemCount}
              </span>
            )}
          </Link>

        </div>

      </div>
    </header>
  );
}