"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { productService } from "@/features/products/services/product.service";

export async function deleteProduct(formData: FormData) {
  const id = formData.get("id")?.toString().trim();

  if (!id) {
    throw new Error("Product ID is required.");
  }

  console.log("Deleting product:", id);

  await productService.delete(id);

  revalidatePath("/admin/products");

  redirect("/admin/products");
}