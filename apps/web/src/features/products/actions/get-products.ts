"use server";

import { ProductService } from "../services/product.service";

export async function getProducts() {
  return ProductService.getAll();
}

export async function getProductsByVendor(vendorId: string) {
  return ProductService.getByVendor(vendorId);
}

export async function getProductsByCategory(categoryId: string) {
  return ProductService.getByCategory(categoryId);
}
