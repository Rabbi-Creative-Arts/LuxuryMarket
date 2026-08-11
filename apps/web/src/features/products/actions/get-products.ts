"use server";

import { productService } from "../services/product.service";

export async function getProducts() {
  return productService.getAll();
}
