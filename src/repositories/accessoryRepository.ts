import { apiRequest } from "@/config/apiClient";
import { API_ENDPOINTS } from "@/config/urls";
import {
  Accessory,
  transformApiToAccessory,
  transformAccessoryToApi,
} from "@/models/accessory";

export const accessoryRepository = {
  // List all accessories
  list: async (): Promise<Accessory[]> => {
    const res = await apiRequest<any>(API_ENDPOINTS.accessories.list());
    if (!res.success) {
      console.error("Failed to fetch accessories:", res.message);
      return [];
    }

    const results = Array.isArray(res.data)
      ? res.data
      : res.data?.results || [];

    return results.map(transformApiToAccessory);
  },

  // Get by ID
  get: async (id: number): Promise<Accessory | null> => {
    const res = await apiRequest<any>(API_ENDPOINTS.accessories.get(id));
    if (!res.success || !res.data) {
      console.error("Failed to fetch accessory:", res.message);
      return null;
    }
    return transformApiToAccessory(res.data);
  },

  // Create
  create: async (data: Partial<Accessory>): Promise<Accessory | null> => {
    const payload = transformAccessoryToApi(data);
    const res = await apiRequest<any>(API_ENDPOINTS.accessories.create(), {
      method: "POST",
      body: JSON.stringify(payload),
    });

    if (!res.success || !res.data) {
      console.error("Failed to create accessory:", res.message);
      return null;
    }

    return transformApiToAccessory(res.data);
  },

  // Update
  update: async (
    id: number | string,
    data: Partial<Accessory>
  ): Promise<Accessory | null> => {
    const payload = transformAccessoryToApi(data);
    const res = await apiRequest<any>(API_ENDPOINTS.accessories.update(id), {
      method: "PUT",
      body: JSON.stringify(payload),
    });

    if (!res.success || !res.data) {
      console.error("Failed to update accessory:", res.message);
      return null;
    }

    return transformApiToAccessory(res.data);
  },

  // Delete
  delete: async (id: number | string): Promise<boolean> => {
    const res = await apiRequest(API_ENDPOINTS.accessories.delete(id), {
      method: "DELETE",
    });

    if (!res.success) {
      console.error("Failed to delete accessory:", res.message);
      return false;
    }

    return true;
  },
};
