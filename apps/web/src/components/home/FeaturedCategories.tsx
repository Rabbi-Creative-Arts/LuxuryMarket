import Link from "next/link";
import Image from "next/image";

import { categories } from "@/data/homepage";

export default function FeaturedCategories() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-14 text-center">
          <span className="text-sm font-semibold uppercase tracking-[0.3em] text-gray-500">
            Categories
          </span>

          <h2 className="mt-3 text-4xl font-bold tracking-tight">
            Featured Categories
          </h2>

          <p className="mt-4 text-lg text-gray-600">
            Explore thousands of products across our most popular categories.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/categories/${category.id}`}
              className="group overflow-hidden rounded-3xl border bg-white shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl"
            >
              <div className="relative h-64">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-110"
                />
              </div>

              <div className="p-8">
                <h3 className="text-2xl font-bold">
                  {category.name}
                </h3>

                <p className="mt-2 text-gray-600">
                  Browse premium products in {category.name}.
                </p>

                <span className="mt-6 inline-block font-semibold text-black">
                  Explore →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
