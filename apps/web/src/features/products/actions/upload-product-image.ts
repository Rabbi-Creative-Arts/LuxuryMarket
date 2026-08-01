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
    const file = formData.get("image");

    if (!(file instanceof File)) {
      return {
        success: false,
        message: "No image selected.",
      };
    }

    const result = await UploadService.uploadProductImage(file);

    if (!result.success || !result.url) {
      return {
        success: false,
        message: result.error ?? "Image upload failed.",
      };
    }

    const imageCount = await prisma.productImage.count({
      where: {
        productId,
      },
    });

    await prisma.productImage.create({
      data: {
        productId,

        url: result.url,

        position: imageCount,

        alt: "",
      },
    });

    revalidatePath(`/dashboard/products/${productId}`);
    revalidatePath(`/products`);

    return {
      success: true,
      message: "Image uploaded successfully.",
      imageUrl: result.url,
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      message: "Unexpected error while uploading image.",
    };
  }
}
