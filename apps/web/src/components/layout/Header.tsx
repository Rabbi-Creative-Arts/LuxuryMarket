"use client";



import Link from "next/link";



const navigation = [

  {

    name: "Categories",

    href: "/categories",

  },

  {

    name: "Brands",

    href: "/brands",

  },

  {

    name: "Products",

    href: "/products",

  },

  {

    name: "Vendors",

    href: "/vendors",

  },

];



export default function Header() {

  return (

    <header className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur">

      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">

        <Link

          href="/"

          className="text-3xl font-bold tracking-tight"

        >

          LuxuryMarket

        </Link>



        <nav className="hidden items-center gap-8 lg:flex">

          {navigation.map((item) => (

            <Link

              key={item.name}

              href={item.href}

              className="text-sm font-medium text-gray-700 transition hover:text-black"

            >

              {item.name}

            </Link>

          ))}

        </nav>



        <div className="hidden w-96 lg:block">

          <input

            type="search"

            placeholder="Search brands or products..."

            className="w-full rounded-full border px-5 py-3 outline-none transition focus:ring-2 focus:ring-black"

          />

        </div>



        <div className="flex items-center gap-3">

          <Link

            href="/login"

            className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-100"

          >

            Login

          </Link>



          <Link

            href="/cart"

            className="rounded-lg bg-black px-5 py-2 text-sm font-semibold text-white hover:bg-gray-900"

          >

            Cart

          </Link>

        </div>

      </div>

    </header>

  );

}
