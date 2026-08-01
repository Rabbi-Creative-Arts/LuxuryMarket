"use client";

import { useState } from "react";

import { generateSlug } from "@/utils/slug";

interface CategoryFormProps {
  initialData?: {
    id?: string;
    name: string;
    slug: string;
    description?: string | null;
  };

  action: (formData: FormData) => Promise<any>;

  submitLabel?: string;
}

export default function CategoryForm({
  initialData,
  action,
  submitLabel = "Save Category",
}: CategoryFormProps) {
  const [name, setName] = useState(initialData?.name ?? "");
  const [slug, setSlug] = useState(initialData?.slug ?? "");
  const [description, setDescription] = useState(
    initialData?.description ?? ""
  );

  function handleNameChange(value: string) {
    setName(value);

    if (!initialData) {
      setSlug(generateSlug(value));
    }
  }

  return (
    <form action={action} className="space-y-6">
      {initialData?.id && (
        <input
          type="hidden"
          name="id"
          value={initialData.id}
        />
      )}

      <div>
        <label
          htmlFor="name"
          className="mb-2 block text-sm font-medium"
        >
          Category Name
        </label>

        <input
          id="name"
          name="name"
          type="text"
          required
          value={name}
          onChange={(e) => handleNameChange(e.target.value)}
          className="w-full rounded-lg border px-4 py-2"
        />
      </div>

      <div>
        <label
          htmlFor="slug"
          className="mb-2 block text-sm font-medium"
        >
          Slug
        </label>

        <input
          id="slug"
          name="slug"
          type="text"
          required
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          className="w-full rounded-lg border px-4 py-2"
        />
      </div>

      <div>
        <label
          htmlFor="description"
          className="mb-2 block text-sm font-medium"
        >
          Description
        </label>

        <textarea
          id="description"
          name="description"
          rows={5}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full rounded-lg border px-4 py-2"
        />
      </div>

      <button
        type="submit"
        className="rounded-lg bg-black px-6 py-3 text-white transition hover:opacity-90"
      >
        {submitLabel}
      </button>
    </form>
  );
}
