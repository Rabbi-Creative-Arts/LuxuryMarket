import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/auth";

import { orderService } from "@/features/orders/services/order.service";

interface Props {
  searchParams: Promise<{
    order?: string;
  }>;
}

export default async function CheckoutSuccessPage({
  searchParams,
}: Props) {
  // ============================================
  // Authentication
  // ============================================

  const session = await auth();

  const userId = (
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
  // Get Order ID
  // ============================================

  const params = await searchParams;

  const orderId = params.order;

  if (!orderId) {
    redirect("/products");
  }

  // ============================================
  // Get Order
  // ============================================

  const order =
    await orderService.getById(
      userId,
      orderId
    );

  if (!order) {
    return (
      <main className="min-h-screen bg-white">
        <div className="mx-auto max-w-3xl px-6 py-20 text-center">

          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 text-3xl">
            !
          </div>

          <h1 className="mt-6 text-3xl font-bold">
            Order Not Found
          </h1>

          <p className="mt-3 text-gray-500">
            We could not find the requested order.
          </p>

          <Link
            href="/products"
            className="mt-8 inline-block rounded-xl bg-black px-6 py-3 font-medium text-white hover:bg-gray-800"
          >
            Continue Shopping
          </Link>

        </div>
      </main>
    );
  }

  // ============================================
  // Page
  // ============================================

  return (
    <main className="min-h-screen bg-white">

      <div className="mx-auto max-w-5xl px-6 py-12">

        {/* ======================================
            Success Header
        ======================================= */}

        <div className="text-center">

          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-black text-3xl text-white">
            ✓
          </div>

          <p className="mt-6 text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
            Order Received
          </p>

          <h1 className="mt-2 text-4xl font-bold">
            Thank You For Your Order
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-gray-500">
            Your order has been successfully created.
            We are currently waiting for payment.
          </p>

        </div>

        {/* ======================================
            Order Information
        ======================================= */}

        <div className="mt-10 rounded-2xl border border-gray-200 bg-white p-6 md:p-8">

          <div className="grid gap-6 md:grid-cols-3">

            {/* Order Number */}

            <div>
              <p className="text-sm text-gray-500">
                Order Number
              </p>

              <p className="mt-1 font-semibold">
                {order.orderNumber}
              </p>
            </div>

            {/* Order Status */}

            <div>
              <p className="text-sm text-gray-500">
                Order Status
              </p>

              <span className="mt-1 inline-block rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-800">
                {order.status}
              </span>
            </div>

            {/* Payment Status */}

            <div>
              <p className="text-sm text-gray-500">
                Payment Status
              </p>

              <span className="mt-1 inline-block rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-800">
                {order.paymentStatus}
              </span>
            </div>

          </div>

        </div>

        {/* ======================================
            Items
        ======================================= */}

        <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 md:p-8">

          <h2 className="text-xl font-semibold">
            Order Items
          </h2>

          <div className="mt-6 divide-y">

            {order.items.map((item) => {

              const image =
                item.product.images[0];

              return (
                <div
                  key={item.id}
                  className="flex gap-5 py-5"
                >

                  {/* Product Image */}

                  <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-gray-100">

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
                      <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                        No Image
                      </div>
                    )}

                  </div>

                  {/* Product Information */}

                  <div className="flex flex-1 flex-col justify-center">

                    <p className="font-semibold">
                      {item.product.name}
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      Brand:{" "}
                      {item.product.brand.name}
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      Quantity:{" "}
                      {item.quantity}
                    </p>

                  </div>

                  {/* Price */}

                  <div className="flex items-center">

                    <p className="font-semibold">
                      $
                      {Number(
                        item.total
                      ).toLocaleString(
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

        </div>

        {/* ======================================
            Order Total
        ======================================= */}

        <div className="mt-8 rounded-2xl border bg-gray-50 p-6 md:p-8">

          <div className="ml-auto max-w-md space-y-4">

            <div className="flex justify-between">

              <span className="text-gray-600">
                Subtotal
              </span>

              <span className="font-medium">
                $
                {Number(
                  order.subtotal
                ).toLocaleString(
                  "en-US",
                  {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }
                )}
              </span>

            </div>

            <div className="flex justify-between">

              <span className="text-gray-600">
                Shipping
              </span>

              <span className="font-medium">
                $
                {Number(
                  order.shipping
                ).toLocaleString(
                  "en-US",
                  {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }
                )}
              </span>

            </div>

            <div className="flex justify-between">

              <span className="text-gray-600">
                Tax
              </span>

              <span className="font-medium">
                $
                {Number(
                  order.tax
                ).toLocaleString(
                  "en-US",
                  {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }
                )}
              </span>

            </div>

            <div className="flex justify-between">

              <span className="text-gray-600">
                Discount
              </span>

              <span className="font-medium">
                -$
                {Number(
                  order.discount
                ).toLocaleString(
                  "en-US",
                  {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }
                )}
              </span>

            </div>

            <div className="border-t pt-4">

              <div className="flex justify-between">

                <span className="text-xl font-semibold">
                  Total
                </span>

                <span className="text-2xl font-bold">
                  $
                  {Number(
                    order.total
                  ).toLocaleString(
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

        </div>

        {/* ======================================
            Payment Notice
        ======================================= */}

        <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6">

          <h2 className="font-semibold">
            Payment
          </h2>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            Your order has been created but payment
            has not yet been processed. Payment
            integration will be connected in the
            next checkout stage.
          </p>

        </div>

        {/* ======================================
            Actions
        ======================================= */}

        <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">

          <Link
            href="/products"
            className="rounded-xl bg-black px-8 py-4 text-center font-medium text-white hover:bg-gray-800"
          >
            Continue Shopping
          </Link>

          <Link
            href="/"
            className="rounded-xl border border-black px-8 py-4 text-center font-medium hover:bg-gray-50"
          >
            Back to Home
          </Link>

        </div>

      </div>

    </main>
  );
}