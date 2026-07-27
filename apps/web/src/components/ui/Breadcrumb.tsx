import Link from "next/link";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export default function Breadcrumb({
  items,
  className = "",
}: BreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={className}
    >
      <ol className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li
              key={item.label}
              className="flex items-center gap-2"
            >
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="hover:text-blue-600 transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={
                    isLast
                      ? "font-semibold text-gray-900"
                      : ""
                  }
                >
                  {item.label}
                </span>
              )}

              {!isLast && (
                <span className="text-gray-400">
                  /
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}