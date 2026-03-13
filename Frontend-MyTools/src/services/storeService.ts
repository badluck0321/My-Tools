import interceptor from "../interceptors/auth.interceptor";
import { Product } from "../models/Product";
import { useAuth } from "../context/AuthContext";

export const productService = {
  async getProduct(): Promise<Product[]> {
    const response = await interceptor.get("/stores");
    return response.data as Product[]; // <-- Correct
  },
    async addProduct(Store stores): Promise<Product[]> {
    const response = await interceptor.get("/stores");
    return response.data as Product[]; // <-- Correct
  },
};
