import { notFound } from "next/navigation";

import CategoryForm from "@/components/forms/CategoryForm";
import {
  getCategory,
  updateCategory,
} from "@/features/categories/actions";

interface EditCategoryPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditCategoryPage({
  params,
}: EditCategoryPageProps) {
  const { id } = await params;

  const result = await getCategory(id);

  if (!result.success || !result.data) {
    notFound();
  }

  const category = result.data;

  async function updateAction(formData: FormData) {
    "use server";

    return updateCategory(id, formData);
  }

  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="text-3xl font-bold">
        Edit Category
      </h1>

      <CategoryForm
        initialData={{
          id: category.id,
          name: category.name,
          slug: category.slug,
          description: category.description,
        }}
        action={updateAction}
        submitLabel="Update Category"
      />
    </div>
  );
}