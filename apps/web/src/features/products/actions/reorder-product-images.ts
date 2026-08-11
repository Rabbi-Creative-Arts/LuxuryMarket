"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";

export async function reorderProductImages(
  productId: string,
  imageIds: string[]
) {
  if (!productId) {
    throw new Error("Product ID is required.");
  }

  if (!Array.isArray(imageIds)) {
    throw new Error("Image IDs are required.");
  }

  // Get the product and confirm it exists.
  const product = await prisma.product.findUnique({
    where: {
      id: productId,
    },
    select: {
      id: true,
      slug: true,
    },
  });

  if (!product) {
    throw new Error("Product not found.");
  }

  // Get all images belonging to this product.
  const existingImages =
    await prisma.productImage.findMany({
      where: {
        productId,
      },
      select: {
        id: true,
      },
    });

  const existingIds = new Set(
    existingImages.map((image) => image.id)
  );

  // Make sure every submitted image belongs
  // to this product.
  for (const imageId of imageIds) {
    if (!existingIds.has(imageId)) {
      throw new Error(
        "Invalid product image."
      );
    }
  }

  // Make sure no image was duplicated.
  if (
    new Set(imageIds).size !==
    imageIds.length
  ) {
    throw new Error(
      "Duplicate image IDs are not allowed."
    );
  }

  // Make sure no image was omitted.
  if (
    imageIds.length !==
    existingImages.length
  ) {
    throw new Error(
      "All product images must be included."
    );
  }

  // Save the exact order.
  await prisma.$transaction(
    imageIds.map((imageId, index) =>
      prisma.productImage.update({
        where: {
          id: imageId,
        },
        data: {
          sortOrder: index,
        },
      })
    )
  );

  // Refresh admin page.
  revalidatePath(
    `/admin/products/${productId}/edit`
  );

  // Refresh storefront product page.
  revalidatePath(
    `/products/${product.slug}`
  );

  return {
    success: true,
    message:
      "Product image order updated.",
  };
}