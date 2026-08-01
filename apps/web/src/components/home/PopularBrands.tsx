import Image from "next/image";
import Link from "next/link";

import { brands } from "@/data/homepage";

export default function PopularBrands() {
  return (
    <section className="bg-gray-50 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-14 text-center">
          <span className="text-sm font-semibold uppercase tracking-[0.3em] text-gray-500">
            Trusted Brands
          </span>

          <h2 className="mt-3 text-4xl font-bold tracking-tight">
            Popular Brands
          </h2>

          <p className="mt-4 text-lg text-gray-600">
            Shop from some of the world's most recognized and trusted brands.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {brands.map((brand) => (
            <Link
              key={brand.id}
              href={`/brands/${brand.id}`}
              className="group rounded-3xl border bg-white p-8 shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl"
            >
              <div className="flex h-28 items-center justify-center">
                <Image
                  src={brand.logo}
                  alt={brand.name}
                  width={120}
                  height={60}
                  className="object-contain transition duration-300 group-hover:scale-105"
                />
              </div>

              <div className="mt-8 text-center">
                <h3 className="text-2xl font-bold">
                  {brand.name}
                </h3>

                <p className="mt-3 text-gray-600">
                  Premium Brand
                </p>

                <div className="mt-6 flex items-center justify-center gap-6 text-sm text-gray-500">
                  <span>★★★★★</span>

                  <span>Verified</span>
                </div>

                <div className="mt-8 inline-flex rounded-full bg-black px-6 py-2 text-sm font-semibold text-white transition group-hover:bg-gray-900">
                  View Brand
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
