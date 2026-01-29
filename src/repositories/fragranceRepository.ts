import { apiRequest } from "@/config/apiClient";
import { API_ENDPOINTS } from "@/config/urls";
import { Fragrance, transformApiToFragrance, transformFragranceToApi } from "@/models/fragrance";

export const fragranceRepository = {
  list: async (): Promise<Fragrance[]> => {
    const res = await apiRequest<any[]>(API_ENDPOINTS.fragrances.list());
    if (!res.success) throw new Error(res.message || "Failed to fetch fragrances");
    
    // Handle both paginated and non-paginated responses
    const results = Array.isArray(res.data) ? res.data : (res.data as any)?.results || [];
    return results.map(transformApiToFragrance);
  },

  get: async (id: number): Promise<Fragrance> => {
    const res = await apiRequest<any>(API_ENDPOINTS.fragrances.get(id));
    if (!res.success) throw new Error(res.message || "Failed to fetch fragrance");
    return transformApiToFragrance(res.data!);
  },

  create: async (data: Partial<Fragrance>): Promise<Fragrance> => {
    const payload = transformFragranceToApi(data);
    const res = await apiRequest<any>(API_ENDPOINTS.fragrances.create(), {
      method: "POST",
      body: JSON.stringify(payload),
    });
    if (!res.success) throw new Error(res.message || "Failed to create fragrance");
    return transformApiToFragrance(res.data!);
  },

  update: async (id: string, data: Partial<Fragrance>): Promise<Fragrance> => {
    const payload = transformFragranceToApi(data);
    const res = await apiRequest<any>(API_ENDPOINTS.fragrances.update(id), {
      method: "PUT",
      body: JSON.stringify(payload),
    });
    if (!res.success) throw new Error(res.message || "Failed to update fragrance");
    return transformApiToFragrance(res.data!);
  },

  delete: async (id: string): Promise<void> => {
    const res = await apiRequest(API_ENDPOINTS.fragrances.delete(id), { method: "DELETE" });
    if (!res.success) throw new Error(res.message || "Failed to delete fragrance");
  },
};
