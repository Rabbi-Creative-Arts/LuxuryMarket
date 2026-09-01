import Link from "next/link";

export const metadata = {
  title: "Settings | LuxuryMarket Admin",
  description: "Manage LuxuryMarket administration settings.",
};

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div>
        <h1 className="text-4xl font-bold">
          Settings
        </h1>

        <p className="mt-2 text-gray-500">
          Manage marketplace and administration settings.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Link
          href="/admin/settings/marketplace"
          className="group rounded-2xl border border-gray-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
        >
          <h2 className="text-2xl font-bold text-gray-900">
            Marketplace
          </h2>

          <p className="mt-3 leading-7 text-gray-500">
            Control marketplace commission rates and
            marketplace transaction settings.
          </p>

          <span className="mt-6 inline-block font-semibold text-gray-900 group-hover:underline">
            Manage Marketplace →
          </span>
        </Link>
      </div>
    </div>
  );
}