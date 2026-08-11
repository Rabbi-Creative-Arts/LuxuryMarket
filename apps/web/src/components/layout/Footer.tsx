import Link from "next/link";

import { siteConfig } from "@/config/site";

export default function Footer() {
  return (
    <footer className="mt-20 border-t bg-gray-50">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-4">

        {/* Brand */}
        <div>
          <h2 className="text-2xl font-bold">
            {siteConfig.logoText}
          </h2>

          <p className="mt-2 text-sm font-medium uppercase tracking-[0.2em] text-gray-500">
            {siteConfig.slogan}
          </p>

          <p className="mt-4 text-sm text-gray-600">
            {siteConfig.description}
          </p>
        </div>

        {/* Marketplace */}
        <div>
          <h3 className="mb-4 font-semibold">
            Marketplace
          </h3>

          <ul className="space-y-2 text-sm text-gray-600">
            <li>
              <Link href="/products">Products</Link>
            </li>

            <li>
              <Link href="/brands">Brands</Link>
            </li>

            <li>
              <Link href="/categories">Categories</Link>
            </li>

            <li>
              <Link href="/vendors">Vendors</Link>
            </li>
          </ul>
        </div>

        {/* Company */}
        <div>
          <h3 className="mb-4 font-semibold">
            Company
          </h3>

          <ul className="space-y-2 text-sm text-gray-600">
            <li>
              <Link href="/about">About</Link>
            </li>

            <li>
              <Link href="/contact">Contact</Link>
            </li>

            <li>
              <Link href="/careers">Careers</Link>
            </li>

            <li>
              <Link href="/privacy">Privacy</Link>
            </li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="mb-4 font-semibold">
            Support
          </h3>

          <ul className="space-y-2 text-sm text-gray-600">
            <li>
              <Link href="/help">Help Center</Link>
            </li>

            <li>
              <Link href="/shipping">Shipping</Link>
            </li>

            <li>
              <Link href="/returns">Returns</Link>
            </li>

            <li>
              <Link href="/faq">FAQ</Link>
            </li>
          </ul>
        </div>

      </div>

      <div className="border-t py-6 text-center text-sm text-gray-500">
        {siteConfig.copyright}
      </div>
    </footer>
  );
}