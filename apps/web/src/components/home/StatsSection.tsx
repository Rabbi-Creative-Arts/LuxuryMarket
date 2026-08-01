const stats = [
  { label: "Products", value: "10,000+" },
  { label: "Vendors", value: "500+" },
  { label: "Customers", value: "100K+" },
  { label: "Countries", value: "40+" },
];

export default function StatsSection() {
  return (
    <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-2xl border bg-white p-8 text-center"
        >
          <h2 className="text-4xl font-bold">
            {stat.value}
          </h2>

          <p className="mt-3 text-gray-500">
            {stat.label}
          </p>
        </div>
      ))}
    </section>
  );
}
