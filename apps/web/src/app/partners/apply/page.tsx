import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Crown,
  UserRound,
} from "lucide-react";

export default function PartnerApplicationTypePage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">

        {/* ============================================
            Header
        ============================================ */}

        <div className="mb-12">

          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm text-gray-500 transition hover:text-black"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>

          <div className="mt-10 text-center">

            <p className="text-sm font-medium uppercase tracking-[0.2em] text-gray-500">
              UdoLuxury
            </p>

            <h1 className="mt-4 text-4xl font-bold tracking-tight text-gray-950 md:text-5xl">
              Partner with UdoLuxury
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-gray-600">
              Choose the type of Brand partnership you would like
              to apply for.
            </p>

          </div>

        </div>

        {/* ============================================
            Application Types
        ============================================ */}

        <div className="grid gap-8 md:grid-cols-2">

          {/* ==========================================
              Personal Brand
          ========================================== */}

          <Link
            href="/partners/apply/personal"
            className="group rounded-3xl border border-gray-200 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:border-black hover:shadow-lg md:p-10"
          >

            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 transition group-hover:bg-black">
              <UserRound className="h-8 w-8 text-gray-800 transition group-hover:text-white" />
            </div>

            <h2 className="mt-8 text-2xl font-bold text-gray-950">
              Personal Brand
            </h2>

            <p className="mt-4 leading-7 text-gray-600">
              Apply to bring your own personal, independent,
              emerging, or privately owned Brand to UdoLuxury.
            </p>

            <div className="mt-8">

              <div className="inline-flex items-center gap-2 rounded-xl bg-black px-6 py-3 text-sm font-semibold text-white">
                Apply as a Personal Brand
                <ArrowRight className="h-4 w-4" />
              </div>

            </div>

          </Link>

          {/* ==========================================
              Popular Brand
          ========================================== */}

          <Link
            href="/partners/apply/popular"
            className="group rounded-3xl border border-gray-200 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:border-black hover:shadow-lg md:p-10"
          >

            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 transition group-hover:bg-black">
              <Crown className="h-8 w-8 text-gray-800 transition group-hover:text-white" />
            </div>

            <h2 className="mt-8 text-2xl font-bold text-gray-950">
              Major / Popular Brand
            </h2>

            <p className="mt-4 leading-7 text-gray-600">
              Apply on behalf of an established, recognized,
              major, or popular Brand that wants to partner with
              UdoLuxury.
            </p>

            <div className="mt-8">

              <div className="inline-flex items-center gap-2 rounded-xl bg-black px-6 py-3 text-sm font-semibold text-white">
                Apply as a Popular Brand
                <ArrowRight className="h-4 w-4" />
              </div>

            </div>

          </Link>

        </div>

        {/* ============================================
            Information
        ============================================ */}

        <div className="mx-auto mt-12 max-w-3xl rounded-2xl border border-gray-200 bg-white p-6 text-center">

          <p className="text-sm leading-6 text-gray-600">
            You must be signed in to your UdoLuxury account before
            submitting a Brand application. Your registered account
            identifies you as the applicant.
          </p>

          <p className="mt-3 text-sm leading-6 text-gray-600">
            For Major / Popular Brands, an official company email
            will also be required during the application process.
          </p>

        </div>

      </div>
    </main>
  );
}