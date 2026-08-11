import { redirect } from "next/navigation";

import { auth } from "@/auth";

import {
  partnerApplicationService,
} from "@/features/partners/services/partner-application.service";

import PartnerApplicationTable from "@/features/partners/components/PartnerApplicationTable";

export default async function PartnerApplicationsPage() {
  // ============================================
  // Authentication
  // ============================================

  const session = await auth();

  const user = session?.user as
    | {
        id?: string;
        role?: string;
      }
    | undefined;

  if (!user?.id) {
    redirect("/login");
  }

  // ============================================
  // Admin Authorization
  // ============================================

  if (user.role !== "ADMIN") {
    redirect("/");
  }

  // ============================================
  // Applications
  // ============================================

  const applications =
    await partnerApplicationService.getAll();

  // ============================================
  // Page
  // ============================================

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-6 py-12">
        {/* ========================================
            Header
            ======================================== */}

        <div className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
            UdoLuxury Admin
          </p>

          <h1 className="mt-2 text-4xl font-bold">
            Partner Applications
          </h1>

          <p className="mt-3 max-w-2xl text-gray-600">
            Review, approve and manage Personal
            Brands and Popular Brands applying to
            sell or partner with UdoLuxury.
          </p>
        </div>

        {/* ========================================
            Application System
            ======================================== */}

        <PartnerApplicationTable
          applications={applications}
        />
      </div>
    </main>
  );
}