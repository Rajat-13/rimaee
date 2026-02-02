import { apiRequest } from "@/config/apiClient";
import { API_ENDPOINTS } from "@/config/urls";
import {
  Fragrance,
  transformApiToFragrance,
} from "@/models/fragrance";

// Frontend product interface for components
export interface FrontendProduct {
  id: number | string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  tag?: string;
  gender?: string;
  category?: string;
  type?: string;
  description?: string;
}

// Transform Fragrance to FrontendProduct
const toFrontendProduct = (f: Fragrance): FrontendProduct => ({
  id: f.id,
  name: f.name,
  slug: f.slug || f.name.toLowerCase().replace(/\s+/g, "-"),
  price: f.variants?.[0]?.price || 0,
  originalPrice: f.variants?.[0]?.mrp,
  image: f.product_images?.[0]?.image || "",
  images: f.product_images?.[0]?.images,
  tag: f.tag,
  gender: f.gender,
  category: f.category,
  type: f.type,
  description: f.description,
});

export const productRepository = {
  // List all products
  list: async (): Promise<FrontendProduct[]> => {
    const res = await apiRequest<any>(API_ENDPOINTS.fragrances.list());
    if (!res.success) {
      console.error("Failed to fetch products:", res.message);
      return [];
    }

    const results = Array.isArray(res.data)
      ? res.data
      : res.data?.results || [];

    return results.map(transformApiToFragrance).map(toFrontendProduct);
  },

  // Get by ID
  get: async (id: number): Promise<FrontendProduct | null> => {
    const res = await apiRequest<any>(API_ENDPOINTS.fragrances.get(id));
    if (!res.success || !res.data) {
      console.error("Failed to fetch product:", res.message);
      return null;
    }
    return toFrontendProduct(transformApiToFragrance(res.data));
  },

  // Get by slug
  getBySlug: async (slug: string): Promise<FrontendProduct | null> => {
    const all = await productRepository.list();
    return all.find(p => p.slug === slug) || null;
  },

  // Search
  search: async (query: string): Promise<FrontendProduct[]> => {
    const all = await productRepository.list();
    const q = query.toLowerCase();

    return all.filter(
      f =>
        f.name?.toLowerCase().includes(q) ||
        f.category?.toLowerCase().includes(q) ||
        f.description?.toLowerCase().includes(q)
    );
  },

  // Filter by gender
  listByGender: async (
    gender: "male" | "female" | "unisex"
  ): Promise<FrontendProduct[]> => {
    const all = await productRepository.list();
    return all.filter(f => f.gender === gender);
  },

  // Filter by type
  listByType: async (type: "perfume" | "attar"): Promise<FrontendProduct[]> => {
    const all = await productRepository.list();
    return all.filter(f => f.type === type);
  },

  // Filter by tag
  listByTag: async (tag: string): Promise<FrontendProduct[]> => {
    const all = await productRepository.list();
    return all.filter(f => f.tag === tag);
  },

  // List bestsellers
  listBestsellers: async (): Promise<FrontendProduct[]> => {
    const all = await productRepository.list();
    return all.filter(
      f => f.tag === "Bestseller" || f.tag === "Premium"
    );
  },
};
