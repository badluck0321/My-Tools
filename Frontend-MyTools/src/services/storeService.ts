import interceptor from "../interceptors/auth.interceptor";
import { Store } from "../models/Store";

export const storeService = {
  async getStores(): Promise<Store[]> {
    const response = await interceptor.get("/stores");
    return response.data as Store[];
  },

  async getStoreById(id: string): Promise<Store> {
    const response = await interceptor.get(`/stores/${id}`);
    return response.data as Store;
  },

  async getStoreByOwner(ownerId: string): Promise<Store> {
    const response = await interceptor.get(`/stores/owner/${ownerId}`);
    return response.data as Store;
  },

  async getMyStore(): Promise<Store | null> {
    const response = await interceptor.get("/stores/mine");
    return response.status === 204 ? null : (response.data as Store);
  },

  async createStore(store: Store): Promise<Store> {
    const response = await interceptor.post("/stores", store);
    return response.data as Store;
  },

  async updateStore(id: string, store: Partial<Store>): Promise<Store> {
    const response = await interceptor.put(`/stores/${id}`, store);
    return response.data as Store;
  },

  async deleteStore(id: string): Promise<void> {
    await interceptor.delete(`/stores/${id}`);
  },
};
