import Link from "next/link";

import { brandService } from "@/features/brands/services/brand.service";
import { deleteBrand } from "@/features/brands/actions/delete-brand";

export default async function BrandsPage() {
  const brands = await brandService.getAll();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Brands
          </h1>

          <p className="text-gray-500">
            Manage all registered brands.
          </p>
        </div>

        <Link
          href="/admin/brands/new"
          className="rounded-lg bg-black px-5 py-3 text-white hover:bg-gray-800"
        >
          + Create Brand
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <table className="min-w-full">

          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left">Brand</th>
              <th className="px-4 py-3 text-left">Country</th>
              <th className="px-4 py-3 text-left">Website</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-center">Verified</th>
              <th className="px-4 py-3 text-center">Featured</th>
              <th className="px-4 py-3 text-center">Products</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>

            {brands.length === 0 ? (

              <tr>
                <td
                  colSpan={8}
                  className="py-10 text-center text-gray-500"
                >
                  No brands have been created yet.
                </td>
              </tr>

            ) : (

              brands.map((brand) => (

                <tr
                  key={brand.id}
                  className="border-t"
                >
                  <td className="px-4 py-3 font-medium">
                    {brand.name}
                  </td>

                  <td className="px-4 py-3">
                    {brand.country ?? "-"}
                  </td>

                  <td className="px-4 py-3">
                    {brand.website ?? "-"}
                  </td>

                  <td className="px-4 py-3">
                    {brand.status}
                  </td>

                  <td className="px-4 py-3 text-center">
                    {brand.verified ? "✅" : "❌"}
                  </td>

                  <td className="px-4 py-3 text-center">
                    {brand.featured ? "⭐" : "-"}
                  </td>

                  <td className="px-4 py-3 text-center">
                    {brand.products.length}
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-4">

                      <Link
                        href={`/admin/brands/${brand.id}/edit`}
                        className="text-blue-600 hover:underline"
                      >
                        Edit
                      </Link>

                      <form
                        action={async () => {
                          "use server";
                          await deleteBrand(brand.id);
                        }}
                      >
                        <button
                          type="submit"
                          className="text-red-600 hover:underline"
                        >
                          Delete
                        </button>
                      </form>

                    </div>
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