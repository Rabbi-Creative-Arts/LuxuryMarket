import { prisma } from "@/lib/prisma";

import type { CategoryInput } from "../schemas/category.schema";

export class CategoryService {
  async create(data: CategoryInput) {
    return prisma.category.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description ?? null,
      },
    });
  }

  async update(id: string, data: Partial<CategoryInput>) {
    return prisma.category.update({
      where: {
        id,
      },
      data: {
        ...data,
      },
    });
  }

  async delete(id: string) {
    return prisma.category.delete({
      where: {
        id,
      },
    });
  }

  async getById(id: string) {
    return prisma.category.findUnique({
      where: {
        id,
      },
      include: {
        products: true,
      },
    });
  }

  async getBySlug(slug: string) {
    return prisma.category.findUnique({
      where: {
        slug,
      },
      include: {
        products: true,
      },
    });
  }

  async getAll() {
    return prisma.category.findMany({
      orderBy: {
        name: "asc",
      },
      include: {
        products: true,
      },
    });
  }

  async getTree() {
    throw new Error(
      "Category tree is not supported by the current Prisma schema."
    );
  }
}

export const categoryService = new CategoryService();
