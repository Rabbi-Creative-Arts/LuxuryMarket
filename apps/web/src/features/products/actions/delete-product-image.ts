"use server";

import { unlink } from "fs/promises";
import path from "path";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";

export async function deleteProductImage(
  imageId: string
) {
  // ============================================
  // Validate ID
  // ============================================

  if (!imageId) {
    throw new Error(
      "Image ID is required."
    );
  }

  // ============================================
  // Find Image
  // ============================================

  const image =
    await prisma.productImage.findUnique({
      where: {
        id: imageId,
      },
    });

  if (!image) {
    throw new Error(
      "Product image not found."
    );
  }

  // ============================================
  // Delete Database Record
  // ============================================

  await prisma.productImage.delete({
    where: {
      id: imageId,
    },
  });

  // ============================================
  // Delete Physical File
  // ============================================

  if (image.url.startsWith("/uploads/")) {
    const filePath = path.join(
      process.cwd(),
      "public",
      image.url.replace(
        /^\/uploads\//,
        "uploads/"
      )
    );

    try {
      await unlink(filePath);
    } catch (error) {
      console.warn(
        "Could not delete physical image file:",
        error
      );
    }
  }

  // ============================================
  // Refresh Product Pages
  // ============================================

  revalidatePath(
    `/admin/products/${image.productId}/edit`
  );

  revalidatePath("/admin/products");

  return {
    success: true,
    message: "Image deleted successfully.",
  };
}