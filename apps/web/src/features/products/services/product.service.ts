import { Prisma, ProductStatus } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

export interface CreateProductInput {
  name: string;
  slug: string;
  sku: string;

  description: string;
  shortDescription?: string;

  price: number;

  quantity: number;

  featured: boolean;

  status: ProductStatus;

  vendorId: string;

  categoryId: string;
}

export class ProductService {
  /**
   * Create Product
   */
  static async create(data: CreateProductInput) {
    return prisma.product.create({
      data: {
        name: data.name,
        slug: data.slug,
        sku: data.sku,

        description: data.description,
        shortDescription: data.shortDescription,

        price: new Prisma.Decimal(data.price),

        quantity: data.quantity,

        featured: data.featured,

        status: data.status,

        vendor: {
          connect: {
            id: data.vendorId,
          },
        },

        category: {
          connect: {
            id: data.categoryId,
          },
        },
      },

      include: {
        vendor: true,
        category: true,
        images: true,
      },
    });
  }

  /**
   * Get Product by ID
   */
  static async getById(id: string) {
    return prisma.product.findUnique({
      where: {
        id,
      },

      include: {
        vendor: true,
        category: true,
        images: true,
      },
    });
  }

  /**
   * Get Product by Slug
   */
  static async getBySlug(slug: string) {
    return prisma.product.findUnique({
      where: {
        slug,
      },

      include: {
        vendor: true,
        category: true,
        images: true,
      },
    });
  }

  /**
   * Get All Products
   */
  static async getAll() {
    return prisma.product.findMany({
      include: {
        vendor: true,
        category: true,
        images: true,
      },

      orderBy: {
        createdAt: "desc",
      },
    });
  }

  /**
   * Update Product
   */
  static async update(
    id: string,
    data: Partial<CreateProductInput>
  ) {
    return prisma.product.update({
      where: {
        id,
      },

      data: {
        ...data,

        price:
          data.price !== undefined
            ? new Prisma.Decimal(data.price)
            : undefined,
      },

      include: {
        vendor: true,
        category: true,
        images: true,
      },
    });
  }

  /**
   * Delete Product
   */
  static async delete(id: string) {
    return prisma.product.delete({
      where: {
        id,
      },
    });
  }

  /**
   * Get Products By Vendor
   */
  static async getByVendor(vendorId: string) {
    return prisma.product.findMany({
      where: {
        vendorId,
      },

      include: {
        category: true,
        images: true,
      },

      orderBy: {
        createdAt: "desc",
      },
    });
  }

  /**
   * Get Products By Category
   */
  static async getByCategory(categoryId: string) {
    return prisma.product.findMany({
      where: {
        categoryId,
      },

      include: {
        vendor: true,
        images: true,
      },

      orderBy: {
        createdAt: "desc",
      },
    });
  }
}
