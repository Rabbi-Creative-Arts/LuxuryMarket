import Link from "next/link";

import { auth } from "@/auth";
import { createPartnerApplication } from "@/features/partners/actions/create-partner-application";

export default async function PopularBrandApplicationPage() {
  const session = await auth();

  const accountEmail =
    session?.user?.email ?? "";

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
            Major / Popular Brand Application
          </h1>

          <p className="mt-4 max-w-2xl text-gray-600">
            Tell us about your established brand or business and the
            products you want customers to discover through UdoLuxury.
            Your application will be reviewed before your brand and
            products are approved.
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
              UdoLuxury Account
          ============================================ */}

          <section>

            <h2 className="text-2xl font-bold">
              UdoLuxury Account
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Your application is connected to your UdoLuxury account.
            </p>

            <div className="mt-6 rounded-xl border border-gray-200 bg-gray-50 p-5">

              <div className="flex items-start gap-3">

                <div className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-black text-xs font-bold text-white">
                  ✓
                </div>

                <div>

                  <p className="font-semibold">
                    Account Email
                  </p>

                  <p className="mt-1 text-sm text-gray-700">
                    {accountEmail}
                  </p>

                  <p className="mt-2 text-sm leading-6 text-gray-500">
                    This is the email address you used to create your
                    UdoLuxury account. It identifies you as the applicant
                    and will automatically be attached to this application.
                  </p>

                </div>

              </div>

            </div>

          </section>

          {/* ============================================
              Business Information
          ============================================ */}

          <section className="border-t border-gray-200 pt-10">

            <h2 className="text-2xl font-bold">
              Business Information
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Provide information about your company or business.
            </p>

            <div className="mt-6 grid gap-6 md:grid-cols-2">

              {/* Business Name */}

              <div>

                <label
                  htmlFor="businessName"
                  className="mb-2 block text-sm font-medium"
                >
                  Business / Company Name *
                </label>

                <input
                  id="businessName"
                  name="businessName"
                  type="text"
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
                  placeholder="Company name"
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
                  placeholder="Brand name"
                />

              </div>

              {/* Official Company Email */}

              <div className="md:col-span-2">

                <label
                  htmlFor="companyEmail"
                  className="mb-2 block text-sm font-medium"
                >
                  Official Company Email *
                </label>

                <input
                  id="companyEmail"
                  name="companyEmail"
                  type="email"
                  required
                  autoComplete="organization"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
                  placeholder="name@company.com"
                />

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  This must be an official email address associated with
                  the company or brand you are representing. Your
                  UdoLuxury account email is recorded separately.
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
              Authorized Contact
          ============================================ */}

          <section className="border-t border-gray-200 pt-10">

            <h2 className="text-2xl font-bold">
              Authorized Contact
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Provide the person responsible for this partnership.
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

              {/* Position */}

              <div className="md:col-span-2">

                <label
                  htmlFor="position"
                  className="mb-2 block text-sm font-medium"
                >
                  Position / Role
                </label>

                <input
                  id="position"
                  name="position"
                  type="text"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
                  placeholder="e.g. Founder, Director, Brand Manager"
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

            <div className="mt-6 space-y-6">

              {/* Official Website */}

              <div>

                <label
                  htmlFor="website"
                  className="mb-2 block text-sm font-medium"
                >
                  Official Brand Website *
                </label>

                <input
                  id="website"
                  name="website"
                  type="url"
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
                  placeholder="https://www.example.com"
                />

              </div>

              {/* Description */}

              <div>

                <label
                  htmlFor="description"
                  className="mb-2 block text-sm font-medium"
                >
                  About Your Brand *
                </label>

                <textarea
                  id="description"
                  name="description"
                  rows={6}
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
                  placeholder="Tell us about your brand, products, history and market presence."
                />

              </div>

              {/* Product Categories */}

              <div>

                <label
                  htmlFor="productType"
                  className="mb-2 block text-sm font-medium"
                >
                  Product Categories *
                </label>

                <input
                  id="productType"
                  name="productType"
                  type="text"
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
                  placeholder="e.g. Watches, Fashion, Jewelry, Beauty"
                />

              </div>

            </div>

          </section>

          {/* ============================================
              Official Purchase Information
          ============================================ */}

          <section className="border-t border-gray-200 pt-10">

            <h2 className="text-2xl font-bold">
              Official Purchase Information
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Major / Popular Brand products are purchased through the
              official brand website. UdoLuxury will use the approved
              product destination and affiliate information when
              applicable.
            </p>

            <div className="mt-6 space-y-6">

              {/* Purchase URL */}

              <div>

                <label
                  htmlFor="purchaseUrl"
                  className="mb-2 block text-sm font-medium"
                >
                  Official Purchase URL *
                </label>

                <input
                  id="purchaseUrl"
                  name="purchaseUrl"
                  type="url"
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
                  placeholder="https://www.example.com/shop"
                />

              </div>

              {/* Affiliate Network */}

              <div>

                <label
                  htmlFor="affiliateNetwork"
                  className="mb-2 block text-sm font-medium"
                >
                  Affiliate Network
                </label>

                <input
                  id="affiliateNetwork"
                  name="affiliateNetwork"
                  type="text"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
                  placeholder="Affiliate network name, if applicable"
                />

              </div>

              {/* Commission Information */}

              <div>

                <label
                  htmlFor="commissionInformation"
                  className="mb-2 block text-sm font-medium"
                >
                  Commission Information
                </label>

                <textarea
                  id="commissionInformation"
                  name="commissionInformation"
                  rows={4}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
                  placeholder="Describe your affiliate or commission arrangement, if already established."
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
                  defaultValue="Nigeria"
                  autoComplete="country-name"
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
                Major / Popular Brand
              </p>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                Your products will be classified as Major / Popular
                Brand products. Once approved, customers will be
                directed to the official brand website to complete
                purchases, with affiliate tracking used where
                applicable.
              </p>

            </div>

            <input
              type="hidden"
              name="brandType"
              value="POPULAR"
            />

          </section>

          {/* ============================================
              Email Separation Notice
          ============================================ */}

          <section className="border-t border-gray-200 pt-10">

            <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">

              <h2 className="font-semibold">
                Two Emails, Two Purposes
              </h2>

              <div className="mt-4 space-y-3 text-sm leading-6 text-gray-600">

                <p>
                  <strong>UdoLuxury Account Email:</strong>{" "}
                  {accountEmail}
                </p>

                <p>
                  This identifies your UdoLuxury account and is
                  automatically attached to your application.
                </p>

                <p>
                  <strong>Official Company Email:</strong>{" "}
                  The company email you entered above identifies the
                  established Brand you are representing.
                </p>

              </div>

            </div>

          </section>

          {/* ============================================
              Agreement
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
                I confirm that I am authorized to submit this
                application on behalf of the Brand and that the
                information provided is accurate. I understand that
                UdoLuxury will review and verify the Brand before
                approval.
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
              Submit Major / Popular Brand Application
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