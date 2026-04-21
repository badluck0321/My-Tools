import interceptor from "../interceptors/auth.interceptor";
import { useAuth } from "../context/AuthContext";
import { Mastery } from "../models/Mastery";

export const MasteryService = {
  async getMasterys(): Promise<Mastery[]> {
    const response = await interceptor.get("/masterys");
    return response.data as Mastery[]; // <-- Correct
  },
  async getMasteryById(id: string): Promise<Mastery> {
    const response = await interceptor.get(`/masterys/${id}`);
    return response.data as Mastery;
  },
};
