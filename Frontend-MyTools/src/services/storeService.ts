import interceptor from "../interceptors/auth.interceptor";
import { Store } from "../models/Store";
import { useAuth } from "../context/AuthContext";

export const storeService = {
  async getStore(): Promise<Store[]> {
    const response = await interceptor.get("/stores");
    return response.data as Store[]; // <-- Correct
  },
    async addProduct(store: Store): Promise<Store[]> {
    const response = await interceptor.post("/stores", store);
    return response.data as Store[]; // <-- Correct
  },
};
