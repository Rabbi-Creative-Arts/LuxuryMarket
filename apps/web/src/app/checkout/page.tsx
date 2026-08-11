import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/auth";

import { cartService } from "@/features/cart/services/cart.service";
import { createOrder } from "@/features/orders/actions/create-order";

export default async function CheckoutPage() {
  // ============================================
  // Authentication
  // ============================================

  const session =
    await auth();

  const userId =
    (
      session?.user as
        | {
            id?: string;
          }
        | undefined
    )?.id;

  if (!userId) {
    redirect("/login");
  }

  // ============================================
  // Get Cart
  // ============================================

  const cart =
    await cartService.getCart(
      userId
    );

  if (
    !cart ||
    cart.items.length === 0
  ) {
    redirect("/cart");
  }

  // ============================================
  // Calculate Total
  // ============================================

  const subtotal =
    cart.items.reduce(
      (total, item) =>
        total +
        Number(
          item.product.price
        ) *
          item.quantity,
      0
    );

  // ============================================
  // Page
  // ============================================

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-6 py-12">

        {/* Header */}

        <div className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
            Checkout
          </p>

          <h1 className="mt-2 text-4xl font-bold">
            Complete Your Order
          </h1>

          <p className="mt-2 text-gray-500">
            Enter your shipping information to
            create your order.
          </p>
        </div>

        {/* Checkout Layout */}

        <div className="grid gap-10 lg:grid-cols-[1fr_380px]">

          {/* ======================================
              Customer Information
          ======================================= */}

          <form
            action={createOrder}
            className="space-y-8 rounded-2xl border border-gray-200 bg-white p-6 md:p-8"
          >

            {/* Customer */}

            <section>
              <h2 className="text-xl font-semibold">
                Customer Information
              </h2>

              <div className="mt-5 grid gap-5 md:grid-cols-2">

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    First Name *
                  </label>

                  <input
                    name="firstName"
                    type="text"
                    required
                    className="w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-black"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Last Name *
                  </label>

                  <input
                    name="lastName"
                    type="text"
                    required
                    className="w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-black"
                  />
                </div>

              </div>

              <div className="mt-5">

                <label className="mb-2 block text-sm font-medium">
                  Company
                </label>

                <input
                  name="company"
                  type="text"
                  className="w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-black"
                />

              </div>

              <div className="mt-5">

                <label className="mb-2 block text-sm font-medium">
                  Phone *
                </label>

                <input
                  name="phone"
                  type="tel"
                  required
                  className="w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-black"
                />

              </div>
            </section>

            {/* Shipping */}

            <section className="border-t pt-8">

              <h2 className="text-xl font-semibold">
                Shipping Address
              </h2>

              <div className="mt-5">

                <label className="mb-2 block text-sm font-medium">
                  Address Line 1 *
                </label>

                <input
                  name="addressLine1"
                  type="text"
                  required
                  className="w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-black"
                />

              </div>

              <div className="mt-5">

                <label className="mb-2 block text-sm font-medium">
                  Address Line 2
                </label>

                <input
                  name="addressLine2"
                  type="text"
                  className="w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-black"
                />

              </div>

              <div className="mt-5 grid gap-5 md:grid-cols-2">

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    City *
                  </label>

                  <input
                    name="city"
                    type="text"
                    required
                    className="w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-black"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    State *
                  </label>

                  <input
                    name="state"
                    type="text"
                    required
                    className="w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-black"
                  />
                </div>

              </div>

              <div className="mt-5 grid gap-5 md:grid-cols-2">

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Postal Code *
                  </label>

                  <input
                    name="postalCode"
                    type="text"
                    required
                    className="w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-black"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Country *
                  </label>

                  <input
                    name="country"
                    type="text"
                    required
                    defaultValue="Nigeria"
                    className="w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-black"
                  />
                </div>

              </div>

            </section>

            {/* Submit */}

            <section className="border-t pt-8">

              <button
                type="submit"
                className="w-full rounded-xl bg-black px-6 py-4 text-lg font-medium text-white transition hover:bg-gray-800"
              >
                Create Order
              </button>

              <p className="mt-3 text-center text-sm text-gray-500">
                Payment will be added in the next checkout phase.
              </p>

            </section>

          </form>

          {/* ======================================
              Order Summary
          ======================================= */}

          <aside className="h-fit rounded-2xl border bg-gray-50 p-6 lg:sticky lg:top-24">

            <h2 className="text-xl font-semibold">
              Order Summary
            </h2>

            <div className="mt-6 space-y-5">

              {cart.items.map(
                (item) => (
                  <div
                    key={item.id}
                    className="flex justify-between gap-4"
                  >

                    <div>

                      <p className="font-medium">
                        {item.product.name}
                      </p>

                      <p className="mt-1 text-sm text-gray-500">
                        Qty: {item.quantity}
                      </p>

                    </div>

                    <p className="font-medium">
                      $
                      {(
                        Number(
                          item.product.price
                        ) *
                        item.quantity
                      ).toLocaleString(
                        "en-US",
                        {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }
                      )}
                    </p>

                  </div>
                )
              )}

            </div>

            <div className="mt-6 border-t pt-5">

              <div className="flex justify-between">

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

              <div className="mt-4 flex justify-between">

                <span className="text-gray-600">
                  Shipping
                </span>

                <span className="font-medium">
                  $0.00
                </span>

              </div>

              <div className="mt-5 border-t pt-5">

                <div className="flex justify-between">

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

            <Link
              href="/cart"
              className="mt-6 block text-center text-sm font-medium hover:underline"
            >
              ← Back to Cart
            </Link>

          </aside>

        </div>

      </div>
    </main>
  );
}