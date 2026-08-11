"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { siteConfig } from "@/config/site";

const navigation = [
  { name: "Dashboard", href: "/admin" },
  { name: "Brands", href: "/admin/brands" },
  { name: "Products", href: "/admin/products" },
  { name: "Categories", href: "/admin/categories" },
  { name: "Applications", href: "/admin/applications" },
  { name: "Users", href: "/admin/users" },
  { name: "Offers", href: "/admin/offers" },
  { name: "Analytics", href: "/admin/analytics" },
  { name: "Reports", href: "/admin/reports" },
  { name: "AI Center", href: "/admin/ai" },
  { name: "Settings", href: "/admin/settings" },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-gray-200 bg-white">

      {/* Brand */}
      <div className="border-b border-gray-200 p-6">
        <h2 className="text-3xl font-bold tracking-tight">
          {siteConfig.logoText}
        </h2>

        <p className="mt-2 text-xs font-medium uppercase tracking-[0.2em] text-gray-500">
          ADMIN CENTER
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {navigation.map((item) => {
          const active =
            pathname === item.href ||
            pathname.startsWith(item.href + "/");

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block rounded-lg px-4 py-3 transition ${
                active
                  ? "bg-black text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-gray-200 p-4 text-sm text-gray-500">
        {siteConfig.logoText} Admin v1.0
      </div>

    </aside>
  );
}