"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";

import {
  partnerApplicationService,
} from "../services/partner-application.service";

// ============================================
// Require Admin
// ============================================

async function requireAdmin() {
  const session = await auth();

  const user = session?.user as
    | {
        id?: string;
        role?: string;
      }
    | undefined;

  if (!user?.id) {
    throw new Error(
      "You must be logged in."
    );
  }

  if (user.role !== "ADMIN") {
    throw new Error(
      "Administrator access required."
    );
  }

  return user.id;
}

// ============================================
// Update Application Status
// ============================================

export async function updatePartnerApplicationStatus(
  applicationId: string,
  status:
    | "PENDING"
    | "UNDER_REVIEW"
    | "APPROVED"
    | "REJECTED"
    | "SUSPENDED",
  reviewerNotes = ""
) {
  const adminId =
    await requireAdmin();

  if (!applicationId) {
    throw new Error(
      "Application ID is required."
    );
  }

  await partnerApplicationService.updateStatus(
    applicationId,
    status,
    reviewerNotes,
    adminId
  );

  revalidatePath(
    "/admin/partners/applications"
  );

  return {
    success: true,
    message:
      "Partner application updated successfully.",
  };
}

// ============================================
// Approve
// ============================================

export async function approvePartnerApplication(
  applicationId: string,
  reviewerNotes = ""
) {
  return updatePartnerApplicationStatus(
    applicationId,
    "APPROVED",
    reviewerNotes
  );
}

// ============================================
// Reject
// ============================================

export async function rejectPartnerApplication(
  applicationId: string,
  reviewerNotes = ""
) {
  return updatePartnerApplicationStatus(
    applicationId,
    "REJECTED",
    reviewerNotes
  );
}

// ============================================
// Put Under Review
// ============================================

export async function reviewPartnerApplication(
  applicationId: string,
  reviewerNotes = ""
) {
  return updatePartnerApplicationStatus(
    applicationId,
    "UNDER_REVIEW",
    reviewerNotes
  );
}

// ============================================
// Suspend
// ============================================

export async function suspendPartnerApplication(
  applicationId: string,
  reviewerNotes = ""
) {
  return updatePartnerApplicationStatus(
    applicationId,
    "SUSPENDED",
    reviewerNotes
  );
}