import Link from "next/link";

export default function PartnerApplyPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-5xl px-6 py-16">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-gray-500">
            Partner With UdoLuxury
          </p>

          <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">
            Are you a brand, manufacturer or retailer of business?
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-gray-600">
            Join UdoLuxury and showcase your products to customers looking
            for authentic luxury goods from trusted businesses.
          </p>
        </div>

        {/* Partner Types */}
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {/* Personal Brand */}
          <Link
            href="/partners/apply/personal"
            className="group rounded-2xl border border-gray-200 bg-white p-8 transition hover:border-black hover:shadow-lg"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-black text-xl font-bold text-white">
              P
            </div>

            <h2 className="mt-6 text-2xl font-bold">
              Personal Brand
            </h2>

            <p className="mt-3 leading-7 text-gray-600">
              For individuals and businesses that manufacture or sell
              their own products under their own brand.
            </p>

            <div className="mt-6 font-semibold">
              Apply as a Personal Brand →
            </div>
          </Link>

          {/* Major / Popular Brand */}
          <Link
            href="/partners/apply/popular"
            className="group rounded-2xl border border-gray-200 bg-white p-8 transition hover:border-black hover:shadow-lg"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-black text-xl font-bold text-white">
              M
            </div>

            <h2 className="mt-6 text-2xl font-bold">
              Major / Popular Brand
            </h2>

            <p className="mt-3 leading-7 text-gray-600">
              For established brands, manufacturers and retailers that
              want their products discovered through UdoLuxury.
            </p>

            <div className="mt-6 font-semibold">
              Apply as a Major / Popular Brand →
            </div>
          </Link>
        </div>

        {/* How It Works */}
        <section className="mt-16 rounded-2xl border border-gray-200 bg-gray-50 p-8">
          <h2 className="text-2xl font-bold">
            How Partnering With UdoLuxury Works
          </h2>

          <div className="mt-8 grid gap-8 md:grid-cols-4">
            <div>
              <div className="text-2xl font-bold">01</div>
              <h3 className="mt-2 font-semibold">
                Apply
              </h3>
              <p className="mt-2 text-sm leading-6 text-gray-600">
                Submit your business and brand information.
              </p>
            </div>

            <div>
              <div className="text-2xl font-bold">02</div>
              <h3 className="mt-2 font-semibold">
                Verification
              </h3>
              <p className="mt-2 text-sm leading-6 text-gray-600">
                UdoLuxury reviews your application and business.
              </p>
            </div>

            <div>
              <div className="text-2xl font-bold">03</div>
              <h3 className="mt-2 font-semibold">
                Approval
              </h3>
              <p className="mt-2 text-sm leading-6 text-gray-600">
                Approved partners can onboard their products.
              </p>
            </div>

            <div>
              <div className="text-2xl font-bold">04</div>
              <h3 className="mt-2 font-semibold">
                Go Live
              </h3>
              <p className="mt-2 text-sm leading-6 text-gray-600">
                Your approved products become available through
                UdoLuxury.
              </p>
            </div>
          </div>
        </section>

        {/* Existing Partner */}
        <div className="mt-10 text-center">
          <p className="text-gray-600">
            Already a UdoLuxury partner?
          </p>

          <Link
            href="/login"
            className="mt-3 inline-block font-semibold underline"
          >
            Sign in to your partner account
          </Link>
        </div>

        {/* Back */}
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="text-sm text-gray-500 hover:text-black"
          >
            ← Back to UdoLuxury
          </Link>
        </div>
      </div>
    </main>
  );
}