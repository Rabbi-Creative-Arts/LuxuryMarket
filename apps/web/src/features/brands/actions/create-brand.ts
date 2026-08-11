"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { brandService } from "../services/brand.service";

export async function createBrand(formData: FormData) {
  const name = formData.get("name")?.toString().trim() ?? "";
  const slug = formData.get("slug")?.toString().trim() ?? "";
  const description = formData.get("description")?.toString().trim() ?? "";

  const website = formData.get("website")?.toString().trim() ?? "";
  const email = formData.get("email")?.toString().trim() ?? "";
  const phone = formData.get("phone")?.toString().trim() ?? "";
  const country = formData.get("country")?.toString().trim() ?? "";

  const logo = formData.get("logo")?.toString().trim() ?? "";
  const coverImage = formData.get("coverImage")?.toString().trim() ?? "";

  if (!name || !slug) {
    throw new Error("Brand Name and Slug are required.");
  }

  await brandService.create({
    name,
    slug,
    description,

    website,
    email,
    phone,
    country,

    logo,
    coverImage,

    status: "PENDING",
    verified: false,
    featured: false,
  });

  revalidatePath("/admin/brands");

  redirect("/admin/brands");
}