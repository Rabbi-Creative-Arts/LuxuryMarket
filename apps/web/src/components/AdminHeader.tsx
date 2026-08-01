"use client";

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
    <header className="flex h-20 items-center justify-between border-b border-gray-200 bg-white px-8">
      <div>
        <h1 className="text-2xl font-bold">
          Admin Dashboard
        </h1>

        <p className="text-sm text-gray-500">
          Welcome back, {user.name}
        </p>
      </div>

      <div className="flex items-center gap-6">
        <button
          className="rounded-lg border border-gray-200 px-4 py-2 transition hover:bg-gray-100"
          type="button"
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
