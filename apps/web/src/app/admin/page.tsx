import Link from "next/link";

import { productService } from "@/features/products/services/product.service";
import DeleteProductButton from "@/features/products/components/DeleteProductButton";

export default async function ProductsPage() {
  const products = await productService.getAll();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold">
            Products
          </h1>

          <p className="text-gray-500">
            Manage marketplace products.
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="rounded-lg bg-black px-5 py-3 text-white hover:bg-gray-800"
        >
          + Add Product
        </Link>
      </div>

      {/* Products Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left">
                Product
              </th>

              <th className="px-4 py-3 text-left">
                Brand
              </th>

              <th className="px-4 py-3 text-left">
                Category
              </th>

              <th className="px-4 py-3 text-right">
                Price
              </th>

              <th className="px-4 py-3 text-center">
                Status
              </th>

              <th className="px-4 py-3 text-center">
                Featured
              </th>

              <th className="px-4 py-3 text-center">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {products.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="py-10 text-center text-gray-500"
                >
                  No products have been created yet.
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr
                  key={product.id}
                  className="border-t"
                >
                  {/* Product */}
                  <td className="px-4 py-3 font-medium">
                    {product.name}
                  </td>

                  {/* Brand */}
                  <td className="px-4 py-3">
                    {product.brand.name}
                  </td>

                  {/* Category */}
                  <td className="px-4 py-3">
                    {product.category.name}
                  </td>

                  {/* Price */}
                  <td className="px-4 py-3 text-right">
                    $
                    {Number(product.price).toLocaleString(
                      "en-US",
                      {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }
                    )}
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3 text-center">
                    {product.status}
                  </td>

                  {/* Featured */}
                  <td className="px-4 py-3 text-center">
                    {product.featured ? "⭐" : "-"}
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-4">
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="text-blue-600 hover:underline"
                      >
                        Edit
                      </Link>

                      <DeleteProductButton
                        productId={product.id}
                        productName={product.name}
                      />
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