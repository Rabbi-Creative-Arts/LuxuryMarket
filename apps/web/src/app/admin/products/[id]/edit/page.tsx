import Link from "next/link";

import ProductForm from "@/features/products/components/ProductForm";

import { productService } from "@/features/products/services/product.service";
import { brandService } from "@/features/brands/services/brand.service";
import { categoryService } from "@/features/categories/services/category.service";
import { updateProduct } from "@/features/products/actions/update-product";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditProductPage({
  params,
}: Props) {
  const { id } = await params;

  // ============================================
  // Get Product
  // ============================================

  const product = await productService.getById(id);

  // ============================================
  // Product Not Found
  // ============================================

  if (!product) {
    return (
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">
          Product Not Found
        </h1>

        <p className="text-gray-500">
          The requested product does not exist.
        </p>

        <Link
          href="/admin/products"
          className="inline-block rounded-lg bg-black px-6 py-3 text-white hover:bg-gray-800"
        >
          Back to Products
        </Link>
      </div>
    );
  }

  // ============================================
  // Get Brands + Categories
  // ============================================

  const brands =
    await brandService.getAllForSelect();

  const categories =
    await categoryService.getAllForSelect();

  // ============================================
  // Bind Product ID to Update Action
  // ============================================

  const updateProductWithId =
    updateProduct.bind(null, id);

  // ============================================
  // Page
  // ============================================

  return (
    <div className="space-y-6">

      {/* Header */}

      <div>
        <h1 className="text-4xl font-bold">
          Edit Product
        </h1>

        <p className="text-gray-500">
          Update this marketplace product.
        </p>
      </div>

      {/* Product Form */}

      <ProductForm
        productId={product.id}
        brands={brands}
        categories={categories}
        action={updateProductWithId}
        initialProduct={{
          name: product.name,
          slug: product.slug,
          sku: product.sku,
          description:
            product.description ?? "",
          brandId: product.brandId,
          categoryId: product.categoryId,
          price: product.price.toString(),
          status: product.status,
          affiliateUrl:
            product.affiliateUrl ?? "",
          buyButtonText:
            product.buyButtonText ??
            "Buy on Official Brand Website",
          featured: product.featured,
        }}
        initialImages={product.images.map(
          (image) => ({
            id: image.id,
            url: image.url,
            alt: image.alt ?? "",
            sortOrder: image.sortOrder,
          })
        )}
        submitLabel="Save Changes"
      />

    </div>
  );
}