"use server";

import { PartnerType } from "@prisma/client";

import { prisma } from "@/lib/prisma";

export async function createPartnerApplication(
  formData: FormData
) {
  // ============================================
  // Basic Information
  // ============================================

  const businessName =
    formData
      .get("businessName")
      ?.toString()
      .trim() ?? "";

  const brandName =
    formData
      .get("brandName")
      ?.toString()
      .trim() ?? "";

  const email =
    formData
      .get("email")
      ?.toString()
      .trim()
      .toLowerCase() ?? "";

  const phone =
    formData
      .get("phone")
      ?.toString()
      .trim() ?? "";

  // ============================================
  // Owner
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

  const position =
    formData
      .get("position")
      ?.toString()
      .trim() ?? "";

  // ============================================
  // Brand
  // ============================================

  const website =
    formData
      .get("website")
      ?.toString()
      .trim() ?? "";

  const description =
    formData
      .get("description")
      ?.toString()
      .trim() ?? "";

  const productType =
    formData
      .get("productType")
      ?.toString()
      .trim() ?? "";

  // ============================================
  // Location
  // ============================================

  const country =
    formData
      .get("country")
      ?.toString()
      .trim() ?? "";

  const city =
    formData
      .get("city")
      ?.toString()
      .trim() ?? "";

  // ============================================
  // Partner Type
  // ============================================

  const partnerTypeValue =
    formData
      .get("brandType")
      ?.toString()
      .trim()
      .toUpperCase() ?? "";

  // ============================================
  // Popular Brand Fields
  // ============================================

  const purchaseUrl =
    formData
      .get("purchaseUrl")
      ?.toString()
      .trim() ?? "";

  const affiliateNetwork =
    formData
      .get("affiliateNetwork")
      ?.toString()
      .trim() ?? "";

  const commissionInformation =
    formData
      .get("commissionInformation")
      ?.toString()
      .trim() ?? "";

  // ============================================
  // Validation
  // ============================================

  if (!businessName) {
    throw new Error(
      "Business name is required."
    );
  }

  if (!brandName) {
    throw new Error(
      "Brand name is required."
    );
  }

  if (!email) {
    throw new Error(
      "Email address is required."
    );
  }

  if (!phone) {
    throw new Error(
      "Phone number is required."
    );
  }

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

  if (!description) {
    throw new Error(
      "Brand description is required."
    );
  }

  if (!productType) {
    throw new Error(
      "Product information is required."
    );
  }

  if (!country) {
    throw new Error(
      "Country is required."
    );
  }

  if (!city) {
    throw new Error(
      "City is required."
    );
  }

  if (
    partnerTypeValue !== "PERSONAL" &&
    partnerTypeValue !== "POPULAR"
  ) {
    throw new Error(
      "Invalid partner type."
    );
  }

  // ============================================
  // Email Validation
  //
  // Personal emails are intentionally allowed.
  // Gmail, Yahoo, Outlook, iCloud, etc. are valid.
  // ============================================

  const emailPattern =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(email)) {
    throw new Error(
      "Please enter a valid email address."
    );
  }

  // ============================================
  // Popular Brand Validation
  // ============================================

  if (
    partnerTypeValue === "POPULAR" &&
    !website
  ) {
    throw new Error(
      "Official brand website is required for Major / Popular Brands."
    );
  }

  if (
    partnerTypeValue === "POPULAR" &&
    !purchaseUrl
  ) {
    throw new Error(
      "Official purchase URL is required for Major / Popular Brands."
    );
  }

  // ============================================
  // Create Application
  // ============================================

  await prisma.partnerApplication.create({
    data: {
      partnerType:
        partnerTypeValue === "PERSONAL"
          ? PartnerType.PERSONAL
          : PartnerType.POPULAR,

      businessName,

      brandName,

      email,

      phone,

      firstName,

      lastName,

      position:
        position || null,

      website:
        website || null,

      description,

      productType,

      country,

      city,

      purchaseUrl:
        purchaseUrl || null,

      affiliateNetwork:
        affiliateNetwork || null,

      commissionInformation:
        commissionInformation || null,

      status:
        "PENDING",
    },
  });
}