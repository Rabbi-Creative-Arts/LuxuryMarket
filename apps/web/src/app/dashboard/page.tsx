import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function statusTitle(status: string) {
  switch (status) {
    case "UNDER_REVIEW":
      return "UNDER REVIEW";

    case "APPROVED":
      return "APPLICATION APPROVED";

    case "REJECTED":
      return "APPLICATION NOT APPROVED";

    case "SUSPENDED":
      return "APPLICATION SUSPENDED";

    default:
      return "PENDING REVIEW";
  }
}

function statusDescription(status: string) {
  switch (status) {
    case "UNDER_REVIEW":
      return "Our Administration team is currently reviewing your Brand application.";

    case "APPROVED":
      return "Congratulations! Your Brand application has been approved.";

    case "REJECTED":
      return "Your application was not approved at this time. Please review any Administration Notes below.";

    case "SUSPENDED":
      return "Your application is currently suspended pending further administrative action.";

    default:
      return "Your application has been received and is awaiting review by UdoLuxury Administration.";
  }
}

function isReviewed(status: string) {
  return [
    "UNDER_REVIEW",
    "APPROVED",
    "REJECTED",
    "SUSPENDED",
  ].includes(status);
}

function applicationTypeLabel(partnerType: string) {
  return partnerType === "PERSONAL"
    ? "Personal Brand"
    : "Major / Popular Brand";
}

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const user = session.user as {
    id?: string;
    name?: string | null;
    email?: string | null;
    role?: string;
  };

  let application = null;

  if (user.id) {
    application =
      await prisma.partnerApplication.findUnique({
        where: {
          userId: user.id,
        },
      });
  }

  const firstName =
    application?.firstName ||
    user.name?.split(" ")[0] ||
    "there";

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="mx-auto max-w-5xl">

        {/* ============================================
            Header
        ============================================ */}

        <div className="mb-10">

          <p className="text-sm font-medium uppercase tracking-[0.2em] text-gray-500">
            UdoLuxury
          </p>

          <h1 className="mt-3 text-3xl font-semibold text-gray-900">
            Welcome, {firstName}
          </h1>

          {user.email && (
            <p className="mt-2 text-gray-600">
              {user.email}
            </p>
          )}

        </div>

        {/* ============================================
            Brand Application
        ============================================ */}

        {application && (
          <section className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">

            {/* Application Header */}

            <div className="mb-8">

              <p className="text-sm font-medium uppercase tracking-[0.18em] text-gray-500">
                Brand Application
              </p>

              <h2 className="mt-2 text-2xl font-semibold text-gray-900">
                {application.brandName}
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                {applicationTypeLabel(
                  application.partnerType
                )}
              </p>

            </div>

            {/* ============================================
                Status
            ============================================ */}

            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-8 text-center">

              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-black text-xl text-white">
                {application.status === "APPROVED"
                  ? "✓"
                  : application.status === "REJECTED"
                    ? "!"
                    : "•"}
              </div>

              <h3 className="text-xl font-semibold text-gray-900">
                {statusTitle(application.status)}
              </h3>

              <p className="mt-3 text-gray-600">
                Submitted:{" "}
                <strong>
                  {formatDate(application.submittedAt)}
                </strong>
              </p>

              {application.status === "PENDING" && (
                <p className="mt-1 text-gray-600">
                  Expected review:{" "}
                  <strong>24–48 hours</strong>
                </p>
              )}

            </div>

            {/* ============================================
                Progress
            ============================================ */}

            <div className="mt-10">

              <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-gray-500">
                Application Progress
              </h3>

              <div className="mt-6 space-y-5">

                {/* Received */}

                <div className="flex items-center gap-4">

                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-sm text-white">
                    ✓
                  </span>

                  <span className="font-medium text-gray-900">
                    Application received
                  </span>

                </div>

                {/* Review */}

                <div className="flex items-center gap-4">

                  <span className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-400 text-sm">

                    {isReviewed(application.status)
                      ? "✓"
                      : "•"}

                  </span>

                  <span
                    className={
                      isReviewed(application.status)
                        ? "font-medium text-gray-900"
                        : "text-gray-500"
                    }
                  >
                    Administration review
                  </span>

                </div>

                {/* Approval */}

                <div className="flex items-center gap-4">

                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-full border text-sm ${
                      application.status === "APPROVED"
                        ? "border-black bg-black text-white"
                        : "border-gray-300 text-gray-400"
                    }`}
                  >
                    {application.status === "APPROVED"
                      ? "✓"
                      : "○"}
                  </span>

                  <span
                    className={
                      application.status === "APPROVED"
                        ? "font-medium text-gray-900"
                        : "text-gray-400"
                    }
                  >
                    Brand approval
                  </span>

                </div>

                {/* Product submission */}

                <div className="flex items-center gap-4">

                  <span className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 text-sm text-gray-400">
                    ○
                  </span>

                  <span className="text-gray-400">
                    Product submission
                  </span>

                </div>

                {/* Product approval */}

                <div className="flex items-center gap-4">

                  <span className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 text-sm text-gray-400">
                    ○
                  </span>

                  <span className="text-gray-400">
                    Product approval
                  </span>

                </div>

              </div>

            </div>

            {/* ============================================
                What Happens Next
            ============================================ */}

            <div className="mt-10 rounded-2xl bg-gray-50 p-6">

              <h3 className="font-semibold text-gray-900">
                What happens next?
              </h3>

              <p className="mt-2 leading-7 text-gray-600">
                {statusDescription(application.status)}
              </p>

              {application.status === "PENDING" && (
                <p className="mt-3 leading-7 text-gray-600">
                  Please return to your UdoLuxury dashboard
                  within <strong>24–48 hours</strong> to
                  check your application status.
                </p>
              )}

              {application.status === "UNDER_REVIEW" && (
                <p className="mt-3 leading-7 text-gray-600">
                  Your application has moved into Administration
                  review. Please continue checking your dashboard
                  for the final decision.
                </p>
              )}

              {application.reviewerNotes && (
                <div className="mt-5 rounded-xl border border-gray-200 bg-white p-5">

                  <p className="text-sm font-semibold text-gray-900">
                    Administration Notes
                  </p>

                  <p className="mt-2 leading-7 text-gray-600">
                    {application.reviewerNotes}
                  </p>

                </div>
              )}

            </div>

            {/* ============================================
                Approved
            ============================================ */}

            {application.status === "APPROVED" && (
              <div className="mt-8 text-center">

                <Link
                  href="/dashboard/brand"
                  className="inline-flex rounded-full bg-black px-7 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
                >
                  Enter Brand Dashboard
                </Link>

              </div>
            )}

            {/* ============================================
                Rejected
            ============================================ */}

            {application.status === "REJECTED" && (
              <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 text-center">

                <p className="text-sm leading-6 text-gray-600">
                  If you believe additional information should be
                  considered, please contact UdoLuxury Administration.
                </p>

              </div>
            )}

          </section>
        )}

        {/* ============================================
            Normal Buyer / No Application
        ============================================ */}

        {!application && (
          <section className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">

            <h2 className="text-2xl font-semibold text-gray-900">
              Welcome to your UdoLuxury Dashboard
            </h2>

            <p className="mt-3 text-gray-600">
              Your account is ready. You currently have no
              Brand application.
            </p>

            <div className="mt-6">

              <Link
                href="/partners/apply"
                className="inline-flex rounded-full bg-black px-7 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
              >
                Apply as a Brand
              </Link>

            </div>

          </section>
        )}

      </div>
    </main>
  );
}