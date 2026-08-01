const features = [
  {
    title: "Verified Brands",
    description:
      "Shop confidently from trusted brands and verified vendors offering authentic products.",
  },
  {
    title: "Secure Payments",
    description:
      "Multiple secure payment options designed to protect every transaction.",
  },
  {
    title: "Fast Delivery",
    description:
      "Reliable shipping partners delivering products quickly across multiple regions.",
  },
  {
    title: "Quality Support",
    description:
      "Dedicated customer support to assist before, during, and after every purchase.",
  },
];

export default function WhyLuxuryMarket() {
  return (
    <section className="bg-slate-900 py-24 text-white">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 text-center">
          <span className="text-sm font-semibold uppercase tracking-[0.3em] text-gray-400">
            Why Choose Us
          </span>

          <h2 className="mt-3 text-4xl font-bold">
            Why Shop with LuxuryMarket?
          </h2>

          <p className="mx-auto mt-5 max-w-3xl text-lg text-gray-300">
            We combine trusted brands, verified vendors, secure technology, and
            excellent customer service to create a premium shopping experience.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur"
            >
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-white text-2xl text-black">
                ✓
              </div>

              <h3 className="text-2xl font-bold">
                {feature.title}
              </h3>

              <p className="mt-4 leading-7 text-gray-300">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
