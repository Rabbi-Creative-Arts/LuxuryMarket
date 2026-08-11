import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";

export class ProductService {
  async getAll() {
    return prisma.product.findMany({
      include: {
        brand: true,
        category: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async getById(id: string) {
    return prisma.product.findUnique({
      where: {
        id,
      },
      include: {
        brand: true,
        category: true,

        images: {
          orderBy: [
            {
              sortOrder: "asc",
            },
            {
              createdAt: "asc",
            },
          ],
        },
      },
    });
  }

  async create(
    data: Prisma.ProductCreateInput
  ) {
    return prisma.product.create({
      data,
    });
  }

  async update(
    id: string,
    data: Prisma.ProductUpdateInput
  ) {
    return prisma.product.update({
      where: {
        id,
      },
      data,
    });
  }

  async delete(id: string) {
    return prisma.product.delete({
      where: {
        id,
      },
    });
  }
}

export const productService =
  new ProductService();