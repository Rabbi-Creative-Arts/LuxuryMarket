export interface Brand {
  id: string;
  name: string;
  slug: string;

  description?: string;

  logo?: string;

  website?: string;

  email?: string;

  phone?: string;

  country?: string;

  featured: boolean;

  active: boolean;

  createdAt: Date;

  updatedAt: Date;
}

export interface CreateBrandInput {
  name: string;
  description?: string;
  logo?: string;
  website?: string;
  email?: string;
  phone?: string;
  country?: string;
}

export interface UpdateBrandInput
  extends Partial<CreateBrandInput> {
  id: string;
}