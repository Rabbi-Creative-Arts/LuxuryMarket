import Link from "next/link";

import { categoryService } from "@/features/categories/services/category.service";

export default async function CategoriesPage() {
  const categories = await categoryService.getAll();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Categories
          </h1>

          <p className="text-gray-500">
            Manage marketplace categories.
          </p>
        </div>

        <Link
          href="/admin/categories/new"
          className="rounded-lg bg-black px-5 py-3 text-white hover:bg-gray-800"
        >
          + Add Category
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Slug</th>
              <th className="px-4 py-3 text-center">Products</th>
              <th className="px-4 py-3 text-center">Active</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {categories.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="py-10 text-center text-gray-500"
                >
                  No categories have been created yet.
                </td>
              </tr>
            ) : (
              categories.map((category) => (
                <tr
                  key={category.id}
                  className="border-t"
                >
                  <td className="px-4 py-3 font-medium">
                    {category.name}
                  </td>

                  <td className="px-4 py-3">
                    {category.slug}
                  </td>

                  <td className="px-4 py-3 text-center">
                    {category.products.length}
                  </td>

                  <td className="px-4 py-3 text-center">
                    {category.active ? "✅" : "❌"}
                  </td>

                  <td className="px-4 py-3 text-center">
                    <Link
                      href={`/admin/categories/${category.id}/edit`}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}