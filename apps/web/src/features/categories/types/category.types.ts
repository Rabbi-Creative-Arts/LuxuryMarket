export interface Category {
  id: string;

  name: string;

  slug: string;

  description: string | null;

  image: string | null;

  parentId: string | null;

  isActive: boolean;

  sortOrder: number;

  createdAt: Date;

  updatedAt: Date;
}

export interface CategoryTree extends Category {
  children: CategoryTree[];
}
