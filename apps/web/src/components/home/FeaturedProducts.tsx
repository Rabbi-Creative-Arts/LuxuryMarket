import { ProductCard } from "@/components/ui";
import { products } from "@/data/products";

export default function FeaturedProducts() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <div className="mb-10">
        <h2 className="text-3xl font-bold">
          Featured Products
        </h2>

        <p className="mt-2 text-gray-600">
          Discover our latest premium products.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            {...product}
          />
        ))}
      </div>
    </section>
  );
}