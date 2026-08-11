"use client";

import { useState } from "react";

import {
  removeCartItem,
  updateCartItem,
} from "../actions/cart.actions";

interface Props {
  itemId: string;
  quantity: number;
}

export default function CartItemControls({
  itemId,
  quantity,
}: Props) {
  const [loading, setLoading] =
    useState(false);

  async function changeQuantity(
    nextQuantity: number
  ) {
    if (nextQuantity < 1) {
      return;
    }

    setLoading(true);

    try {
      await updateCartItem(
        itemId,
        nextQuantity
      );

      window.location.reload();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function remove() {
    setLoading(true);

    try {
      await removeCartItem(
        itemId
      );

      window.location.reload();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3">

      <div className="flex items-center overflow-hidden rounded-lg border">

        <button
          type="button"
          disabled={
            loading ||
            quantity <= 1
          }
          onClick={() =>
            changeQuantity(
              quantity - 1
            )
          }
          className="px-3 py-2 hover:bg-gray-50 disabled:opacity-40"
        >
          −
        </button>

        <span className="min-w-10 px-3 text-center text-sm font-medium">
          {quantity}
        </span>

        <button
          type="button"
          disabled={loading}
          onClick={() =>
            changeQuantity(
              quantity + 1
            )
          }
          className="px-3 py-2 hover:bg-gray-50 disabled:opacity-40"
        >
          +
        </button>

      </div>

      <button
        type="button"
        disabled={loading}
        onClick={remove}
        className="text-sm text-red-600 hover:underline disabled:opacity-50"
      >
        Remove
      </button>

    </div>
  );
}