const Brand = [
  "Apple Store",
  "Samsung",
  "Sony",
  "Luxury Electronics",
];

export default function FeaturedBrand() {
  return (
    <section>
      <h2 className="mb-8 text-3xl font-bold">
        Featured Brand
      </h2>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {Brand.map((Brand) => (
          <div
            key={Brand}
            className="rounded-2xl border bg-white p-8 shadow-sm"
          >
            <div className="mx-auto mb-5 h-20 w-20 rounded-full bg-gray-200"></div>

            <h3 className="text-center text-lg font-semibold">
              {Brand}
            </h3>

            <p className="mt-2 text-center text-sm text-gray-500">
              Trusted Brand
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
