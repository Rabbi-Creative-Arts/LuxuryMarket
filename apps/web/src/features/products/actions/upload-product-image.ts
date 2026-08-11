"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";

import { UploadService } from "../services/upload.service";

export interface UploadImageState {
  success: boolean;
  message: string;
  imageUrl?: string;
}

export async function uploadProductImage(
  productId: string,
  formData: FormData
): Promise<UploadImageState> {
  try {
    if (!productId) {
      return {
        success: false,
        message:
          "Product ID is required.",
      };
    }

    const file = formData.get("image");

    if (!(file instanceof File)) {
      return {
        success: false,
        message: "No image selected.",
      };
    }

    // Upload physical file.
    const result =
      await UploadService.uploadProductImage(
        file
      );

    if (!result.success || !result.url) {
      return {
        success: false,
        message:
          result.error ??
          "Image upload failed.",
      };
    }

    // Find the current highest image order.
    const highestOrder =
      await prisma.productImage.aggregate({
        where: {
          productId,
        },
        _max: {
          sortOrder: true,
        },
      });

    const nextSortOrder =
      (highestOrder._max.sortOrder ?? -1) +
      1;

    // Save image record.
    await prisma.productImage.create({
      data: {
        productId,
        url: result.url,
        alt: "",
        sortOrder: nextSortOrder,
      },
    });

    // Refresh pages.
    revalidatePath(
      `/admin/products/${productId}/edit`
    );

    revalidatePath("/admin/products");

    return {
      success: true,
      message:
        "Image uploaded successfully.",
      imageUrl: result.url,
    };
  } catch (error) {
    console.error(
      "Product image upload error:",
      error
    );

    return {
      success: false,
      message:
        "Unexpected error while uploading image.",
    };
  }
}