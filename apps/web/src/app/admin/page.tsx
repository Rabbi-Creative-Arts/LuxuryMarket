import { getDashboard } from "@/features/dashboard/actions/get-dashboard";
import DashboardStats from "@/features/dashboard/components/DashboardStats";

export const metadata = {
  title: "Admin Dashboard | LuxuryMarket",
};

export default async function AdminPage() {
  const stats = await getDashboard();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold">
          LuxuryMarket Dashboard
        </h1>

        <p className="mt-2 text-gray-500">
          Platform overview powered by Prisma.
        </p>
      </div>

      <DashboardStats stats={stats} />
    </div>
  );
}
