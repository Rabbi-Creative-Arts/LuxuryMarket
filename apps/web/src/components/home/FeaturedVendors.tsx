import { VendorCard } from "@/components/ui";
import { vendors } from "@/data/vendors";

export default function FeaturedVendors() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <div className="mb-10">
        <h2 className="text-3xl font-bold">
          Featured Vendors
        </h2>

        <p className="mt-2 text-gray-600">
          Shop from our trusted sellers.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {vendors.map((vendor) => (
          <VendorCard
            key={vendor.id}
            {...vendor}
          />
        ))}
      </div>
    </section>
  );
}