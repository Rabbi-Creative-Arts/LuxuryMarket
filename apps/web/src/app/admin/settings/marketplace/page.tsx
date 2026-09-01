import { prisma } from "@/lib/prisma";
import MarketplaceCommissionForm from "@/features/admin/components/MarketplaceCommissionForm";

export const metadata = {
  title: "Marketplace Settings | LuxuryMarket Admin",
  description: "Manage marketplace commission settings.",
};

export default async function MarketplaceSettingsPage() {
  const settings = await prisma.marketplaceSettings.findFirst({
    where: {
      active: true,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  const commissionRate = settings
    ? Number(settings.commissionRate)
    : 0;

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <h1 className="text-4xl font-bold">
          Marketplace Settings
        </h1>

        <p className="mt-2 text-gray-500">
          Control the marketplace commission charged on
          orders.
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <div className="mb-8">
          <h2 className="text-2xl font-bold">
            Marketplace Commission
          </h2>

          <p className="mt-2 text-gray-500">
            Set the commission LuxuryMarket charges on
            marketplace transactions.
          </p>
        </div>

        <MarketplaceCommissionForm
          initialRate={commissionRate}
          settingsId={settings?.id ?? null}
        />
      </div>

      <div className="rounded-2xl border border-blue-200 bg-blue-50 p-6">
        <h3 className="font-bold text-blue-900">
          How commission rates work
        </h3>

        <p className="mt-2 leading-7 text-blue-800">
          The rate you set here applies to new orders.
          Existing orders keep the commission rate that was
          recorded when they were created.
        </p>

        <div className="mt-5 rounded-xl bg-white p-5">
          <p className="text-sm font-medium text-gray-500">
            Example
          </p>

          <p className="mt-2 text-lg font-semibold text-gray-900">
            Customer pays ₦100,000
          </p>

          <p className="mt-1 text-gray-600">
            If the marketplace commission is 2%, LuxuryMarket
            records ₦2,000 as the marketplace commission.
          </p>
        </div>
      </div>
    </div>
  );
}