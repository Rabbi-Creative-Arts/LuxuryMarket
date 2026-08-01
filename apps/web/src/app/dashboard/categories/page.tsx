import Link from "next/link";

import { getCategories } from "@/features/categories/actions";

export default async function CategoriesPage() {
  const result = await getCategories();

  const categories = result.success ? result.data ?? [] : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">
          Categories
        </h1>

        <Link
          href="/dashboard/categories/new"
          className="rounded-lg bg-black px-4 py-2 text-white"
        >
          New Category
        </Link>
      </div>

      <div className="overflow-hidden rounded-lg border">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left">
                Name
              </th>

              <th className="px-4 py-3 text-left">
                Slug
              </th>

              <th className="px-4 py-3 text-left">
                Products
              </th>

              <th className="px-4 py-3 text-right">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {categories.map((category) => (
              <tr
                key={category.id}
                className="border-t"
              >
                <td className="px-4 py-3">
                  {category.name}
                </td>

                <td className="px-4 py-3">
                  {category.slug}
                </td>

                <td className="px-4 py-3">
                  {category.products.length}
                </td>

                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/dashboard/categories/${category.id}/edit`}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}

            {categories.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-8 text-center text-gray-500"
                >
                  No categories found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
