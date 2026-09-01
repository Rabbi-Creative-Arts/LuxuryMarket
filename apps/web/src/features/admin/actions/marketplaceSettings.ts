"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateMarketplaceCommission(
  formData: FormData
) {
  const rawRate = String(
    formData.get("commissionRate") ?? ""
  ).trim();

  const rate = Number(rawRate);

  if (!Number.isFinite(rate)) {
    return {
      success: false,
      message: "Please enter a valid commission rate.",
    };
  }

  if (rate < 0 || rate > 100) {
    return {
      success: false,
      message:
        "Commission rate must be between 0% and 100%.",
    };
  }

  const existing =
    await prisma.marketplaceSettings.findFirst({
      where: {
        active: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

  if (existing) {
    await prisma.marketplaceSettings.update({
      where: {
        id: existing.id,
      },
      data: {
        commissionRate: rate,
        active: true,
      },
    });
  } else {
    await prisma.marketplaceSettings.create({
      data: {
        commissionRate: rate,
        active: true,
      },
    });
  }

  revalidatePath("/admin/settings/marketplace");

  return {
    success: true,
    message: "Marketplace commission updated successfully.",
  };
}