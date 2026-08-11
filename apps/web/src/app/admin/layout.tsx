import { redirect } from "next/navigation";
import type { Metadata } from "next";

import { auth } from "@/auth";
import DashboardLayout from "@/components/DashboardLayout";

export const metadata: Metadata = {
  title: "Admin Dashboard | LuxuryMarket",
  description: "LuxuryMarket Administration",
};

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default async function AdminLayout({
  children,
}: Readonly<AdminLayoutProps>) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const role = (session.user as any)?.role;

  if (role !== "ADMIN") {
    redirect("/");
  }

  return (
    <DashboardLayout
      user={{
        name: session.user?.name ?? "Administrator",
        email: session.user?.email ?? "",
        role: role ?? "ADMIN",
      }}
    >
      {children}
    </DashboardLayout>
  );
}