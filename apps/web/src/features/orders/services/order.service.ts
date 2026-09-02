import { Prisma } from "@prisma/client";

import { sellerEarningService } from "@/features/finance/services/seller-earning.service";
import { buildOrderItemSnapshots } from "@/features/finance/lib/seller-attribution";
import { toMoney, toRate } from "@/features/finance/lib/money";

import { prisma } from "@/lib/prisma";

export class OrderService {
  // ============================================
  // Create Pending Order From Cart
  //
  // Phase 3: in the SAME transaction we now also
  // snapshot seller attribution + commission onto
  // every OrderItem and recognize seller earnings
  // with balanced, idempotent ledger postings.
  // Checkout itself is unchanged — the financial
  // recognition rides along inside createFromCart.
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
      // Get Cart (with product + brand for the
      // seller attribution snapshot)
      // ========================================

      const cart = await tx.cart.findUnique({
        where: {
          userId,
        },
        include: {
          items: {
            include: {
              product: {
                include: {
                  brand: true,
                },
              },
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
        if (item.product.status !== "ACTIVE") {
          throw new Error(
            `The product "${item.product.name}" is no longer available.`
          );
        }
      }

      // ========================================
      // Get Current Marketplace Commission
      //
      // The Admin-configured rate is snapshotted
      // onto EVERY OrderItem and onto the order
      // header, so historical records never
      // depend on later settings changes.
      // ========================================

      const marketplaceSettings =
        await tx.marketplaceSettings.findFirst({
          where: {
            active: true,
          },
          orderBy: {
            updatedAt: "desc",
          },
        });

      const marketplaceCommissionRate = toRate(
        marketplaceSettings
          ? marketplaceSettings.commissionRate
          : 0
      );

      // ========================================
      // Build seller attribution snapshots + the
      // SINGLE authoritative money calculation.
      //
      // Line totals, per-item commission and
      // seller earnings are all derived here via
      // the finance money module (Decimal). The
      // order header totals and the ledger
      // postings consume these SAME values — no
      // independent re-calculation anywhere.
      // ========================================

      const itemSnapshots = buildOrderItemSnapshots(
        cart.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          product: {
            id: item.product.id,
            price: item.product.price,
            brand: item.product.brand
              ? {
                  id: item.product.brand.id,
                  name: item.product.brand.name,
                  ownerId: item.product.brand.ownerId,
                }
              : null,
          },
        })),
        marketplaceCommissionRate
      );

      const subtotal = itemSnapshots.reduce(
        (acc, snapshot) => acc.plus(snapshot.total),
        new Prisma.Decimal(0)
      );

      const totalCommission = itemSnapshots.reduce(
        (acc, snapshot) => acc.plus(snapshot.commissionAmount),
        new Prisma.Decimal(0)
      );

      // ========================================
      // Checkout Foundation
      // ========================================

      const shipping = new Prisma.Decimal(0);

      const tax = new Prisma.Decimal(0);

      const discount = new Prisma.Decimal(0);

      const total = subtotal
        .plus(shipping)
        .plus(tax)
        .minus(discount);

      // ========================================
      // Create Shipping Address
      // ========================================

      const address = await tx.address.create({
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
            data.addressLine2 || null,

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
      //
      // Every OrderItem carries the seller
      // snapshot (brand id/name/user id), the
      // commission rate actually applied, the
      // commission amount and the earning amount.
      // ========================================

      const order = await tx.order.create({
        data: {
          orderNumber,

          userId,

          subtotal: toMoney(subtotal),

          shipping,

          tax,

          discount,

          total: toMoney(total),

          // ====================================
          // Marketplace Commission Snapshot
          // (order-level aggregate of the
          // authoritative per-item calculation)
          // ====================================

          marketplaceCommissionRate,

          marketplaceCommissionAmount:
            toMoney(totalCommission),

          status: "PENDING",

          paymentStatus:
            "PENDING",

          items: {
            create: itemSnapshots.map(
              (snapshot) => ({
                productId:
                  snapshot.productId,

                quantity:
                  snapshot.quantity,

                unitPrice:
                  snapshot.unitPrice,

                total:
                  snapshot.total,

                // ============================
                // Phase 3: seller snapshot
                // ============================

                sellerBrandId:
                  snapshot.sellerBrandId,

                sellerBrandName:
                  snapshot.sellerBrandName,

                sellerUserId:
                  snapshot.sellerUserId,

                commissionRate:
                  snapshot.commissionRate,

                commissionAmount:
                  snapshot.commissionAmount,

                earningAmount:
                  snapshot.earningAmount,
              })
            ),
          },
        },

        include: {
          items: true,
        },
      });

      // ========================================
      // Phase 3: Recognize seller earnings +
      // post the balanced settlement ledger
      // transactions (one per seller), inside
      // the same DB transaction. Idempotent on
      // orderItemId and on the transaction
      // reference, so a retry never double-moves
      // money.
      // ========================================

      await sellerEarningService.recognizeForOrder(
        tx,
        {
          orderId: order.id,

          items: order.items
            .filter(
              (item) => item.sellerBrandId !== null
            )
            .map((item) => ({
              orderItemId: item.id,
              sellerBrandId: item.sellerBrandId as string,
              sellerBrandName: item.sellerBrandName as string,
              sellerUserId: item.sellerUserId,
              grossAmount: item.total,
              commissionRate: item.commissionRate,
            })),

          createdBy: userId,
        }
      );

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

        earnings: true,
      },
    });
  }
}

export const orderService =
  new OrderService();
