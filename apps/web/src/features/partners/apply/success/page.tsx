import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  Mail,
} from "lucide-react";

type ApplicationSuccessPageProps = {
  searchParams: Promise<{
    type?: string;
    id?: string;
  }>;
};

export default async function ApplicationSuccessPage({
  searchParams,
}: ApplicationSuccessPageProps) {
  const params = await searchParams;

  const type =
    params.type === "popular"
      ? "Popular Brand"
      : "Personal Brand";

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-5xl px-6 py-16 md:py-24">
        <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
          <div className="px-6 py-16 text-center md:px-16 md:py-20">

            {/* Success Icon */}
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-50">
              <CheckCircle2
                className="h-12 w-12 text-green-600"
                strokeWidth={1.8}
              />
            </div>

            {/* Heading */}
            <h1 className="mt-8 text-4xl font-bold tracking-tight text-gray-950 md:text-5xl">
              APPLICATION RECEIVED
            </h1>

            <div className="mx-auto mt-6 h-1 w-20 rounded-full bg-green-500" />

            {/* Thank You */}
            <p className="mx-auto mt-8 max-w-2xl text-xl font-medium text-gray-700">
              Thank you for applying to UdoLuxury.
            </p>

            <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-gray-600">
              We have received your{" "}
              <span className="font-semibold text-gray-900">
                {type}
              </span>{" "}
              application successfully.
            </p>

            {/* Status */}
            <div className="mt-10">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-gray-500">
                Your application is now
              </p>

              <div className="mx-auto mt-4 flex w-fit items-center gap-3 rounded-xl bg-green-50 px-6 py-4">
                <Clock3
                  className="h-6 w-6 text-green-600"
                  strokeWidth={2}
                />

                <span className="text-lg font-bold text-green-700">
                  PENDING REVIEW
                </span>
              </div>
            </div>

            {/* Review Time */}
            <div className="mx-auto mt-10 max-w-2xl">
              <p className="text-lg leading-8 text-gray-700">
                Our administration team will review your application.
              </p>

              <p className="mt-2 text-lg leading-8 text-gray-700">
                Please allow{" "}
                <span className="font-bold text-green-600">
                  up to 48 hours
                </span>{" "}
                for the initial review.
              </p>
            </div>

            {/* Email Notice */}
            <div className="mx-auto mt-10 flex max-w-2xl items-center justify-center gap-5 border-t border-gray-200 pt-8">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gray-100">
                <Mail
                  className="h-6 w-6 text-gray-700"
                  strokeWidth={1.8}
                />
              </div>

              <p className="text-left text-base leading-7 text-gray-600">
                You will be contacted using the email address
                provided in your application.
              </p>
            </div>

            {/* Return Button */}
            <div className="mt-12">
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-3 rounded-xl bg-black px-8 py-4 text-base font-semibold text-white transition hover:bg-gray-800"
              >
                <ArrowLeft
                  className="h-5 w-5"
                  strokeWidth={2}
                />

                Return to UdoLuxury
              </Link>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}