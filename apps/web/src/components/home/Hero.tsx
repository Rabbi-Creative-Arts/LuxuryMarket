import Link from "next/link";

import { hero } from "@/data/homepage";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white">
      <div className="mx-auto flex min-h-[700px] max-w-7xl flex-col items-center justify-center px-6 py-24 text-center">
        <span className="mb-6 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-medium">
          Premium Global Marketplace
        </span>

        <h1 className="max-w-5xl text-5xl font-extrabold leading-tight md:text-7xl">
          {hero.title}
        </h1>

        <p className="mt-8 max-w-3xl text-lg leading-8 text-gray-300 md:text-xl">
          {hero.subtitle}
        </p>

        <div className="mt-12 flex flex-wrap justify-center gap-5">
          <Link
            href="/products"
            className="rounded-xl bg-white px-8 py-4 text-lg font-semibold text-black transition hover:scale-105"
          >
            {hero.primaryButton}
          </Link>

          <Link
            href="/vendors/register"
            className="rounded-xl border border-white px-8 py-4 text-lg font-semibold transition hover:bg-white hover:text-black"
          >
            {hero.secondaryButton}
          </Link>
        </div>

        <div className="mt-20 grid w-full max-w-5xl grid-cols-2 gap-8 rounded-3xl border border-white/10 bg-white/5 p-10 backdrop-blur md:grid-cols-4">
          <div>
            <h2 className="text-4xl font-bold">10K+</h2>
            <p className="mt-2 text-gray-300">
              Products
            </p>
          </div>

          <div>
            <h2 className="text-4xl font-bold">500+</h2>
            <p className="mt-2 text-gray-300">
              Brands
            </p>
          </div>

          <div>
            <h2 className="text-4xl font-bold">100+</h2>
            <p className="mt-2 text-gray-300">
              Vendors
            </p>
          </div>

          <div>
            <h2 className="text-4xl font-bold">50+</h2>
            <p className="mt-2 text-gray-300">
              Countries
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
