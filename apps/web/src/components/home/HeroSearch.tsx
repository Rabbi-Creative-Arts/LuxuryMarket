"use client";

export default function HeroSearch() {
  return (
    <form className="flex gap-3">
      <input
        type="search"
        placeholder="Search products..."
        className="h-14 flex-1 rounded-xl border border-gray-300 px-5 text-black outline-none"
      />

      <button
        type="submit"
        className="rounded-xl bg-white px-8 font-semibold text-black transition hover:bg-gray-200"
      >
        Search
      </button>
    </form>
  );
}
