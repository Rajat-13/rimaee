import { apiRequest } from "@/config/apiClient";
import { API_ENDPOINTS } from "@/config/urls";
import { Fragrance } from "@/models/fragrance";

export const fragranceRepository = {
  list: async (): Promise<Fragrance[]> => {
    const res = await apiRequest<{ results: Fragrance[] }>(API_ENDPOINTS.fragrances.list());
    if (!res.success) throw new Error(res.message || "Failed to fetch fragrances");
    return res.data!.results;
  },

  get: async (id: number): Promise<Fragrance> => {
    const res = await apiRequest<Fragrance>(API_ENDPOINTS.fragrances.get(id));
    if (!res.success) throw new Error(res.message || "Failed to fetch fragrance");
    return res.data!;
  },

  create: async (data: Partial<Fragrance>): Promise<Fragrance> => {
    const res = await apiRequest<Fragrance>(API_ENDPOINTS.fragrances.create(), {
      method: "POST",
      body: JSON.stringify(data),
    });
    if (!res.success) throw new Error(res.message || "Failed to create fragrance");
    return res.data!;
  },

  update: async (id: number, data: Partial<Fragrance>): Promise<Fragrance> => {
    const res = await apiRequest<Fragrance>(API_ENDPOINTS.fragrances.update(id), {
      method: "PUT",
      body: JSON.stringify(data),
    });
    if (!res.success) throw new Error(res.message || "Failed to update fragrance");
    return res.data!;
  },

  delete: async (id: number): Promise<void> => {
    const res = await apiRequest(API_ENDPOINTS.fragrances.delete(id), { method: "DELETE" });
    if (!res.success) throw new Error(res.message || "Failed to delete fragrance");
  },
};
