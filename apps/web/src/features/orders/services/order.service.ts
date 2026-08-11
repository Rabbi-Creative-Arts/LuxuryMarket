import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";

export class OrderService {
  // ============================================
  // Create Pending Order From Cart
  // ============================================

  async createFromCart(
    userId: string,
    data: {
      firstName: string;
      lastName: string;
      company?: string;
      phone: string;
      addressLine1: string;
      addressLine2?: string;
      city: string;
      state: string;
      postalCode: string;
      country: string;
    }
  ) {
    return prisma.$transaction(async (tx) => {
      // ========================================
      // Get Cart
      // ========================================

      const cart =
        await tx.cart.findUnique({
          where: {
            userId,
          },

          include: {
            items: {
              include: {
                product: true,
              },
            },
          },
        });

      if (!cart) {
        throw new Error(
          "Your cart could not be found."
        );
      }

      if (cart.items.length === 0) {
        throw new Error(
          "Your cart is empty."
        );
      }

      // ========================================
      // Validate Products
      // ========================================

      for (const item of cart.items) {
        if (
          item.product.status !==
          "ACTIVE"
        ) {
          throw new Error(
            `The product "${item.product.name}" is no longer available.`
          );
        }
      }

      // ========================================
      // Calculate Subtotal
      // ========================================

      let subtotal =
        new Prisma.Decimal(0);

      for (const item of cart.items) {
        const lineTotal =
          new Prisma.Decimal(
            item.product.price
          ).mul(item.quantity);

        subtotal =
          subtotal.add(lineTotal);
      }

      // ========================================
      // Checkout Foundation
      //
      // Shipping, tax and discount will be
      // calculated by their own systems later.
      // ========================================

      const shipping =
        new Prisma.Decimal(0);

      const tax =
        new Prisma.Decimal(0);

      const discount =
        new Prisma.Decimal(0);

      const total = subtotal
        .add(shipping)
        .add(tax)
        .sub(discount);

      // ========================================
      // Create Shipping Address
      // ========================================

      const address =
        await tx.address.create({
          data: {
            userId,

            firstName:
              data.firstName,

            lastName:
              data.lastName,

            company:
              data.company || null,

            phone:
              data.phone,

            addressLine1:
              data.addressLine1,

            addressLine2:
              data.addressLine2 ||
              null,

            city:
              data.city,

            state:
              data.state,

            postalCode:
              data.postalCode,

            country:
              data.country,

            isDefault: false,
          },
        });

      // ========================================
      // Generate Order Number
      // ========================================

      const orderNumber =
        `LM-${Date.now()}-${Math.floor(
          Math.random() * 10000
        )
          .toString()
          .padStart(4, "0")}`;

      // ========================================
      // Create Order
      // ========================================

      const order =
        await tx.order.create({
          data: {
            orderNumber,

            userId,

            subtotal,

            shipping,

            tax,

            discount,

            total,

            status: "PENDING",

            paymentStatus:
              "PENDING",

            items: {
              create: cart.items.map(
                (item) => {
                  const unitPrice =
                    new Prisma.Decimal(
                      item.product.price
                    );

                  const itemTotal =
                    unitPrice.mul(
                      item.quantity
                    );

                  return {
                    productId:
                      item.productId,

                    quantity:
                      item.quantity,

                    unitPrice,

                    total:
                      itemTotal,
                  };
                }
              ),
            },
          },

          include: {
            items: true,
          },
        });

      // ========================================
      // Create Shipment Record
      // ========================================

      await tx.shipment.create({
        data: {
          orderId:
            order.id,

          addressId:
            address.id,

          status:
            "PENDING",
        },
      });

      // ========================================
      // Clear Cart
      // ========================================

      await tx.cartItem.deleteMany({
        where: {
          cartId:
            cart.id,
        },
      });

      // ========================================
      // Return Order
      // ========================================

      return order;
    });
  }

  // ============================================
  // Get Order
  // ============================================

  async getById(
    userId: string,
    orderId: string
  ) {
    return prisma.order.findFirst({
      where: {
        id: orderId,
        userId,
      },

      include: {
        items: {
          include: {
            product: {
              include: {
                brand: true,
                images: {
                  orderBy: [
                    {
                      sortOrder:
                        "asc",
                    },
                    {
                      createdAt:
                        "asc",
                    },
                  ],

                  take: 1,
                },
              },
            },
          },
        },

        shipments: {
          include: {
            address: true,
          },
        },

        payments: true,
      },
    });
  }
}

export const orderService =
  new OrderService();