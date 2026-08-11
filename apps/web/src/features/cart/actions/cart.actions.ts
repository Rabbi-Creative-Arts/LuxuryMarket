"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

import { cartService } from "../services/cart.service";

async function requireUser() {
  const session = await auth();

  const userId =
    (session?.user as {
      id?: string;
    } | undefined)?.id;

  if (!userId) {
    throw new Error(
      "You must be logged in."
    );
  }

  return userId;
}

// ============================================
// Add to Cart
// ============================================

export async function addToCart(
  productId: string,
  quantity = 1
) {
  const userId =
    await requireUser();

  await cartService.addItem(
    userId,
    productId,
    quantity
  );

  revalidatePath("/cart");
  revalidatePath("/");

  return {
    success: true,
    message:
      "Product added to cart.",
  };
}

// ============================================
// Update Cart Item
// ============================================

export async function updateCartItem(
  itemId: string,
  quantity: number
) {
  const userId =
    await requireUser();

  await cartService.updateItem(
    userId,
    itemId,
    quantity
  );

  revalidatePath("/cart");
}

// ============================================
// Remove Cart Item
// ============================================

export async function removeCartItem(
  itemId: string
) {
  const userId =
    await requireUser();

  await cartService.removeItem(
    userId,
    itemId
  );

  revalidatePath("/cart");
}