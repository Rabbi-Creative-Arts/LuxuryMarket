import { notFound } from "next/navigation";

import { brandService } from "@/features/brands/services/brand.service";
import { updateBrand } from "@/features/brands/actions/update-brand";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditBrandPage({ params }: Props) {
  const { id } = await params;

  const brand = await brandService.getById(id);

  if (!brand) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="mb-2 text-4xl font-bold">
        Edit Brand
      </h1>

      <p className="mb-8 text-gray-500">
        Update brand information.
      </p>

      <form action={updateBrand} className="space-y-6">

        <input
          type="hidden"
          name="id"
          value={brand.id}
        />

        <div>
          <label>Brand Name</label>

          <input
            name="name"
            defaultValue={brand.name}
            className="w-full rounded border p-3"
          />
        </div>

        <div>
          <label>Slug</label>

          <input
            name="slug"
            defaultValue={brand.slug}
            className="w-full rounded border p-3"
          />
        </div>

        <div>
          <label>Description</label>

          <textarea
            name="description"
            defaultValue={brand.description ?? ""}
            className="w-full rounded border p-3"
            rows={5}
          />
        </div>

        <div className="grid grid-cols-2 gap-6">

          <div>
            <label>Country</label>

            <input
              name="country"
              defaultValue={brand.country ?? ""}
              className="w-full rounded border p-3"
            />
          </div>

          <div>
            <label>Website</label>

            <input
              name="website"
              defaultValue={brand.website ?? ""}
              className="w-full rounded border p-3"
            />
          </div>

        </div>

        <div className="grid grid-cols-2 gap-6">

          <div>
            <label>Email</label>

            <input
              name="email"
              defaultValue={brand.email ?? ""}
              className="w-full rounded border p-3"
            />
          </div>

          <div>
            <label>Phone</label>

            <input
              name="phone"
              defaultValue={brand.phone ?? ""}
              className="w-full rounded border p-3"
            />
          </div>

        </div>

        <div className="grid grid-cols-2 gap-6">

          <label className="flex items-center gap-3">

            <input
              type="checkbox"
              name="verified"
              defaultChecked={brand.verified}
            />

            Verified Brand

          </label>

          <label className="flex items-center gap-3">

            <input
              type="checkbox"
              name="featured"
              defaultChecked={brand.featured}
            />

            Featured Brand

          </label>

        </div>

        <button
          type="submit"
          className="rounded-lg bg-black px-8 py-3 text-white"
        >
          Save Changes
        </button>

      </form>
    </div>
  );
}