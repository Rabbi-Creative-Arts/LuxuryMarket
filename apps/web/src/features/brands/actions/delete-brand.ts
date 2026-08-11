"use server";

import { revalidatePath } from "next/cache";

import { brandService } from "../services/brand.service";

export async function deleteBrand(id: string) {
  const brand = await brandService.getById(id);

  if (!brand) {
    throw new Error("Brand not found.");
  }

  if (brand.products.length > 0) {
    throw new Error(
      "Cannot delete a brand that contains products."
    );
  }

  await brandService.delete(id);

  revalidatePath("/admin/brands");
}