import Link from "next/link";
import { notFound } from "next/navigation";

import ProductGallery from "@/features/products/components/ProductGallery";
import AddToCartButton from "@/features/cart/components/AddToCartButton";

import { prisma } from "@/lib/prisma";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProductPage({
  params,
}: PageProps) {
  const { slug } = await params;

  const product =
    await prisma.product.findUnique({
      where: {
        slug,
      },

      include: {
        brand: true,
        category: true,
        images: true,
      },
    });

  if (!product) {
    notFound();
  }

  const relatedProducts =
    await prisma.product.findMany({
      where: {
        categoryId: product.categoryId,

        id: {
          not: product.id,
        },

        status: "ACTIVE",
      },

      include: {
        brand: true,
        category: true,
      },

      orderBy: {
        createdAt: "desc",
      },

      take: 4,
    });

  const displayStatus =
    product.status
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (letter) =>
        letter.toUpperCase()
      );

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">

        {/* =====================================================
            BREADCRUMB
        ====================================================== */}

        <nav className="mb-10 flex flex-wrap items-center gap-2 text-sm text-gray-500">

          <Link
            href="/"
            className="transition hover:text-black"
          >
            Home
          </Link>

          <span>/</span>

          <span>
            {product.category.name}
          </span>

          <span>/</span>

          <span className="text-black">
            {product.name}
          </span>

        </nav>

        {/* =====================================================
            MAIN PRODUCT SECTION
        ====================================================== */}

        <section className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-20">

          {/* ===================================================
              PRODUCT MEDIA
          ==================================================== */}

          <div className="space-y-5">

            <div className="flex aspect-square items-center justify-center overflow-hidden rounded-2xl border bg-gray-50">

              {product.images.length > 0 ? (
                <img
                  src={product.images[0].url}
                  alt={product.name}
                  className="h-full w-full object-contain"
                />
              ) : (
                <div className="px-6 text-center">

                  <div className="text-lg font-medium text-gray-400">
                    Product Image
                  </div>

                  <p className="mt-2 text-sm text-gray-400">
                    Product gallery coming soon.
                  </p>

                </div>
              )}

            </div>

            {/* =================================================
                THUMBNAIL GALLERY
            ================================================== */}

            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">

                {product.images
                  .slice(0, 4)
                  .map((image) => (
                    <div
                      key={image.id}
                      className="aspect-square overflow-hidden rounded-lg border bg-gray-50"
                    >
                      <img
                        src={image.url}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ))}

              </div>
            )}

          </div>

          {/* ===================================================
              PRODUCT INFORMATION
          ==================================================== */}

          <div className="flex flex-col">

            {/* =================================================
                BRAND
            ================================================== */}

            <div className="mb-4">

              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
                {product.brand.name}
              </p>

            </div>

            {/* =================================================
                PRODUCT NAME
            ================================================== */}

            <h1 className="text-4xl font-bold tracking-tight text-black md:text-5xl">
              {product.name}
            </h1>

            {/* =================================================
                BADGES
            ================================================== */}

            <div className="mt-5 flex flex-wrap gap-2">

              {product.featured && (
                <span className="rounded-full bg-black px-4 py-2 text-xs font-medium uppercase tracking-wide text-white">
                  Featured
                </span>
              )}

              <span className="rounded-full border px-4 py-2 text-xs font-medium uppercase tracking-wide">
                {displayStatus}
              </span>

            </div>

            {/* =================================================
                PRICE
            ================================================== */}

            <div className="mt-8">

              <p className="text-3xl font-semibold">
                ${Number(product.price).toFixed(2)}
              </p>

            </div>

            {/* =================================================
                DESCRIPTION
            ================================================== */}

            <div className="mt-8 border-t pt-8">

              <h2 className="text-lg font-semibold">
                Description
              </h2>

              <p className="mt-4 whitespace-pre-line leading-8 text-gray-600">
                {product.description ||
                  "Product description coming soon."}
              </p>

            </div>

            {/* =================================================
                PRODUCT DETAILS
            ================================================== */}

            <div className="mt-8 border-t pt-8">

              <h2 className="text-lg font-semibold">
                Product Details
              </h2>

              <dl className="mt-5 space-y-4">

                {/* Brand */}

                <div className="flex justify-between gap-6 border-b pb-3">

                  <dt className="text-gray-500">
                    Brand
                  </dt>

                  <dd className="text-right font-medium">
                    {product.brand.name}
                  </dd>

                </div>

                {/* Category */}

                <div className="flex justify-between gap-6 border-b pb-3">

                  <dt className="text-gray-500">
                    Category
                  </dt>

                  <dd className="text-right font-medium">
                    {product.category.name}
                  </dd>

                </div>

                {/* SKU */}

                <div className="flex justify-between gap-6 border-b pb-3">

                  <dt className="text-gray-500">
                    SKU
                  </dt>

                  <dd className="text-right font-medium">
                    {product.sku}
                  </dd>

                </div>

                {/* Availability */}

                <div className="flex justify-between gap-6 border-b pb-3">

                  <dt className="text-gray-500">
                    Availability
                  </dt>

                  <dd className="text-right font-medium">
                    {displayStatus}
                  </dd>

                </div>

              </dl>

            </div>

            {/* =================================================
                PURCHASE / CART
            ================================================== */}

            <div className="mt-10 border-t pt-8">

              {/* =================================================
                  ADD TO CART
              ================================================== */}

              <AddToCartButton
                productId={product.id}
              />

              {/* =================================================
                  DIVIDER
              ================================================== */}

              <div className="my-5 flex items-center gap-4">

                <div className="h-px flex-1 bg-gray-200" />

                <span className="text-sm text-gray-400">
                  or
                </span>

                <div className="h-px flex-1 bg-gray-200" />

              </div>

              {/* =================================================
                  OFFICIAL BRAND PURCHASE
              ================================================== */}

              {product.affiliateUrl ? (
                <>

                  <a
                    href={`/go/${product.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-center justify-center rounded-xl border border-black px-8 py-4 text-center text-lg font-medium text-black transition hover:bg-gray-50"
                  >
                    {product.buyButtonText ||
                      "Buy on Official Brand Website"}
                  </a>

                  <p className="mt-3 text-center text-sm text-gray-500">
                    Opens the official brand website
                    in a new tab.
                  </p>

                </>
              ) : (

                <div className="rounded-xl border bg-gray-50 p-5 text-center">

                  <p className="font-medium">
                    Purchase link unavailable
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    The official purchase link has
                    not been added yet.
                  </p>

                </div>

              )}

            </div>

            {/* =================================================
                SECONDARY ACTIONS
            ================================================== */}

            <div className="mt-4 grid grid-cols-2 gap-3">

              <button
                type="button"
                className="rounded-xl border px-5 py-3 font-medium transition hover:bg-gray-50"
              >
                ♡ Wishlist
              </button>

              <button
                type="button"
                className="rounded-xl border px-5 py-3 font-medium transition hover:bg-gray-50"
              >
                Share
              </button>

            </div>

          </div>

        </section>

        {/* =====================================================
            BRAND SECTION
        ====================================================== */}

        <section className="mt-24 border-t pt-12">

          <div className="rounded-2xl bg-gray-50 p-8 md:p-10">

            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
              Official Brand
            </p>

            <h2 className="mt-3 text-3xl font-bold">
              {product.brand.name}
            </h2>

            {product.brand.country && (
              <p className="mt-3 text-gray-600">
                {product.brand.country}
              </p>
            )}

            {product.brand.description && (
              <p className="mt-5 max-w-3xl leading-7 text-gray-600">
                {product.brand.description}
              </p>
            )}

          </div>

        </section>

        {/* =====================================================
            PRODUCT VIDEO
        ====================================================== */}

        <section className="mt-20 border-t pt-12">

          <div className="mb-8">

            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
              Watch
            </p>

            <h2 className="mt-2 text-3xl font-bold">
              Product Video
            </h2>

          </div>

          <div className="flex aspect-video items-center justify-center rounded-2xl border bg-gray-50">

            <div className="text-center">

              <p className="font-medium text-gray-500">
                Embedded Product Video
              </p>

              <p className="mt-2 text-sm text-gray-400">
                YouTube / Vimeo integration coming next.
              </p>

            </div>

          </div>

        </section>

        {/* =====================================================
            RELATED PRODUCTS
        ====================================================== */}

        <section className="mt-20 border-t pt-12">

          <div className="flex items-end justify-between">

            <div>

              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
                Discover More
              </p>

              <h2 className="mt-2 text-3xl font-bold">
                Related Products
              </h2>

            </div>

          </div>

          {relatedProducts.length === 0 ? (

            <div className="mt-8 rounded-xl border bg-gray-50 p-8 text-center text-gray-500">
              More related products will appear here.
            </div>

          ) : (

            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

              {relatedProducts.map(
                (relatedProduct) => (

                  <Link
                    key={relatedProduct.id}
                    href={`/products/${relatedProduct.slug}`}
                    className="group"
                  >

                    <div className="aspect-square rounded-xl border bg-gray-50" />

                    <div className="mt-4">

                      <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                        {relatedProduct.brand.name}
                      </p>

                      <h3 className="mt-1 font-semibold transition group-hover:underline">
                        {relatedProduct.name}
                      </h3>

                      <p className="mt-2 font-medium">
                        $
                        {Number(
                          relatedProduct.price
                        ).toFixed(2)}
                      </p>

                    </div>

                  </Link>

                )
              )}

            </div>

          )}

        </section>

        {/* =====================================================
            CONTINUE SHOPPING
        ====================================================== */}

        <div className="mt-20 border-t pt-10">

          <Link
            href="/"
            className="font-medium hover:underline"
          >
            ← Continue Exploring LuxuryMarket
          </Link>

        </div>

      </div>
    </main>
  );
}