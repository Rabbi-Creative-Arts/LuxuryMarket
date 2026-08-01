import LoginForm from "@/features/auth/components/LoginForm";

export const metadata = {
  title: "Login | LuxuryMarket",
  description: "Sign in to your LuxuryMarket account.",
};

export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-lg items-center justify-center px-6 py-12">
      <div className="w-full rounded-xl border border-gray-200 bg-white p-8 shadow-lg">
        <h1 className="mb-2 text-3xl font-bold">
          Welcome Back
        </h1>

        <p className="mb-8 text-gray-600">
          Sign in to continue to LuxuryMarket.
        </p>

        <LoginForm />
      </div>
    </main>
  );
}
