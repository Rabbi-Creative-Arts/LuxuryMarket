"use server";

import { revalidatePath } from "next/cache";

import { categorySchema } from "../schemas/category.schema";
import { categoryService } from "../services/category.service";

export async function createCategory(formData: FormData) {
  try {
    const rawData = {
      name: formData.get("name"),
      slug: formData.get("slug"),
      description: formData.get("description"),
    };

    const data = categorySchema.parse({
      ...rawData,
      description:
        rawData.description === "" ? null : rawData.description,
    });

    const category = await categoryService.create(data);

    revalidatePath("/dashboard/categories");

    return {
      success: true,
      message: "Category created successfully.",
      data: category,
    };
  } catch (error) {
    console.error("Create Category Error:", error);

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to create category.",
    };
  }
}
