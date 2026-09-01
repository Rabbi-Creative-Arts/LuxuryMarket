import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

function formatCurrency(value: unknown) {
  const amount = Number(value ?? 0);

  return new Intl.NumberFormat(
    "en-NG",
    {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 2,
    }
  ).format(amount);
}

export default async function BrandDashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const user = session.user as {
    id?: string;
    name?: string | null;
    email?: string | null;
    role?: string;
  };

  if (!user.id) {
    redirect("/login");
  }

  // ==========================================
  // Only Brand Owners / Brand Staff
  // ==========================================

  if (
    user.role !== "BRAND_OWNER" &&
    user.role !== "BRAND_STAFF"
  ) {
    redirect("/dashboard");
  }

  // ==========================================
  // Find the user's Brand
  // ==========================================

  const brand =
    await prisma.brand.findFirst({
      where: {
        ownerId: user.id,

        status: "APPROVED",
      },

      include: {
        dashboard: true,

        _count: {
          select: {
            products: true,
          },
        },
      },
    });

  if (!brand) {
    redirect("/dashboard");
  }

  const dashboard =
    brand.dashboard;

  const totalProducts =
    brand._count.products;

  const totalOrders =
    dashboard?.totalOrders ?? 0;

  const totalRevenue =
    dashboard?.totalRevenue ?? 0;

  const totalCustomers =
    dashboard?.totalCustomers ?? 0;

  return (
    <main className="min-h-screen bg-gray-50">
      {/* =====================================
          Header
      ===================================== */}

      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
              UdoLuxury
            </p>

            <h1 className="mt-2 text-3xl font-bold text-gray-900">
              {brand.name}
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Brand Dashboard
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="rounded-full border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
            >
              Account
            </Link>

            <Link
              href="/"
              className="rounded-full bg-black px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800"
            >
              View Store
            </Link>
          </div>
        </div>
      </header>

      {/* =====================================
          Dashboard
      ===================================== */}

      <div className="mx-auto max-w-7xl px-6 py-10">
        {/* Welcome */}

        <section className="rounded-3xl bg-black p-8 text-white">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-gray-400">
            Welcome back
          </p>

          <h2 className="mt-3 text-3xl font-bold">
            {brand.name}
          </h2>

          <p className="mt-3 max-w-2xl leading-7 text-gray-300">
            Your UdoLuxury brand account is approved.
            You can now prepare products, manage your
            brand information, monitor orders and track
            your marketplace activity.
          </p>
        </section>

        {/* =====================================
            Financial / Business Summary
        ===================================== */}

        <section className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <p className="text-sm text-gray-500">
              Products
            </p>

            <p className="mt-3 text-3xl font-bold">
              {totalProducts}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <p className="text-sm text-gray-500">
              Orders
            </p>

            <p className="mt-3 text-3xl font-bold">
              {totalOrders}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <p className="text-sm text-gray-500">
              Revenue
            </p>

            <p className="mt-3 text-2xl font-bold">
              {formatCurrency(totalRevenue)}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <p className="text-sm text-gray-500">
              Customers
            </p>

            <p className="mt-3 text-3xl font-bold">
              {totalCustomers}
            </p>
          </div>
        </section>

        {/* =====================================
            Main Actions
        ===================================== */}

        <section className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Products */}

          <div className="rounded-3xl border border-gray-200 bg-white p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
              Catalog
            </p>

            <h3 className="mt-3 text-xl font-bold">
              Products
            </h3>

            <p className="mt-3 leading-6 text-gray-600">
              Add and manage products for your
              approved UdoLuxury brand.
            </p>

            <Link
              href="/dashboard/products"
              className="mt-6 inline-flex rounded-full bg-black px-6 py-3 text-sm font-semibold text-white hover:bg-gray-800"
            >
              Manage Products
            </Link>
          </div>

          {/* Orders */}

          <div className="rounded-3xl border border-gray-200 bg-white p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
              Sales
            </p>

            <h3 className="mt-3 text-xl font-bold">
              Orders
            </h3>

            <p className="mt-3 leading-6 text-gray-600">
              Monitor customer orders and fulfillment
              activity.
            </p>

            <Link
              href="/dashboard/orders"
              className="mt-6 inline-flex rounded-full border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-100"
            >
              View Orders
            </Link>
          </div>

          {/* Payouts */}

          <div className="rounded-3xl border border-gray-200 bg-white p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
              Money
            </p>

            <h3 className="mt-3 text-xl font-bold">
              Payouts
            </h3>

            <p className="mt-3 leading-6 text-gray-600">
              View pending earnings, available balance,
              payout status and future payout requests.
            </p>

            <Link
              href="/dashboard/payouts"
              className="mt-6 inline-flex rounded-full border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-100"
            >
              View Payouts
            </Link>
          </div>
        </section>

        {/* =====================================
            Payout Risk
        ===================================== */}

        <section className="mt-8 rounded-3xl border border-gray-200 bg-white p-8">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gray-100 text-lg">
              ✓
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900">
                Payout Protection
              </h3>

              <p className="mt-2 max-w-3xl leading-7 text-gray-600">
                UdoLuxury protects marketplace transactions
                before seller funds become available for payout.
                Orders may remain pending during the applicable
                protection period, particularly for new or
                higher-value transactions.
              </p>

              <p className="mt-4 text-sm font-medium text-gray-500">
                Your detailed payout status will appear here
                as sales are completed.
              </p>
            </div>
          </div>
        </section>

        {/* =====================================
            Brand Information
        ===================================== */}

        <section className="mt-8 rounded-3xl border border-gray-200 bg-white p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
                Brand Profile
              </p>

              <h3 className="mt-2 text-xl font-bold">
                {brand.name}
              </h3>

              <p className="mt-2 text-gray-600">
                {brand.country || "Country not specified"}
              </p>
            </div>

            <Link
              href={`/admin/brands/${brand.id}/edit`}
              className="inline-flex rounded-full border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-100"
            >
              Manage Brand Profile
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}