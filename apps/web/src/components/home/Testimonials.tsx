import { testimonials } from "@/data/homepage";

export default function Testimonials() {
  return (
    <section className="bg-gray-50 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 text-center">
          <span className="text-sm font-semibold uppercase tracking-[0.3em] text-gray-500">
            Testimonials
          </span>

          <h2 className="mt-3 text-4xl font-bold tracking-tight">
            What Our Customers Say
          </h2>

          <p className="mx-auto mt-5 max-w-3xl text-lg text-gray-600">
            Hear from customers who have discovered trusted brands and premium
            products through LuxuryMarket.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-gray-200 transition hover:shadow-lg"
            >
              <div className="mb-6 text-2xl text-amber-500">
                ★★★★★
              </div>

              <p className="leading-8 text-gray-700">
                "{testimonial.comment}"
              </p>

              <div className="mt-8 border-t pt-6">
                <h3 className="font-bold">
                  {testimonial.name}
                </h3>

                <p className="text-sm text-gray-500">
                  Verified Customer
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
