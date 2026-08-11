import { prisma } from "@/lib/prisma";

export class PartnerApplicationService {
  // ============================================
  // Get All Partner Applications
  // ============================================

  async getAll() {
    return prisma.partnerApplication.findMany({
      orderBy: {
        submittedAt: "desc",
      },
    });
  }

  // ============================================
  // Get Application By ID
  // ============================================

  async getById(id: string) {
    return prisma.partnerApplication.findUnique({
      where: {
        id,
      },
    });
  }

  // ============================================
  // Get Personal / Popular Brand Applications
  // ============================================

  async getByType(
    partnerType: "PERSONAL" | "POPULAR"
  ) {
    return prisma.partnerApplication.findMany({
      where: {
        partnerType,
      },

      orderBy: {
        submittedAt: "desc",
      },
    });
  }

  // ============================================
  // Get Applications By Status
  // ============================================

  async getByStatus(
    status:
      | "PENDING"
      | "UNDER_REVIEW"
      | "APPROVED"
      | "REJECTED"
      | "SUSPENDED"
  ) {
    return prisma.partnerApplication.findMany({
      where: {
        status,
      },

      orderBy: {
        submittedAt: "desc",
      },
    });
  }

  // ============================================
  // Update Application Status
  // ============================================

  async updateStatus(
    id: string,
    status:
      | "PENDING"
      | "UNDER_REVIEW"
      | "APPROVED"
      | "REJECTED"
      | "SUSPENDED",
    reviewerNotes?: string,
    reviewedById?: string
  ) {
    return prisma.partnerApplication.update({
      where: {
        id,
      },

      data: {
        status,

        reviewerNotes:
          reviewerNotes?.trim() || null,

        reviewedById:
          reviewedById || null,

        reviewedAt:
          status === "PENDING"
            ? null
            : new Date(),
      },
    });
  }
}

// ============================================
// Service Instance
// ============================================

export const partnerApplicationService =
  new PartnerApplicationService();