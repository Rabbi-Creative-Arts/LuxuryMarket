"use server";

import { redirect } from "next/navigation";
import { auth } from "@/auth";

import { orderService } from "../services/order.service";

export async function createOrder(
  formData: FormData
) {
  // ============================================
  // Authentication
  // ============================================

  const session =
    await auth();

  const userId =
    (
      session?.user as
        | {
            id?: string;
          }
        | undefined
    )?.id;

  if (!userId) {
    throw new Error(
      "You must be logged in to checkout."
    );
  }

  // ============================================
  // Form Fields
  // ============================================

  const firstName =
    formData
      .get("firstName")
      ?.toString()
      .trim() ?? "";

  const lastName =
    formData
      .get("lastName")
      ?.toString()
      .trim() ?? "";

  const company =
    formData
      .get("company")
      ?.toString()
      .trim() ?? "";

  const phone =
    formData
      .get("phone")
      ?.toString()
      .trim() ?? "";

  const addressLine1 =
    formData
      .get("addressLine1")
      ?.toString()
      .trim() ?? "";

  const addressLine2 =
    formData
      .get("addressLine2")
      ?.toString()
      .trim() ?? "";

  const city =
    formData
      .get("city")
      ?.toString()
      .trim() ?? "";

  const state =
    formData
      .get("state")
      ?.toString()
      .trim() ?? "";

  const postalCode =
    formData
      .get("postalCode")
      ?.toString()
      .trim() ?? "";

  const country =
    formData
      .get("country")
      ?.toString()
      .trim() ?? "";

  // ============================================
  // Validation
  // ============================================

  if (!firstName) {
    throw new Error(
      "First name is required."
    );
  }

  if (!lastName) {
    throw new Error(
      "Last name is required."
    );
  }

  if (!phone) {
    throw new Error(
      "Phone number is required."
    );
  }

  if (!addressLine1) {
    throw new Error(
      "Address is required."
    );
  }

  if (!city) {
    throw new Error(
      "City is required."
    );
  }

  if (!state) {
    throw new Error(
      "State is required."
    );
  }

  if (!postalCode) {
    throw new Error(
      "Postal code is required."
    );
  }

  if (!country) {
    throw new Error(
      "Country is required."
    );
  }

  // ============================================
  // Create Order
  // ============================================

  const order =
    await orderService.createFromCart(
      userId,
      {
        firstName,
        lastName,
        company,
        phone,
        addressLine1,
        addressLine2,
        city,
        state,
        postalCode,
        country,
      }
    );

  // ============================================
  // Go To Order Review
  // ============================================

  redirect(
    `/checkout/success?order=${order.id}`
  );
}