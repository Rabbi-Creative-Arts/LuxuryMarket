import { createBrand } from "@/features/brands/actions/create-brand";

export default function NewBrandPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold">
          Create Brand
        </h1>

        <p className="text-gray-500">
          Add a new brand to LuxuryMarket.
        </p>
      </div>

      <form
        action={createBrand}
        className="space-y-6 rounded-xl border bg-white p-8"
      >
        <div>
          <label className="mb-2 block font-medium">
            Brand Name *
          </label>

          <input
            name="name"
            required
            className="w-full rounded border p-3"
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">
            Slug *
          </label>

          <input
            name="slug"
            required
            className="w-full rounded border p-3"
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">
            Description
          </label>

          <textarea
            name="description"
            rows={5}
            className="w-full rounded border p-3"
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block font-medium">
              Country
            </label>

            <input
              name="country"
              className="w-full rounded border p-3"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">
              Official Website
            </label>

            <input
              name="website"
              className="w-full rounded border p-3"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">
              Business Email
            </label>

            <input
              name="email"
              type="email"
              className="w-full rounded border p-3"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">
              Business Phone
            </label>

            <input
              name="phone"
              className="w-full rounded border p-3"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">
              Logo URL
            </label>

            <input
              name="logo"
              className="w-full rounded border p-3"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">
              Cover URL
            </label>

            <input
              name="coverImage"
              className="w-full rounded border p-3"
            />
          </div>
        </div>

        <button
          type="submit"
          className="rounded-lg bg-black px-6 py-3 text-white"
        >
          Create Brand
        </button>
      </form>
    </div>
  );
}