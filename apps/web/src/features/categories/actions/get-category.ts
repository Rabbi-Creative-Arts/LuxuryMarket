"use server";

import { categoryService } from "../services/category.service";

export async function getCategory(id: string) {
  try {
    const category = await categoryService.getById(id);

    return {
      success: true,
      data: category,
    };
  } catch (error) {
    console.error("Get Category Error:", error);

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to fetch category.",
    };
  }
}
