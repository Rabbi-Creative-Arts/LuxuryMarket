"use server";

import { ProductService } from "../services/product.service";

export async function getProduct(id: string) {
  return ProductService.getById(id);
}

export async function getProductBySlug(slug: string) {
  return ProductService.getBySlug(slug);
}
