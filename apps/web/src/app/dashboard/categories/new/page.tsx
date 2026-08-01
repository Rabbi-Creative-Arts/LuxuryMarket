import CategoryForm from "@/components/forms/CategoryForm";
import { createCategory } from "@/features/categories/actions";

export default function NewCategoryPage() {
  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="text-3xl font-bold">
        Create Category
      </h1>

      <CategoryForm
        action={createCategory}
        submitLabel="Create Category"
      />
    </div>
  );
}
