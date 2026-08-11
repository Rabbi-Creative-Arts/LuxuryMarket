"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { brandService } from "../services/brand.service";

export async function updateBrand(formData: FormData) {
  const id = formData.get("id")?.toString() ?? "";

  if (!id) {
    throw new Error("Brand ID is required.");
  }

  await brandService.update(id, {
    name: formData.get("name")?.toString().trim() ?? "",
    slug: formData.get("slug")?.toString().trim() ?? "",
    description: formData.get("description")?.toString().trim() ?? "",

    country: formData.get("country")?.toString().trim() ?? "",
    website: formData.get("website")?.toString().trim() ?? "",
    email: formData.get("email")?.toString().trim() ?? "",
    phone: formData.get("phone")?.toString().trim() ?? "",

    verified: formData.get("verified") === "on",
    featured: formData.get("featured") === "on",
  });

  revalidatePath("/admin/brands");
  revalidatePath(`/admin/brands/${id}`);

  redirect("/admin/brands");
}