"use server";

import { revalidatePath } from "next/cache";

import { categoryService } from "../services/category.service";

export async function deleteCategory(id: string) {
  try {
    await categoryService.delete(id);

    revalidatePath("/dashboard/categories");

    return {
      success: true,
      message: "Category deleted successfully.",
    };
  } catch (error) {
    console.error("Delete Category Error:", error);

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to delete category.",
    };
  }
}
