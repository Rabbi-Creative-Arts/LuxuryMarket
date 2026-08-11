"use server";

import { productService } from "../services/product.service";

export async function getProduct(id: string) {
  return productService.getById(id);
}