import { apiRequest } from "@/config/apiClient";
import { API_ENDPOINTS } from "@/config/urls";
import {
  Fragrance,
  transformApiToFragrance,
  transformFragranceToApi,
} from "@/models/fragrance";

export const fragranceRepository = {
  // =============================
  // LIST ALL
  // =============================
  list: async (): Promise<Fragrance[]> => {
    const res = await apiRequest<any>(API_ENDPOINTS.fragrances.list());
    if (!res.success) {
      console.error("Failed to fetch fragrances:", res.message);
      return [];
    }

    const results = Array.isArray(res.data)
      ? res.data
      : res.data?.results || [];

    return results.map(transformApiToFragrance);
  },

  // =============================
  // GET BY ID
  // =============================
  get: async (id: number): Promise<Fragrance | null> => {
    const res = await apiRequest<any>(API_ENDPOINTS.fragrances.get(id));
    if (!res.success || !res.data) {
      console.error("Failed to fetch fragrance:", res.message);
      return null;
    }
    return transformApiToFragrance(res.data);
  },

  // =============================
  // CREATE
  // =============================
  create: async (data: Partial<Fragrance>): Promise<Fragrance | null> => {
    const payload = transformFragranceToApi(data);
    const res = await apiRequest<any>(API_ENDPOINTS.fragrances.create(), {
      method: "POST",
      body: JSON.stringify(payload),
    });

    if (!res.success || !res.data) {
      console.error("Failed to create fragrance:", res.message);
      return null;
    }

    return transformApiToFragrance(res.data);
  },

  // =============================
  // UPDATE
  // =============================
  update: async (
    id: number | string,
    data: Partial<Fragrance>
  ): Promise<Fragrance | null> => {
    const payload = transformFragranceToApi(data);
    const res = await apiRequest<any>(API_ENDPOINTS.fragrances.update(id), {
      method: "PUT",
      body: JSON.stringify(payload),
    });

    if (!res.success || !res.data) {
      console.error("Failed to update fragrance:", res.message);
      return null;
    }

    return transformApiToFragrance(res.data);
  },

  // =============================
  // DELETE
  // =============================
  delete: async (id: number | string): Promise<boolean> => {
    const res = await apiRequest(API_ENDPOINTS.fragrances.delete(id), {
      method: "DELETE",
    });

    if (!res.success) {
      console.error("Failed to delete fragrance:", res.message);
      return false;
    }

    return true;
  },

  // =============================
  // FILTERS
  // =============================
  listByCategory: async (category: string): Promise<Fragrance[]> => {
    const all = await fragranceRepository.list();
    return all.filter(
      f => f.category?.toLowerCase() === category.toLowerCase()
    );
  },

  listByType: async (type: "perfume" | "attar"): Promise<Fragrance[]> => {
    const all = await fragranceRepository.list();
    return all.filter(f => f.type === type);
  },

  listByGender: async (
    gender: "male" | "female" | "unisex"
  ): Promise<Fragrance[]> => {
    const all = await fragranceRepository.list();
    return all.filter(f => f.gender === gender);
  },

  listByTag: async (tag: string): Promise<Fragrance[]> => {
    const all = await fragranceRepository.list();
    return all.filter(f => f.tag === tag);
  },

  // ✅ BESTSELLERS (THIS FIXES YOUR ERROR)
  listBestsellers: async (): Promise<Fragrance[]> => {
    const all = await fragranceRepository.list();
    return all.filter(
      f => f.tag === "Bestseller" || f.tag === "Premium"
    );
  },

  // =============================
  // SEARCH
  // =============================
  search: async (query: string): Promise<Fragrance[]> => {
    const all = await fragranceRepository.list();
    const q = query.toLowerCase();

    return all.filter(
      f =>
        f.name?.toLowerCase().includes(q) ||
        f.category?.toLowerCase().includes(q) ||
        f.description?.toLowerCase().includes(q)
    );
  },
};
