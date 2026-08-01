import Image from "next/image";
import Link from "next/link";

import { products } from "@/data/homepage";

export default function TrendingProducts() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-14 text-center">
          <span className="text-sm font-semibold uppercase tracking-[0.3em] text-gray-500">
            Trending
          </span>

          <h2 className="mt-3 text-4xl font-bold tracking-tight">
            Trending Products
          </h2>

          <p className="mt-4 text-lg text-gray-600">
            Discover some of the most popular products on LuxuryMarket.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className="group overflow-hidden rounded-3xl border bg-white shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl"
            >
              <div className="relative h-64">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
              </div>

              <div className="p-6">
                <p className="text-sm text-gray-500">
                  {product.brand}
                </p>

                <h3 className="mt-2 text-xl font-bold">
                  {product.name}
                </h3>

                <p className="mt-4 text-2xl font-extrabold">
                  ${product.price.toLocaleString()}
                </p>

                <div className="mt-6 rounded-xl bg-black py-3 text-center font-semibold text-white transition group-hover:bg-gray-900">
                  View Product
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
