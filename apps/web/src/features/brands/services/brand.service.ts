import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export class BrandService {
  // Full brand records.
  // Used by the Admin Brands page because it displays product counts.
  async getAll() {
    return prisma.brand.findMany({
      include: {
        owner: true,
        products: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  // Lightweight version for dropdowns/forms.
  // Only returns what ProductForm needs.
  async getAllForSelect() {
    return prisma.brand.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: "asc",
      },
    });
  }

  async getById(id: string) {
    return prisma.brand.findUnique({
      where: { id },
      include: {
        owner: true,
        products: true,
        contacts: true,
        documents: true,
      },
    });
  }

  async create(data: Prisma.BrandCreateInput) {
    return prisma.brand.create({
      data,
    });
  }

  async update(id: string, data: Prisma.BrandUpdateInput) {
    return prisma.brand.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return prisma.brand.delete({
      where: { id },
    });
  }
}

export const brandService = new BrandService();