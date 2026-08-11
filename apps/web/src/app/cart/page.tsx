import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/auth";

import { cartService } from "@/features/cart/services/cart.service";
import {
  removeCartItem,
  updateCartItem,
} from "@/features/cart/actions/cart.actions";

export default async function CartPage() {
  // ============================================
  // Authentication
  // ============================================

  const session = await auth();

  const userId =
    (session?.user as {
      id?: string;
    } | undefined)?.id;

  if (!userId) {
    redirect("/login");
  }

  // ============================================
  // Get Cart
  // ============================================

  const cart = await cartService.getCart(userId);

  // ============================================
  // Empty Cart
  // ============================================

  if (!cart || cart.items.length === 0) {
    return (
      <main className="min-h-screen bg-white">
        <div className="mx-auto max-w-6xl px-6 py-16">

          <div className="mb-10">
            <h1 className="text-4xl font-bold tracking-tight">
              Your Cart
            </h1>

            <p className="mt-2 text-gray-500">
              Review the luxury products you have selected.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-gray-50 px-6 py-16 text-center">

            <h2 className="text-2xl font-semibold">
              Your cart is empty
            </h2>

            <p className="mt-3 text-gray-500">
              You have not added any products to your cart yet.
            </p>

            <Link
              href="/products"
              className="mt-8 inline-flex rounded-xl bg-black px-7 py-3 font-medium text-white transition hover:bg-gray-800"
            >
              Continue Shopping
            </Link>

          </div>
        </div>
      </main>
    );
  }

  // ============================================
  // Calculate Totals
  // ============================================

  const subtotal = cart.items.reduce(
    (total, item) => {
      return (
        total +
        Number(item.product.price) *
          item.quantity
      );
    },
    0
  );

  const itemCount = cart.items.reduce(
    (total, item) => {
      return total + item.quantity;
    },
    0
  );

  // ============================================
  // Page
  // ============================================

  return (
    <main className="min-h-screen bg-white">

      <div className="mx-auto max-w-7xl px-6 py-12">

        {/* ============================================
            Header
        ============================================ */}

        <div className="mb-10">

          <h1 className="text-4xl font-bold tracking-tight">
            Shopping Cart
          </h1>

          <p className="mt-2 text-gray-500">
            {itemCount}{" "}
            {itemCount === 1
              ? "item"
              : "items"}{" "}
            in your cart.
          </p>

        </div>

        {/* ============================================
            Cart Layout
        ============================================ */}

        <div className="grid gap-10 lg:grid-cols-[1fr_380px]">

          {/* ============================================
              Cart Items
          ============================================ */}

          <section className="space-y-5">

            {cart.items.map((item) => {

              const product =
                item.product;

              const image =
                product.images[0];

              const itemTotal =
                Number(product.price) *
                item.quantity;

              return (
                <div
                  key={item.id}
                  className="rounded-2xl border border-gray-200 bg-white p-5"
                >

                  <div className="flex gap-5">

                    {/* Product Image */}

                    <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-xl border border-gray-200 bg-gray-50">

                      {image?.url ? (
                        <Image
                          src={image.url}
                          alt={
                            image.alt ||
                            product.name
                          }
                          fill
                          className="object-cover"
                          sizes="128px"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-sm text-gray-400">
                          No image
                        </div>
                      )}

                    </div>

                    {/* Product Information */}

                    <div className="min-w-0 flex-1">

                      <div className="flex flex-col justify-between gap-4 sm:flex-row">

                        <div>

                          <p className="text-sm text-gray-500">
                            {product.brand.name}
                          </p>

                          <h2 className="mt-1 text-xl font-semibold">
                            {product.name}
                          </h2>

                          <p className="mt-1 text-sm text-gray-500">
                            {product.category.name}
                          </p>

                        </div>

                        <div className="text-left sm:text-right">

                          <p className="text-lg font-semibold">
                            $
                            {Number(
                              product.price
                            ).toLocaleString(
                              "en-US",
                              {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              }
                            )}
                          </p>

                          <p className="mt-1 text-sm text-gray-500">
                            each
                          </p>

                        </div>

                      </div>

                      {/* Quantity + Remove */}

                      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">

                        <div className="flex items-center gap-3">

                          <span className="text-sm font-medium">
                            Quantity
                          </span>

                          {/* Decrease */}

                          <form
                            action={updateCartItem.bind(
                              null,
                              item.id,
                              item.quantity - 1
                            )}
                          >
                            <button
                              type="submit"
                              disabled={
                                item.quantity <= 1
                              }
                              className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-300 text-lg transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                              aria-label="Decrease quantity"
                            >
                              −
                            </button>
                          </form>

                          {/* Quantity */}

                          <span className="min-w-8 text-center font-medium">
                            {item.quantity}
                          </span>

                          {/* Increase */}

                          <form
                            action={updateCartItem.bind(
                              null,
                              item.id,
                              item.quantity + 1
                            )}
                          >
                            <button
                              type="submit"
                              className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-300 text-lg transition hover:bg-gray-100"
                              aria-label="Increase quantity"
                            >
                              +
                            </button>
                          </form>

                        </div>

                        <div className="flex items-center gap-6">

                          <p className="font-semibold">
                            $
                            {itemTotal.toLocaleString(
                              "en-US",
                              {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              }
                            )}
                          </p>

                          {/* Remove */}

                          <form
                            action={removeCartItem.bind(
                              null,
                              item.id
                            )}
                          >
                            <button
                              type="submit"
                              className="text-sm text-red-600 transition hover:text-red-800 hover:underline"
                            >
                              Remove
                            </button>
                          </form>

                        </div>

                      </div>

                    </div>

                  </div>

                </div>
              );
            })}

          </section>

          {/* ============================================
              Order Summary
          ============================================ */}

          <aside className="h-fit rounded-2xl border border-gray-200 bg-gray-50 p-6 lg:sticky lg:top-24">

            <h2 className="text-2xl font-semibold">
              Order Summary
            </h2>

            <div className="mt-6 space-y-4">

              {/* Items */}

              <div className="flex items-center justify-between">

                <span className="text-gray-600">
                  Items
                </span>

                <span className="font-medium">
                  {itemCount}
                </span>

              </div>

              {/* Subtotal */}

              <div className="flex items-center justify-between">

                <span className="text-gray-600">
                  Subtotal
                </span>

                <span className="font-medium">
                  $
                  {subtotal.toLocaleString(
                    "en-US",
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }
                  )}
                </span>

              </div>

              {/* Shipping */}

              <div className="flex items-center justify-between">

                <span className="text-gray-600">
                  Shipping
                </span>

                <span className="font-medium">
                  Calculated at checkout
                </span>

              </div>

              {/* Total */}

              <div className="border-t border-gray-300 pt-4">

                <div className="flex items-center justify-between">

                  <span className="text-lg font-semibold">
                    Total
                  </span>

                  <span className="text-2xl font-bold">
                    $
                    {subtotal.toLocaleString(
                      "en-US",
                      {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }
                    )}
                  </span>

                </div>

              </div>

            </div>

            {/* ============================================
                Checkout
            ============================================ */}

            <Link
              href="/checkout"
              className="mt-8 block w-full rounded-xl bg-black px-6 py-4 text-center text-lg font-medium text-white transition hover:bg-gray-800"
            >
              Checkout
            </Link>

            <p className="mt-3 text-center text-sm text-gray-500">
              Proceed to enter your shipping information.
            </p>

            {/* ============================================
                Continue Shopping
            ============================================ */}

            <Link
              href="/products"
              className="mt-5 block w-full rounded-xl border border-black px-6 py-3 text-center font-medium transition hover:bg-white"
            >
              Continue Shopping
            </Link>

          </aside>

        </div>

      </div>

    </main>
  );
}