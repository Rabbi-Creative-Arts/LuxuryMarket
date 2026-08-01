import RegisterForm from "@/features/auth/components/RegisterForm";

export const metadata = {
  title: "Register | LuxuryMarket",
  description: "Create your LuxuryMarket account.",
};

export default function RegisterPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-lg items-center justify-center px-6 py-12">
      <div className="w-full rounded-xl border border-gray-200 bg-white p-8 shadow-lg">
        <h1 className="mb-2 text-3xl font-bold">Create Account</h1>

        <p className="mb-8 text-gray-600">
          Join LuxuryMarket and start buying and selling.
        </p>

        <RegisterForm />
      </div>
    </main>
  );
}
