"use server";

import { Prisma, ProductStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { productService } from "../services/product.service";

export async function createProduct(formData: FormData) {
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

  const price = Number(
    formData.get("price")
  );

  const featured =
    formData.get("featured") === "on";

  const status =
    (formData.get("status")?.toString() as ProductStatus) ??
    ProductStatus.DRAFT;

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

  if (Number.isNaN(price)) {
    throw new Error("Invalid price.");
  }

  // ============================================
  // Create Product
  // ============================================

  await productService.create({
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

  revalidatePath("/admin/products");

  redirect("/admin/products");
}