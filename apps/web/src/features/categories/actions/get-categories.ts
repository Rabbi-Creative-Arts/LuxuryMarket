"use server";

import { categoryService } from "../services/category.service";

export async function getCategories() {
  try {
    const categories = await categoryService.getAll();

    return {
      success: true,
      data: categories,
    };
  } catch (error) {
    console.error("Get Categories Error:", error);

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to fetch categories.",
    };
  }
}
