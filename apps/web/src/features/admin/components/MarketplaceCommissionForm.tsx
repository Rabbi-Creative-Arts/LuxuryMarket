"use client";

import { useState } from "react";

import Button from "@/components/ui/Button";

import {
  updateMarketplaceCommission,
} from "../actions/marketplaceSettings";

interface MarketplaceCommissionFormProps {
  initialRate: number;
  settingsId: string | null;
}

export default function MarketplaceCommissionForm({
  initialRate,
}: MarketplaceCommissionFormProps) {
  const [rate, setRate] = useState(
    initialRate.toString()
  );

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    const formData = new FormData(event.currentTarget);

    const result =
      await updateMarketplaceCommission(formData);

    setLoading(false);

    if (!result.success) {
      setError(result.message);
      return;
    }

    setMessage(result.message);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <div>
        <label
          htmlFor="commissionRate"
          className="mb-2 block text-sm font-semibold text-gray-900"
        >
          Marketplace Commission
        </label>

        <div className="relative max-w-sm">
          <input
            id="commissionRate"
            name="commissionRate"
            type="number"
            min="0"
            max="100"
            step="0.01"
            value={rate}
            onChange={(event) =>
              setRate(event.target.value)
            }
            className="w-full rounded-xl border border-gray-300 bg-white px-5 py-4 pr-12 text-2xl font-bold outline-none transition focus:border-black focus:ring-2 focus:ring-black/10"
            required
          />

          <span className="absolute right-5 top-1/2 -translate-y-1/2 text-xl font-bold text-gray-500">
            %
          </span>
        </div>

        <p className="mt-2 text-sm text-gray-500">
          Admin can change this rate at any time. It is not
          permanently fixed at 10%.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      {message && (
        <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm font-medium text-green-700">
          {message}
        </div>
      )}

      <Button
        type="submit"
        disabled={loading}
        className="px-8"
      >
        {loading
          ? "Saving..."
          : "Save Commission Rate"}
      </Button>
    </form>
  );
}