"use client";

import { useState } from "react";

import ImageUploader from "@/features/media/components/ImageUploader";
import type { UploadImage } from "@/features/media/types/image";

interface Brand {
  id: string;
  name: string;
}

interface Category {
  id: string;
  name: string;
}

interface InitialProduct {
  name: string;
  slug: string;
  sku: string;
  description: string;
  brandId: string;
  categoryId: string;
  price: string;
  status: string;
  affiliateUrl: string;
  buyButtonText: string;
  featured: boolean;
}

interface InitialImage {
  id: string;
  url: string;
  alt?: string | null;
  sortOrder: number;
}

interface ProductFormProps {
  brands: Brand[];

  categories: Category[];

  action: (
    formData: FormData
  ) => void | Promise<void>;

  productId?: string;

  initialProduct?: InitialProduct;

  initialImages?: InitialImage[];

  submitLabel?: string;
}

export default function ProductForm({
  brands,
  categories,
  action,
  productId,
  initialProduct,
  initialImages = [],
  submitLabel = "Create Product",
}: ProductFormProps) {
  const [images, setImages] = useState<
    UploadImage[]
  >([]);

  const isEditing =
    Boolean(initialProduct);

  return (
    <form
      action={action}
      className="space-y-6 rounded-xl border bg-white p-8"
    >

      {/* Product Name */}

      <div>
        <label className="mb-2 block font-medium">
          Product Name *
        </label>

        <input
          type="text"
          name="name"
          required
          defaultValue={
            initialProduct?.name ?? ""
          }
          className="w-full rounded border p-3"
        />
      </div>

      {/* Slug + SKU */}

      <div className="grid gap-6 md:grid-cols-2">

        <div>
          <label className="mb-2 block font-medium">
            Slug *
          </label>

          <input
            type="text"
            name="slug"
            required
            defaultValue={
              initialProduct?.slug ?? ""
            }
            className="w-full rounded border p-3"
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">
            SKU *
          </label>

          <input
            type="text"
            name="sku"
            required
            defaultValue={
              initialProduct?.sku ?? ""
            }
            className="w-full rounded border p-3"
          />
        </div>

      </div>

      {/* Description */}

      <div>
        <label className="mb-2 block font-medium">
          Description
        </label>

        <textarea
          name="description"
          rows={6}
          defaultValue={
            initialProduct?.description ?? ""
          }
          className="w-full rounded border p-3"
        />
      </div>

      {/* Brand + Category */}

      <div className="grid gap-6 md:grid-cols-2">

        <div>
          <label className="mb-2 block font-medium">
            Brand
          </label>

          <select
            name="brandId"
            required
            defaultValue={
              initialProduct?.brandId ?? ""
            }
            className="w-full rounded border p-3"
          >
            <option value="">
              Select Brand
            </option>

            {brands.map((brand) => (
              <option
                key={brand.id}
                value={brand.id}
              >
                {brand.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block font-medium">
            Category
          </label>

          <select
            name="categoryId"
            required
            defaultValue={
              initialProduct?.categoryId ?? ""
            }
            className="w-full rounded border p-3"
          >
            <option value="">
              Select Category
            </option>

            {categories.map((category) => (
              <option
                key={category.id}
                value={category.id}
              >
                {category.name}
              </option>
            ))}
          </select>
        </div>

      </div>

      {/* Price + Status */}

      <div className="grid gap-6 md:grid-cols-2">

        <div>
          <label className="mb-2 block font-medium">
            Price
          </label>

          <input
            type="number"
            name="price"
            step="0.01"
            required
            defaultValue={
              initialProduct?.price ?? ""
            }
            className="w-full rounded border p-3"
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">
            Status
          </label>

          <select
            name="status"
            defaultValue={
              initialProduct?.status ??
              "DRAFT"
            }
            className="w-full rounded border p-3"
          >
            <option value="DRAFT">
              Draft
            </option>

            <option value="ACTIVE">
              Active
            </option>

            <option value="OUT_OF_STOCK">
              Out of Stock
            </option>

            <option value="DISCONTINUED">
              Discontinued
            </option>
          </select>
        </div>

      </div>

      {/* Affiliate Information */}

      <div className="rounded-lg border bg-gray-50 p-6">

        <h2 className="mb-4 text-xl font-semibold">
          Affiliate Information
        </h2>

        <div className="grid gap-6 md:grid-cols-2">

          <div>
            <label className="mb-2 block font-medium">
              Affiliate URL
            </label>

            <input
              type="url"
              name="affiliateUrl"
              defaultValue={
                initialProduct?.affiliateUrl ??
                ""
              }
              className="w-full rounded border p-3"
            />

            <p className="mt-2 text-sm text-gray-500">
              Official product or affiliate tracking
              URL.
            </p>
          </div>

          <div>
            <label className="mb-2 block font-medium">
              Buy Button Text
            </label>

            <input
              type="text"
              name="buyButtonText"
              defaultValue={
                initialProduct?.buyButtonText ??
                "Buy on Official Brand Website"
              }
              className="w-full rounded border p-3"
            />

            <p className="mt-2 text-sm text-gray-500">
              This text will appear on the product
              page.
            </p>
          </div>

        </div>
      </div>

      {/* Product Images */}

      <div className="rounded-xl border bg-gray-50 p-6">

        <h2 className="mb-4 text-xl font-semibold">
          Product Images
        </h2>

        {productId ? (
          <ImageUploader
            productId={productId}
            images={images}
            setImages={setImages}
            initialImages={initialImages}
          />
        ) : (
          <div className="rounded-lg border border-dashed border-gray-300 p-6 text-center text-sm text-gray-500">
            Product images can be uploaded after
            the product has been created.
          </div>
        )}

      </div>

      {/* Featured */}

      <label className="flex items-center gap-3">

        <input
          type="checkbox"
          name="featured"
          defaultChecked={
            initialProduct?.featured ??
            false
          }
        />

        Featured Product

      </label>

      {/* Submit */}

      <button
        type="submit"
        className="rounded-lg bg-black px-8 py-3 text-white transition hover:bg-gray-900"
      >
        {isEditing
          ? submitLabel
          : "Create Product"}
      </button>

    </form>
  );
}