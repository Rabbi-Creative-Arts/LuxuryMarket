"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { PartnerType } from "@prisma/client";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function createPartnerApplication(
  formData: FormData
) {
  // ============================================
  // REQUIRE LOGGED-IN USER
  // ============================================

  const session = await auth();

  if (!session?.user) {
    throw new Error(
      "You must be logged in before submitting a Brand application."
    );
  }

  const user = session.user as {
    id?: string;
    email?: string | null;
  };

  if (!user.id) {
    throw new Error(
      "Your account could not be identified. Please log in again."
    );
  }

  if (!user.email) {
    throw new Error(
      "Your UdoLuxury account does not have a valid email address."
    );
  }

  // ============================================
  // ACCOUNT EMAIL
  //
  // The authenticated UdoLuxury account is the
  // source of truth.
  // ============================================

  const accountEmail =
    user.email.trim().toLowerCase();

  const emailPattern =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(accountEmail)) {
    throw new Error(
      "Your UdoLuxury account has an invalid email address."
    );
  }

  // ============================================
  // BASIC INFORMATION
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

  const phone =
    formData
      .get("phone")
      ?.toString()
      .trim() ?? "";

  // ============================================
  // OWNER
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
  // BRAND
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
  // LOCATION
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
  // BRAND TYPE
  // ============================================

  const partnerTypeValue =
    formData
      .get("brandType")
      ?.toString()
      .trim()
      .toUpperCase() ?? "";

  // ============================================
  // POPULAR BRAND FIELDS
  // ============================================

  const companyEmail =
    formData
      .get("companyEmail")
      ?.toString()
      .trim()
      .toLowerCase() ?? "";

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
  // BRAND TYPE VALIDATION
  // ============================================

  if (
    partnerTypeValue !== "PERSONAL" &&
    partnerTypeValue !== "POPULAR"
  ) {
    throw new Error(
      "Invalid Brand type."
    );
  }

  // ============================================
  // BASIC VALIDATION
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

  // ============================================
  // POPULAR BRAND VALIDATION
  // ============================================

  if (
    partnerTypeValue === "POPULAR" &&
    !companyEmail
  ) {
    throw new Error(
      "Official company email is required for Popular Brands."
    );
  }

  if (
    partnerTypeValue === "POPULAR" &&
    !emailPattern.test(companyEmail)
  ) {
    throw new Error(
      "Please enter a valid official company email."
    );
  }

  if (
    partnerTypeValue === "POPULAR" &&
    !website
  ) {
    throw new Error(
      "Official Brand website is required for Popular Brands."
    );
  }

  if (
    partnerTypeValue === "POPULAR" &&
    !purchaseUrl
  ) {
    throw new Error(
      "Official purchase URL is required for Popular Brands."
    );
  }

  // ============================================
  // PERSONAL BRANDS
  //
  // No separate company email.
  // ============================================

  const finalCompanyEmail =
    partnerTypeValue === "POPULAR"
      ? companyEmail
      : null;

  // ============================================
  // PREVENT DUPLICATE ACTIVE APPLICATIONS
  // ============================================

  const existingApplication =
    await prisma.partnerApplication.findFirst({
      where: {
        userId: user.id,

        status: {
          in: [
            "PENDING",
            "UNDER_REVIEW",
            "APPROVED",
          ],
        },
      },

      orderBy: {
        submittedAt: "desc",
      },
    });

  if (existingApplication) {
    throw new Error(
      "You already have an active Brand application."
    );
  }

  // ============================================
  // CREATE APPLICATION
  // ============================================

  const application =
    await prisma.partnerApplication.create({
      data: {
        // Authenticated UdoLuxury account
        userId: user.id,

        // Automatically use account email
        email: accountEmail,

        // Popular = company email
        // Personal = null
        companyEmail:
          finalCompanyEmail,

        partnerType:
          partnerTypeValue === "PERSONAL"
            ? PartnerType.PERSONAL
            : PartnerType.POPULAR,

        businessName,

        brandName,

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

        status: "PENDING",
      },
    });

  // ============================================
  // REFRESH APPLICATION DATA
  // ============================================

  revalidatePath(
    "/admin/partners/applications"
  );

  revalidatePath("/admin");

  revalidatePath("/dashboard");

  // ============================================
  // REDIRECT APPLICANT
  // ============================================

  const applicationType =
    partnerTypeValue === "POPULAR"
      ? "popular"
      : "personal";

  redirect(
    `/partners/apply/success?type=${applicationType}&id=${application.id}`
  );
}