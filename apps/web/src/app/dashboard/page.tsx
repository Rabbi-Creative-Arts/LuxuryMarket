import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <main className="mx-auto max-w-4xl p-8">
      <h1 className="text-3xl font-bold">
        Dashboard
      </h1>

      <p className="mt-4">
        Welcome back!
      </p>

      <div className="mt-8 rounded-lg border p-6">
        <p>
          <strong>Name:</strong>{" "}
          {session.user?.name}
        </p>

        <p>
          <strong>Email:</strong>{" "}
          {session.user?.email}
        </p>

        <p>
          <strong>Role:</strong>{" "}
          {(session.user as any)?.role}
        </p>
      </div>
    </main>
  );
}
