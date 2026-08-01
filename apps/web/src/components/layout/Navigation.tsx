import Link from "next/link";

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
    name: "Vendors",
    href: "/vendors",
  },
];

export default function Navigation() {
  return (
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
  );
}
