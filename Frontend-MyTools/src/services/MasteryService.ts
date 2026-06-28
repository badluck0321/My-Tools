import interceptor from "../interceptors/auth.interceptor";
import { useAuth } from "../context/AuthContext";
import { Mastery } from "../models/Mastery";

export const masteryService = {
  async getMasterys(masterId?: string): Promise<Mastery[]> {
    const query = masterId ? `?masterId=${encodeURIComponent(masterId)}` : "";
    const response = await interceptor.get(`/masterys/specials${query}`);
    return response.data as Mastery[];
  },
  async getMasteryById(id: string): Promise<Mastery> {
    const response = await interceptor.get(`/masterys/${id}`);
    return response.data as Mastery;
  },
  async getMasteryPhoto(photoUrls: string): Promise<string> {
    const response = await interceptor.get(`/masterys/photos/${photoUrls}`, {
      responseType: "blob",
    });
    return URL.createObjectURL(response.data);
  },
};
