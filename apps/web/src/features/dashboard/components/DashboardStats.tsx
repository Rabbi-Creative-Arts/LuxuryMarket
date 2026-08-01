import type { DashboardStats as DashboardStatsType } from "../types/dashboard";

import StatsCard from "./StatsCard";

interface DashboardStatsProps {
  stats: DashboardStatsType;
}

export default function DashboardStats({
  stats,
}: DashboardStatsProps) {
  return (
    <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-5">
      <StatsCard
        title="Users"
        value={stats.users}
      />

      <StatsCard
        title="Brands"
        value={stats.brands}
      />

      <StatsCard
        title="Products"
        value={stats.products}
      />

      <StatsCard
        title="Categories"
        value={stats.categories}
      />

      <StatsCard
        title="Applications"
        value={stats.pendingApplications}
      />
    </section>
  );
}
