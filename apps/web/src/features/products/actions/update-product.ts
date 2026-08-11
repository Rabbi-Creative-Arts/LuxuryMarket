"use server";

import { Prisma, ProductStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { productService } from "../services/product.service";

export async function updateProduct(
  id: string,
  formData: FormData
) {
  // ============================================
  // Basic Product Fields
  // ============================================

  const name =
    formData.get("name")?.toString().trim() ?? "";

  const slug =
    formData.get("slug")?.toString().trim() ?? "";

  const sku =
    formData.get("sku")?.toString().trim() ?? "";

  const description =
    formData.get("description")?.toString().trim() ?? "";

  const brandId =
    formData.get("brandId")?.toString() ?? "";

  const categoryId =
    formData.get("categoryId")?.toString() ?? "";

  const priceValue =
    formData.get("price")?.toString() ?? "";

  const price = Number(priceValue);

  // ============================================
  // Status
  // ============================================

  const statusValue =
    formData.get("status")?.toString() ?? "DRAFT";

  const status = statusValue as ProductStatus;

  // ============================================
  // Featured
  // ============================================

  const featured =
    formData.get("featured") === "on";

  // ============================================
  // Affiliate Fields
  // ============================================

  const affiliateUrl =
    formData.get("affiliateUrl")?.toString().trim() ?? "";

  const buyButtonText =
    formData.get("buyButtonText")?.toString().trim() ??
    "Buy on Official Brand Website";

  // ============================================
  // Validation
  // ============================================

  if (!id) {
    throw new Error("Product ID is required.");
  }

  if (!name) {
    throw new Error("Product name is required.");
  }

  if (!slug) {
    throw new Error("Slug is required.");
  }

  if (!sku) {
    throw new Error("SKU is required.");
  }

  if (!brandId) {
    throw new Error("Brand is required.");
  }

  if (!categoryId) {
    throw new Error("Category is required.");
  }

  if (!priceValue || Number.isNaN(price)) {
    throw new Error("A valid price is required.");
  }

  // ============================================
  // Update Product
  // ============================================

  await productService.update(id, {
    name,
    slug,
    sku,
    description,
    price: new Prisma.Decimal(price),
    status,
    featured,
    affiliateUrl,
    buyButtonText,

    brand: {
      connect: {
        id: brandId,
      },
    },

    category: {
      connect: {
        id: categoryId,
      },
    },
  });

  // ============================================
  // Refresh Product Pages
  // ============================================

  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${id}/edit`);

  // ============================================
  // Return to Product List
  // ============================================

  redirect("/admin/products");
}