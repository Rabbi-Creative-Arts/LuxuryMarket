"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { categoryService } from "../services/category.service";

export async function createCategory(formData: FormData) {
  const name = formData.get("name")?.toString().trim() ?? "";
  const slug = formData.get("slug")?.toString().trim() ?? "";
  const description =
    formData.get("description")?.toString().trim() ?? "";

  if (!name) {
    throw new Error("Category name is required.");
  }

  if (!slug) {
    throw new Error("Category slug is required.");
  }

  await categoryService.create({
    name,
    slug,
    description,
  });

  revalidatePath("/admin/categories");

  redirect("/admin/categories");
}