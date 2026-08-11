"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { addToCart } from "../actions/cart.actions";

interface Props {
  productId: string;
}

export default function AddToCartButton({
  productId,
}: Props) {
  const router = useRouter();

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  async function handleAdd() {
    if (loading) {
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const result = await addToCart(
        productId,
        1
      );

      if (result.success) {
        setMessage(
          "Added to cart ✓"
        );

        // Refresh the Server Components.
        // This causes Header.tsx to fetch
        // the new cart quantity immediately.
        router.refresh();
      }
    } catch (error) {
      console.error(
        "Add to cart error:",
        error
      );

      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to add product to cart."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3">

      <button
        type="button"
        onClick={handleAdd}
        disabled={loading}
        className="w-full rounded-xl bg-black px-8 py-4 text-center text-lg font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading
          ? "Adding..."
          : "Add to Cart"}
      </button>

      {message && (
        <p
          className={`text-center text-sm ${
            message.includes("Unable") ||
            message.includes("not available") ||
            message.includes("logged in")
              ? "text-red-600"
              : "text-green-600"
          }`}
        >
          {message}
        </p>
      )}

    </div>
  );
}