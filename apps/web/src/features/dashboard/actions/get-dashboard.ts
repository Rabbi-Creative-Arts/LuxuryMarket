import { prisma } from "@/lib/prisma";

import type { DashboardStats } from "../types/dashboard";

export async function getDashboard(): Promise<DashboardStats> {
  const [
    users,
    brands,
    products,
    categories,
    pendingApplications,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.brand.count(),
    prisma.product.count(),
    prisma.category.count(),
    prisma.brand.count(),
  ]);

  return {
    users,
    brands,
    products,
    categories,
    pendingApplications,
  };
}