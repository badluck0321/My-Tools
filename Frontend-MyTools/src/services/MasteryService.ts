import interceptor from "../interceptors/auth.interceptor";
import { useAuth } from "../context/AuthContext";
import { Mastery } from "../models/Mastery";

export const masteryService = {
  async getMasterys(): Promise<Mastery[]> {
    const response = await interceptor.get("/masterys/specials");
    return response.data as Mastery[]; // <-- Correct
  },
  async getMasteryById(id: string): Promise<Mastery> {
    const response = await interceptor.get(`/masterys/${id}`);
    return response.data as Mastery;
  },
  async getMasteryPhoto(photoId: string): Promise<string> {
    const response = await interceptor.get(`/masterys/photos/${photoId}`, {
      responseType: "blob",
    });
    return URL.createObjectURL(response.data);
  },
};
