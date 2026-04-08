import interceptor from "../interceptors/auth.interceptor";
import { Product } from "../models/Product";
import { useAuth } from "../context/AuthContext";

export const productService = {
  async getProducts(): Promise<Product[]> {
    const response = await interceptor.get("/products");
    return response.data as Product[]; // <-- Correct
  },
  async getProductById(id: string): Promise<Product> {
    const response = await interceptor.get(`/products/${id}`);
    return response.data as Product;
  },
  async getProductPhoto(photoId: string): Promise<string> {
    const response = await interceptor.get(`/products/photos/${photoId}`, {
      responseType: "blob",
    });
    return URL.createObjectURL(response.data);
  },
};
