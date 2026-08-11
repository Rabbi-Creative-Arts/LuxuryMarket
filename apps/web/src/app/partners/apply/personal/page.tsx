import Link from "next/link";

import { createPartnerApplication } from "@/features/partners/actions/create-partner-application";

export default function PersonalBrandApplicationPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-4xl px-6 py-16">

        {/* ============================================
            Header
        ============================================ */}

        <div className="mb-10">

          <Link
            href="/partners/apply"
            className="text-sm text-gray-500 hover:text-black"
          >
            ← Back to Partner Types
          </Link>

          <p className="mt-8 text-sm font-semibold uppercase tracking-[0.25em] text-gray-500">
            UdoLuxury Partner Application
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight">
            Personal Brand Application
          </h1>

          <p className="mt-4 max-w-2xl text-gray-600">
            Tell us about your brand and the products you manufacture or
            sell. Your application will be reviewed by the UdoLuxury
            administration team before your products can go live.
          </p>

        </div>

        {/* ============================================
            Application Form
            ============================================ */}

        <form
          action={createPartnerApplication}
          className="space-y-10 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm"
        >

          {/* ============================================
              Business Information
          ============================================ */}

          <section>

            <h2 className="text-2xl font-bold">
              Business Information
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Provide the basic information about your business.
            </p>

            <div className="mt-6 grid gap-6 md:grid-cols-2">

              {/* Business Name */}

              <div>

                <label
                  htmlFor="businessName"
                  className="mb-2 block text-sm font-medium"
                >
                  Business Name *
                </label>

                <input
                  id="businessName"
                  name="businessName"
                  type="text"
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
                  placeholder="Your business name"
                />

              </div>

              {/* Brand Name */}

              <div>

                <label
                  htmlFor="brandName"
                  className="mb-2 block text-sm font-medium"
                >
                  Brand Name *
                </label>

                <input
                  id="brandName"
                  name="brandName"
                  type="text"
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
                  placeholder="Your brand name"
                />

              </div>

              {/* Personal Email */}

              <div>

                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium"
                >
                  Personal Email Address *
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
                  placeholder="you@gmail.com"
                />

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  Personal email addresses are accepted. You may use
                  Gmail, Yahoo, Outlook, Hotmail, iCloud, or another
                  valid email address.
                </p>

              </div>

              {/* Phone */}

              <div>

                <label
                  htmlFor="phone"
                  className="mb-2 block text-sm font-medium"
                >
                  Phone Number *
                </label>

                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  autoComplete="tel"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
                  placeholder="+234..."
                />

              </div>

            </div>

          </section>

          {/* ============================================
              Owner Information
          ============================================ */}

          <section className="border-t border-gray-200 pt-10">

            <h2 className="text-2xl font-bold">
              Owner / Contact Information
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Provide the name of the person responsible for this brand.
            </p>

            <div className="mt-6 grid gap-6 md:grid-cols-2">

              {/* First Name */}

              <div>

                <label
                  htmlFor="firstName"
                  className="mb-2 block text-sm font-medium"
                >
                  First Name *
                </label>

                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  autoComplete="given-name"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
                />

              </div>

              {/* Last Name */}

              <div>

                <label
                  htmlFor="lastName"
                  className="mb-2 block text-sm font-medium"
                >
                  Last Name *
                </label>

                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  autoComplete="family-name"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
                />

              </div>

            </div>

          </section>

          {/* ============================================
              Brand Information
          ============================================ */}

          <section className="border-t border-gray-200 pt-10">

            <h2 className="text-2xl font-bold">
              Brand Information
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Tell UdoLuxury about your brand and products.
            </p>

            <div className="mt-6 space-y-6">

              {/* Website */}

              <div>

                <label
                  htmlFor="website"
                  className="mb-2 block text-sm font-medium"
                >
                  Website
                </label>

                <input
                  id="website"
                  name="website"
                  type="url"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
                  placeholder="https://example.com"
                />

                <p className="mt-2 text-sm text-gray-500">
                  A website is optional for Personal Brands.
                </p>

              </div>

              {/* Description */}

              <div>

                <label
                  htmlFor="description"
                  className="mb-2 block text-sm font-medium"
                >
                  Tell Us About Your Brand *
                </label>

                <textarea
                  id="description"
                  name="description"
                  rows={6}
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
                  placeholder="Describe your brand, what you manufacture, and what makes your products unique."
                />

              </div>

              {/* Product Type */}

              <div>

                <label
                  htmlFor="productType"
                  className="mb-2 block text-sm font-medium"
                >
                  What Do You Manufacture or Sell? *
                </label>

                <input
                  id="productType"
                  name="productType"
                  type="text"
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
                  placeholder="e.g. Watches, Fashion, Jewelry, Beauty..."
                />

              </div>

            </div>

          </section>

          {/* ============================================
              Business Location
          ============================================ */}

          <section className="border-t border-gray-200 pt-10">

            <h2 className="text-2xl font-bold">
              Business Location
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Tell us where your business operates.
            </p>

            <div className="mt-6 grid gap-6 md:grid-cols-2">

              {/* Country */}

              <div>

                <label
                  htmlFor="country"
                  className="mb-2 block text-sm font-medium"
                >
                  Country *
                </label>

                <input
                  id="country"
                  name="country"
                  type="text"
                  required
                  autoComplete="country-name"
                  defaultValue="Nigeria"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
                />

              </div>

              {/* City */}

              <div>

                <label
                  htmlFor="city"
                  className="mb-2 block text-sm font-medium"
                >
                  City *
                </label>

                <input
                  id="city"
                  name="city"
                  type="text"
                  required
                  autoComplete="address-level2"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
                />

              </div>

            </div>

          </section>

          {/* ============================================
              Partner Type
          ============================================ */}

          <section className="border-t border-gray-200 pt-10">

            <h2 className="text-2xl font-bold">
              Partner Type
            </h2>

            <div className="mt-6 rounded-xl border border-black bg-gray-50 p-5">

              <p className="font-semibold">
                Personal Brand
              </p>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                Your products will be classified as Personal Brand
                products and, once approved and onboarded, will use the
                UdoLuxury payment pathway.
              </p>

            </div>

            <input
              type="hidden"
              name="brandType"
              value="PERSONAL"
            />

          </section>

          {/* ============================================
              Verification Notice
          ============================================ */}

          <section className="border-t border-gray-200 pt-10">

            <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">

              <h2 className="font-semibold">
                Personal Email Accepted
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                You do not need a company-domain email address to
                apply as a Personal Brand. A valid personal email
                address can be used for your application and
                communication with UdoLuxury.
              </p>

              <p className="mt-3 text-sm leading-6 text-gray-600">
                UdoLuxury may request additional information or
                verification during the Admin review process before
                approving your brand.
              </p>

            </div>

          </section>

          {/* ============================================
              Terms
          ============================================ */}

          <section className="border-t border-gray-200 pt-10">

            <label className="flex items-start gap-3">

              <input
                type="checkbox"
                name="agree"
                required
                className="mt-1 h-4 w-4"
              />

              <span className="text-sm leading-6 text-gray-600">
                I confirm that the information provided is accurate
                and I agree that UdoLuxury may review my business and
                brand before approval.
              </span>

            </label>

          </section>

          {/* ============================================
              Submit
          ============================================ */}

          <div className="border-t border-gray-200 pt-8">

            <button
              type="submit"
              className="w-full rounded-xl bg-black px-6 py-4 text-lg font-semibold text-white transition hover:bg-gray-800"
            >
              Submit Personal Brand Application
            </button>

            <p className="mt-4 text-center text-sm text-gray-500">
              Your application will be reviewed by UdoLuxury before
              your brand and products are approved.
            </p>

          </div>

        </form>

      </div>
    </main>
  );
}