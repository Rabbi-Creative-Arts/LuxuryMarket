import { createCategory } from "@/features/categories/actions/create-category";

export default function NewCategoryPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8">

      <div>
        <h1 className="text-3xl font-bold">
          Add Category
        </h1>

        <p className="text-gray-500">
          Create a marketplace category.
        </p>
      </div>

      <form
        action={createCategory}
        className="space-y-6 rounded-xl border bg-white p-8"
      >

        <div>
          <label className="mb-2 block font-medium">
            Category Name *
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

        <button
          type="submit"
          className="rounded-lg bg-black px-8 py-3 text-white"
        >
          Create Category
        </button>

      </form>

    </div>
  );
} 