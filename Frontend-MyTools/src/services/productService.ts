import interceptor from "../interceptors/auth.interceptor";
import { Product } from "../models/Product";

const cleanParams = (params: Record<string, unknown> = {}) => Object.fromEntries(
  Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== "" && value !== "all")
);

export const productService = {
  async getProducts(params: Record<string, unknown> = {}): Promise<Product[]> {
    const response = await interceptor.get("/products", { params: cleanParams(params) });
    return response.data as Product[];
  },
  async getProductById(id: string): Promise<Product> {
    const response = await interceptor.get(`/products/${id}`);
    return response.data as Product;
  },
  async getProductPhoto(photoUrls: string): Promise<string> {
    if (!photoUrls) return "/no-image.png";
    if (photoUrls.startsWith("http://") || photoUrls.startsWith("https://") || photoUrls.startsWith("blob:")) {
      return photoUrls;
    }
    const response = await interceptor.get(`/products/photos/${photoUrls}`, { responseType: "blob" });
    return URL.createObjectURL(response.data);
  },
  async getMyProducts(): Promise<Product[]> {
    const response = await interceptor.get("/products/mine");
    return response.data as Product[];
  },
  async getProductsByOwner(ownerId: string): Promise<Product[]> {
    const response = await interceptor.get("/products", { params: { ownerId } });
    return response.data as Product[];
  },
  async createProduct(formData: FormData): Promise<Product> {
    const response = await interceptor.post('/products', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    return response.data as Product;
  },
  async updateProduct(id: string, formData: FormData): Promise<Product> {
    const response = await interceptor.put(`/products/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    return response.data as Product;
  },
  async deleteProduct(id: string): Promise<void> {
    await interceptor.delete(`/products/${id}`);
  },
};
