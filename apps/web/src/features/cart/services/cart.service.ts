import { prisma } from "@/lib/prisma";

export class CartService {
  // ============================================
  // Get or create a cart for a user
  // ============================================

  async getOrCreateCart(userId: string) {
    let cart = await prisma.cart.findUnique({
      where: {
        userId,
      },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId,
        },
      });
    }

    return cart;
  }

  // ============================================
  // Get complete cart
  // ============================================

  async getCart(userId: string) {
    const cart =
      await prisma.cart.findUnique({
        where: {
          userId,
        },

        include: {
          items: {
            include: {
              product: {
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

                    take: 1,
                  },
                },
              },
            },

            orderBy: {
              createdAt: "asc",
            },
          },
        },
      });

    return cart;
  }

  // ============================================
  // Add product
  // ============================================

  async addItem(
    userId: string,
    productId: string,
    quantity = 1
  ) {
    if (quantity < 1) {
      throw new Error(
        "Quantity must be at least 1."
      );
    }

    const product =
      await prisma.product.findUnique({
        where: {
          id: productId,
        },

        select: {
          id: true,
          status: true,
        },
      });

    if (!product) {
      throw new Error(
        "Product not found."
      );
    }

    if (product.status !== "ACTIVE") {
      throw new Error(
        "This product is not available."
      );
    }

    const cart =
      await this.getOrCreateCart(
        userId
      );

    const existingItem =
      await prisma.cartItem.findFirst({
        where: {
          cartId: cart.id,
          productId,
        },
      });

    if (existingItem) {
      return prisma.cartItem.update({
        where: {
          id: existingItem.id,
        },

        data: {
          quantity:
            existingItem.quantity +
            quantity,
        },
      });
    }

    return prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        quantity,
      },
    });
  }

  // ============================================
  // Update quantity
  // ============================================

  async updateItem(
    userId: string,
    itemId: string,
    quantity: number
  ) {
    if (quantity < 1) {
      return this.removeItem(
        userId,
        itemId
      );
    }

    const cart =
      await prisma.cart.findUnique({
        where: {
          userId,
        },
      });

    if (!cart) {
      throw new Error(
        "Cart not found."
      );
    }

    const item =
      await prisma.cartItem.findFirst({
        where: {
          id: itemId,
          cartId: cart.id,
        },
      });

    if (!item) {
      throw new Error(
        "Cart item not found."
      );
    }

    return prisma.cartItem.update({
      where: {
        id: item.id,
      },

      data: {
        quantity,
      },
    });
  }

  // ============================================
  // Remove item
  // ============================================

  async removeItem(
    userId: string,
    itemId: string
  ) {
    const cart =
      await prisma.cart.findUnique({
        where: {
          userId,
        },
      });

    if (!cart) {
      throw new Error(
        "Cart not found."
      );
    }

    const item =
      await prisma.cartItem.findFirst({
        where: {
          id: itemId,
          cartId: cart.id,
        },
      });

    if (!item) {
      throw new Error(
        "Cart item not found."
      );
    }

    return prisma.cartItem.delete({
      where: {
        id: item.id,
      },
    });
  }

  // ============================================
  // Clear cart
  // ============================================

  async clearCart(userId: string) {
    const cart =
      await prisma.cart.findUnique({
        where: {
          userId,
        },
      });

    if (!cart) {
      return;
    }

    await prisma.cartItem.deleteMany({
      where: {
        cartId: cart.id,
      },
    });
  }
}

export const cartService =
  new CartService();