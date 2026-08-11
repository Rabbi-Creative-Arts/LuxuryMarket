"use client";

import { siteConfig } from "@/config/site";

interface AdminHeaderProps {
  user: {
    name: string;
    email: string;
    role: string;
  };
}

export default function AdminHeader({
  user,
}: AdminHeaderProps) {
  return (
    <header className="flex items-center justify-between border-b bg-white px-8 py-4">
      <div>
        <h1 className="text-3xl font-bold">
          {siteConfig.logoText} Admin
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Welcome back, {user.name}
        </p>
      </div>

      <div className="flex items-center gap-6">
        <button
          type="button"
          className="rounded-lg border border-gray-200 px-4 py-2 transition hover:bg-gray-100"
        >
          Notifications
        </button>

        <div className="text-right">
          <p className="font-semibold">
            {user.name}
          </p>

          <p className="text-sm text-gray-500">
            {user.role}
          </p>
        </div>
      </div>
    </header>
  );
}