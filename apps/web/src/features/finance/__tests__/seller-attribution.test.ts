import { describe, expect, it } from "vitest";

import {
  buildOrderItemSnapshot,
  buildOrderItemSnapshots,
  summarizeOrder,
  type CartLineForAttribution,
} from "../lib/seller-attribution";

const brand = (id: string, name: string, ownerId: string | null) => ({
  id,
  name,
  ownerId,
});

function line(
  productId: string,
  brandInfo: CartLineForAttribution["product"]["brand"],
  price: string,
  quantity: number
): CartLineForAttribution {
  return {
    productId,
    quantity,
    product: { id: productId, price, brand: brandInfo },
  };
}

describe("Phase 3 — seller attribution snapshot at order creation", () => {
  it("snapshots seller brand id, name and user id onto each item", () => {
    const snapshot = buildOrderItemSnapshot(
      line("prod_1", brand("brand_lux", "Lux House", "user_owner_1"), "100000.00", 1),
      "3"
    );

    expect(snapshot.sellerBrandId).toBe("brand_lux");
    expect(snapshot.sellerBrandName).toBe("Lux House");
    expect(snapshot.sellerUserId).toBe("user_owner_1");
  });

  it("snapshots the commission rate actually applied, not the current setting", () => {
    const snapshot = buildOrderItemSnapshot(
      line("prod_1", brand("brand_lux", "Lux House", null), "100000.00", 1),
      "3"
    );

    expect(snapshot.commissionRate.toFixed(2)).toBe("3.00");
    expect(snapshot.commissionAmount.toFixed(2)).toBe("3000.00");
    expect(snapshot.earningAmount.toFixed(2)).toBe("97000.00");
  });

  it("historical snapshot is preserved if the brand is later renamed/re-owned", () => {
    // Simulate checkout-time capture
    const snapshot = buildOrderItemSnapshot(
      line("prod_1", brand("brand_lux", "Old Lux House", "user_old"), "100000.00", 1),
      "3"
    );

    // Later, the product's brand is mutated (renamed + new owner). The snapshot
    // must NOT change — financial history is independent of later mutations.
    const laterBrand = brand("brand_lux", "New Lux House", "user_new");
    expect(snapshot.sellerBrandName).toBe("Old Lux House");
    expect(snapshot.sellerUserId).toBe("user_old");
    expect(snapshot.sellerBrandId).toBe(laterBrand.id);
  });

  it("preserves multi-seller orders (multiple brands across cart lines)", () => {
    const snapshots = buildOrderItemSnapshots(
      [
        line("prod_a", brand("brand_a", "Brand A", "owner_a"), "100000.00", 1),
        line("prod_b", brand("brand_b", "Brand B", "owner_b"), "200000.00", 2),
      ],
      "3"
    );

    expect(snapshots).toHaveLength(2);
    expect(snapshots[0].sellerBrandId).toBe("brand_a");
    expect(snapshots[1].sellerBrandId).toBe("brand_b");

    const summary = summarizeOrder(snapshots);
    // subtotal = 100,000 + 400,000 = 500,000
    expect(summary.subtotal.toFixed(2)).toBe("500000.00");
    // commission = 3% of 500,000 = 15,000
    expect(summary.totalCommission.toFixed(2)).toBe("15000.00");
    expect(summary.totalSellerEarning.toFixed(2)).toBe("485000.00");
  });

  it("tolerates products without a brand (orphan marketplace items)", () => {
    const snapshot = buildOrderItemSnapshot(
      line("prod_x", null, "1000.00", 2),
      "3"
    );
    expect(snapshot.sellerBrandId).toBeNull();
    expect(snapshot.sellerBrandName).toBeNull();
    expect(snapshot.sellerUserId).toBeNull();
    // money is still computed
    expect(snapshot.total.toFixed(2)).toBe("2000.00");
    expect(snapshot.commissionAmount.toFixed(2)).toBe("60.00");
  });

  it("order header totals derive from the same per-item calculation (single money path)", () => {
    const snapshots = buildOrderItemSnapshots(
      [line("p", brand("b", "B", null), "33.33", 3)],
      "5"
    );
    const summary = summarizeOrder(snapshots);

    // 33.33 × 3 = 99.99; commission per line = 5% of 99.99 = 5.00
    expect(snapshots[0].total.toFixed(2)).toBe("99.99");
    expect(snapshots[0].commissionAmount.toFixed(2)).toBe("5.00");
    expect(summary.totalCommission.toFixed(2)).toBe("5.00");
    expect(
      summary.totalCommission.plus(summary.totalSellerEarning).equals(summary.subtotal)
    ).toBe(true);
  });
});
