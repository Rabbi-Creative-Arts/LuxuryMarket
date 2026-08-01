const categories = [
  "Electronics",
  "Fashion",
  "Beauty",
  "Home",
  "Sports",
  "Automobile",
  "Jewelry",
  "Books",
];

export default function CategoryGrid() {
  return (
    <section>
      <h2 className="mb-8 text-3xl font-bold">
        Shop by Category
      </h2>

      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {categories.map((category) => (
          <div
            key={category}
            className="rounded-2xl border bg-white p-8 text-center shadow-sm transition hover:shadow-lg"
          >
            <h3 className="text-lg font-semibold">
              {category}
            </h3>
          </div>
        ))}
      </div>
    </section>
  );
}
