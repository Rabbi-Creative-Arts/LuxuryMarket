export interface ProductFormData {
  name: string;
  slug: string;
  sku: string;

  description: string;
  shortDescription?: string;

  price: number;
  quantity: number;

  categoryId: string;

  featured: boolean;

  status:
    | "DRAFT"
    | "ACTIVE"
    | "OUT_OF_STOCK"
    | "ARCHIVED";
}

export interface ProductImageData {
  id: string;
  url: string;
  alt?: string;
  position: number;
}

export interface ProductWithImages extends ProductFormData {
  id: string;

  vendorId: string;

  createdAt: Date;

  updatedAt: Date;

  images: ProductImageData[];
}
