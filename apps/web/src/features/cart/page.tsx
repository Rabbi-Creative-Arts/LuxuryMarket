import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/auth";

import { cartService } from "@/features/cart/services/cart.service";

import CartItemControls from "@/features/cart/components/CartItemControls";

export default async function CartPage() {
  const session = await auth();

  const userId =
    (session?.user as {
      id?: string;
    } | undefined)?.id;

  if (!userId) {
    redirect("/login");
  }

  const cart =
    await cartService.getCart(
      userId
    );

  const items =
    cart?.items ?? [];

  const subtotal =
    items.reduce(
      (total, item) =>
        total +
        Number(
          item.product.price
        ) *
          item.quantity,
      0
    );

  return (
    <main className="min-h-screen bg-white">

      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">

        {/* Header */}

        <div className="mb-10">

          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
            Shopping
          </p>

          <h1 className="mt-2 text-4xl font-bold">
            Your Cart
          </h1>

        </div>

        {items.length === 0 ? (
          /* =====================================
             Empty Cart
          ====================================== */

          <div className="rounded-2xl border bg-gray-50 px-6 py-20 text-center">

            <h2 className="text-2xl font-semibold">
              Your cart is empty
            </h2>

            <p className="mt-3 text-gray-500">
              Explore our products and
              discover something exceptional.
            </p>

            <Link
              href="/"
              className="mt-8 inline-block rounded-xl bg-black px-8 py-4 font-medium text-white hover:bg-gray-800"
            >
              Continue Shopping
            </Link>

          </div>
        ) : (
          /* =====================================
             Cart
          ====================================== */

          <div className="grid gap-10 lg:grid-cols-[1fr_380px]">

            {/* Items */}

            <div className="space-y-5">

              {items.map((item) => {

                const image =
                  item.product
                    .images[0];

                const itemTotal =
                  Number(
                    item.product.price
                  ) *
                  item.quantity;

                return (
                  <div
                    key={item.id}
                    className="flex gap-5 rounded-2xl border p-5"
                  >

                    {/* Image */}

                    <Link
                      href={`/products/${item.product.slug}`}
                      className="h-28 w-28 shrink-0 overflow-hidden rounded-xl border bg-gray-50"
                    >
                      {image ? (
                        <img
                          src={image.url}
                          alt={
                            image.alt ||
                            item.product.name
                          }
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-xs text-gray-400">
                          No image
                        </div>
                      )}
                    </Link>

                    {/* Information */}

                    <div className="flex min-w-0 flex-1 flex-col">

                      <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                        {
                          item.product
                            .brand.name
                        }
                      </p>

                      <Link
                        href={`/products/${item.product.slug}`}
                        className="mt-1 text-lg font-semibold hover:underline"
                      >
                        {
                          item.product
                            .name
                        }
                      </Link>

                      <p className="mt-2 text-sm text-gray-500">
                        $
                        {Number(
                          item.product.price
                        ).toLocaleString(
                          "en-US",
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }
                        )}{" "}
                        each
                      </p>

                      <div className="mt-auto pt-4">
                        <CartItemControls
                          itemId={item.id}
                          quantity={item.quantity}
                        />
                      </div>

                    </div>

                    {/* Total */}

                    <div className="text-right">

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

                    </div>

                  </div>
                );
              })}

            </div>

            {/* Summary */}

            <aside className="h-fit rounded-2xl border bg-gray-50 p-6">

              <h2 className="text-xl font-semibold">
                Order Summary
              </h2>

              <div className="mt-6 space-y-4">

                <div className="flex justify-between">
                  <span className="text-gray-500">
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

                <div className="flex justify-between">
                  <span className="text-gray-500">
                    Shipping
                  </span>

                  <span className="font-medium">
                    Calculated at checkout
                  </span>
                </div>

                <div className="border-t pt-4">

                  <div className="flex justify-between">

                    <span className="text-lg font-semibold">
                      Total
                    </span>

                    <span className="text-lg font-semibold">
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

              <button
                type="button"
                className="mt-8 w-full rounded-xl bg-black px-6 py-4 font-medium text-white transition hover:bg-gray-800"
              >
                Proceed to Checkout
              </button>

              <Link
                href="/"
                className="mt-4 block text-center text-sm font-medium hover:underline"
              >
                Continue Shopping
              </Link>

            </aside>

          </div>
        )}

      </div>

    </main>
  );
}