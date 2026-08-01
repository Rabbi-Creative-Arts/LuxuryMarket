const products = [
  "MacBook Pro",
  "iPhone",
  "Sony Camera",
  "Gaming Laptop",
];

export default function FeaturedProducts() {
  return (
    <section>
      <h2 className="mb-8 text-3xl font-bold">
        Featured Products
      </h2>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <div
            key={product}
            className="rounded-2xl border bg-white p-6 shadow-sm"
          >
            <div className="mb-6 h-40 rounded-xl bg-gray-200"></div>

            <h3 className="font-semibold">
              {product}
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              Premium Quality
            </p>

            <button className="mt-6 w-full rounded-lg bg-black py-2 text-white">
              View Product
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
