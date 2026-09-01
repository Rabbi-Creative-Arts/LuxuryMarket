import {
  PartnerApplicationStatus,
  PartnerType,
} from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/features/auth/services/password.service";

export class PartnerApplicationService {
  // ============================================
  // Get All Applications
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
  // Get Applications By Type
  // ============================================

  async getByType(partnerType: PartnerType) {
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

  async getByStatus(status: PartnerApplicationStatus) {
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
  // Update Status
  // ============================================

  async updateStatus(
    id: string,
    status: PartnerApplicationStatus,
    reviewerNotes = "",
    reviewedById?: string
  ) {
    return prisma.partnerApplication.update({
      where: {
        id,
      },

      data: {
        status,

        reviewerNotes:
          reviewerNotes.trim() || null,

        reviewedById:
          reviewedById || null,

        reviewedAt:
          status === PartnerApplicationStatus.PENDING
            ? null
            : new Date(),
      },
    });
  }

  // ============================================
  // APPROVE APPLICATION
  //
  // Creates / activates:
  //
  // 1. User account
  // 2. BRAND_OWNER role
  // 3. Brand
  // 4. BrandDashboard
  // 5. Application → User connection
  // 6. Brand → User connection
  // 7. Audit log
  //
  // Everything is done inside one transaction.
  // ============================================

  async approveApplication(
    applicationId: string,
    adminId: string,
    reviewerNotes = ""
  ) {
    return prisma.$transaction(async (tx) => {
      // ----------------------------------------
      // Find application
      // ----------------------------------------

      const application =
        await tx.partnerApplication.findUnique({
          where: {
            id: applicationId,
          },
        });

      if (!application) {
        throw new Error(
          "Brand application not found."
        );
      }

      // ----------------------------------------
      // Prevent duplicate approval
      // ----------------------------------------

      if (
        application.status ===
        PartnerApplicationStatus.APPROVED
      ) {
        throw new Error(
          "This Brand application has already been approved."
        );
      }

      // ----------------------------------------
      // Find existing user
      // ----------------------------------------

      const existingUser =
        await tx.user.findUnique({
          where: {
            email: application.email,
          },
        });

      let userId: string;

      // ----------------------------------------
      // Existing account
      // ----------------------------------------

      if (existingUser) {
        userId = existingUser.id;

        await tx.user.update({
          where: {
            id: existingUser.id,
          },

          data: {
            active: true,
            role: "BRAND_OWNER",
          },
        });
      } else {
        // --------------------------------------
        // Create account for legacy application
        // --------------------------------------

        const temporaryPassword =
          `${crypto.randomUUID()}A1!`;

        const hashedPassword =
          await hashPassword(
            temporaryPassword
          );

        const user =
          await tx.user.create({
            data: {
              firstName:
                application.firstName,

              lastName:
                application.lastName,

              email:
                application.email,

              phone:
                application.phone,

              password:
                hashedPassword,

              role:
                "BRAND_OWNER",

              active: true,
            },
          });

        userId = user.id;
      }

      // ----------------------------------------
      // Generate unique Brand slug
      // ----------------------------------------

      const baseSlug =
        application.brandName
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "")
          || "brand";

      let slug = baseSlug;
      let suffix = 1;

      while (
        await tx.brand.findUnique({
          where: {
            slug,
          },

          select: {
            id: true,
          },
        })
      ) {
        slug =
          `${baseSlug}-${suffix}`;

        suffix += 1;
      }

      // ----------------------------------------
      // Create Brand
      // ----------------------------------------

      const brand =
        await tx.brand.create({
          data: {
            name:
              application.brandName,

            slug,

            description:
              application.description,

            website:
              application.website,

            email:
              application.email,

            phone:
              application.phone,

            country:
              application.country,

            status:
              "APPROVED",

            verified:
              application.partnerType ===
              PartnerType.POPULAR,

            owner: {
              connect: {
                id: userId,
              },
            },
          },
        });

      // ----------------------------------------
      // Create Brand Dashboard
      //
      // This is the missing piece that prevented
      // the approved vendor from having a real
      // dashboard.
      // ----------------------------------------

      await tx.brandDashboard.create({
        data: {
          brandId:
            brand.id,

          totalProducts: 0,

          totalOrders: 0,

          totalRevenue: 0,

          totalCustomers: 0,
        },
      });

      // ----------------------------------------
      // Update Partner Application
      // ----------------------------------------

      const updatedApplication =
        await tx.partnerApplication.update({
          where: {
            id: applicationId,
          },

          data: {
            userId,

            status:
              PartnerApplicationStatus.APPROVED,

            reviewerNotes:
              reviewerNotes.trim() || null,

            reviewedById:
              adminId,

            reviewedAt:
              new Date(),
          },
        });

      // ----------------------------------------
      // Audit Log
      // ----------------------------------------

      await tx.auditLog.create({
        data: {
          userId:
            adminId,

          entity:
            "PartnerApplication",

          entityId:
            applicationId,

          action:
            "BRAND_APPLICATION_APPROVED",

          oldValue: {
            status:
              application.status,
          },

          newValue: {
            status:
              PartnerApplicationStatus.APPROVED,

            brandId:
              brand.id,

            brandType:
              application.partnerType,

            ownerId:
              userId,
          },
        },
      });

      // ----------------------------------------
      // Return complete result
      // ----------------------------------------

      return {
        application:
          updatedApplication,

        brand,

        userId,
      };
    });
  }
}

// ============================================
// Service Instance
// ============================================

export const partnerApplicationService =
  new PartnerApplicationService();