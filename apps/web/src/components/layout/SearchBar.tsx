"use client";

import { Search } from "lucide-react";

export default function SearchBar() {
  return (
    <div className="relative w-full">
      <Search
        size={18}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
      />

      <input
        type="search"
        placeholder="Search products, brands, vendors..."
        className="h-11 w-full rounded-xl border border-gray-300 bg-white pl-11 pr-4 text-sm outline-none transition focus:border-black"
      />
    </div>
  );
}
