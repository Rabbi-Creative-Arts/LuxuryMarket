import { prisma } from "@/lib/prisma";

export class BrandService {
  async getAll() {
    return prisma.brand.findMany({
      orderBy: {
        name: "asc",
      },
    });
  }

  async getById(id: string) {
    return prisma.brand.findUnique({
      where: {
        id,
      },
    });
  }
}

export const brandService =
  new BrandService();