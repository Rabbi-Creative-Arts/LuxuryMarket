import ProductForm from "@/features/products/components/ProductForm";

import { brandService } from "@/features/brands/services/brand.service";
import { categoryService } from "@/features/categories/services/category.service";

import { createProduct } from "@/features/products/actions/create-product";

export default async function NewProductPage() {
  const brands = await brandService.getAllForSelect();

  const categories = await categoryService.getAllForSelect();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold">
          Add Product
        </h1>

        <p className="text-gray-500">
          Create a new marketplace product.
        </p>
      </div>

      <ProductForm
        brands={brands}
        categories={categories}
        action={createProduct}
      />
    </div>
  );
}