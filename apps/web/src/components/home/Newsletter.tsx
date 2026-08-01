"use client";

export default function Newsletter() {
  return (
    <section className="rounded-3xl border bg-white p-10">
      <h2 className="text-3xl font-bold">
        Subscribe
      </h2>

      <p className="mt-3 text-gray-500">
        Receive updates about products and promotions.
      </p>

      <form className="mt-8 flex gap-4">
        <input
          type="email"
          placeholder="Email address"
          className="h-12 flex-1 rounded-lg border px-4"
        />

        <button
          className="rounded-lg bg-black px-8 text-white"
          type="submit"
        >
          Subscribe
        </button>
      </form>
    </section>
  );
}
