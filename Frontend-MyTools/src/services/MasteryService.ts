import interceptor from "../interceptors/auth.interceptor";
import { Mastery } from "../models/Mastery";

const cleanParams = (params: Record<string, unknown> = {}) => Object.fromEntries(
  Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== "" && value !== "all")
);

export const masteryService = {
  async getMasterys(masterIdOrParams?: string | Record<string, unknown>): Promise<Mastery[]> {
    const params = typeof masterIdOrParams === 'string' ? { masterId: masterIdOrParams } : cleanParams(masterIdOrParams || {});
    const response = await interceptor.get(`/masterys/specials`, { params });
    return response.data as Mastery[];
  },
  async getMyMasterys(): Promise<Mastery[]> {
    const response = await interceptor.get('/masterys/mine');
    return response.data as Mastery[];
  },
  async getMasteryById(id: string): Promise<Mastery> {
    const response = await interceptor.get(`/masterys/${id}`);
    return response.data as Mastery;
  },
  async createMastery(formData: FormData): Promise<Mastery> {
    const response = await interceptor.post('/masterys', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    return response.data as Mastery;
  },
  async updateMastery(id: string, formData: FormData): Promise<Mastery> {
    const response = await interceptor.put(`/masterys/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    return response.data as Mastery;
  },
  async deleteMastery(id: string): Promise<void> {
    await interceptor.delete(`/masterys/${id}`);
  },
  async getMasteryPhoto(photoUrls: string): Promise<string> {
    if (!photoUrls) return "/no-image.png";
    if (photoUrls.startsWith("http://") || photoUrls.startsWith("https://") || photoUrls.startsWith("blob:")) {
      return photoUrls;
    }
    const response = await interceptor.get(`/masterys/photos/${photoUrls}`, { responseType: "blob" });
    return URL.createObjectURL(response.data);
  },
};
