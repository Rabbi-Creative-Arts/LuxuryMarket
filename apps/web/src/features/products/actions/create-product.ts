"use server";

import { revalidatePath } from "next/cache";

import { productSchema } from "../schemas/product.schema";
import { ProductService } from "../services/product.service";

export interface CreateProductState {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
}

export async function createProduct(
  _: CreateProductState,
  formData: FormData
): Promise<CreateProductState> {
  const rawData = {
    name: formData.get("name"),
    slug: formData.get("slug"),
    sku: formData.get("sku"),

    description: formData.get("description"),
    shortDescription: formData.get("shortDescription"),

    price: Number(formData.get("price")),

    quantity: Number(formData.get("quantity")),

    categoryId: formData.get("categoryId"),

    featured: formData.get("featured") === "true",

    status: formData.get("status"),
  };

  const validated = productSchema.safeParse(rawData);

  if (!validated.success) {
    return {
      success: false,
      message: "Validation failed.",

      errors: validated.error.flatten().fieldErrors,
    };
  }

  /**
   * Temporary Vendor
   *
   * Later we'll obtain this from
   * the authenticated vendor session.
   */
  const vendorId = "REPLACE_WITH_VENDOR_ID";

  await ProductService.create({
    ...validated.data,

    vendorId,
  });

  revalidatePath("/dashboard/products");

  return {
    success: true,

    message: "Product created successfully.",
  };
}
