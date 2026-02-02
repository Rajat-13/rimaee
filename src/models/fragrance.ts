// src/models/fragrance.ts

export interface ProductVariant {
  size: "8ml" | "50ml" | "100ml";
  mrp: number;
  discount: number;
  price: number;
}

export interface ProductImage {
  image?: string;
  images?: string[];
}

export interface Notes {
  top: string[];
  heart: string[];
  base: string[];
}

export interface Concentration {
  sillage: number;
  projection: number;
  longevity: number;
}

export interface Fragrance {
  id: number;
  name: string;
  sku: string;
  slug?: string;
  type: "perfume" | "attar";
  category?: string;
  gender: "male" | "female" | "unisex";
  isActive: boolean;
  variants: ProductVariant[];
  product_images?: ProductImage[];
  images?: string[];
  description?: string;
  notes?: Notes;
  concentration?: Concentration;
  occasion?: string;
  tag?: string;
  maxOrderThreshold?: number;
  stockID?: number;
}

// Transform API response to Fragrance model
export const transformApiToFragrance = (data: any): Fragrance => {
  return {
    id: data.id,
    name: data.name || "",
    sku: data.sku || "",
    slug: data.slug || data.name?.toLowerCase().replace(/\s+/g, "-"),
    type: data.product_type || data.type || "perfume",
    category: data.category || "",
    gender: data.gender || "unisex",
    isActive: data.is_active ?? true,
    variants: (data.variants || []).map((v: any) => ({
      size: v.size,
      mrp: Number(v.mrp) || 0,
      discount: Number(v.discount) || 0,
      price: Number(v.price) || 0,
    })),
    product_images: data.product_images || [],
    description: data.description || "",
    notes: data.notes || { top: [], heart: [], base: [] },
    concentration: {
      sillage: data.sillage || 50,
      projection: data.projection || 50,
      longevity: data.longevity || 50,
    },
    occasion: data.occasion || "",
    tag: data.tag || undefined,
    maxOrderThreshold: data.max_order_threshold || 5,
    stockID: data.stock_id || 0,
  };
};

// Transform Fragrance model to API format
export const transformFragranceToApi = (data: Partial<Fragrance>): any => {
  return {
    name: data.name,
    sku: data.sku,
    product_type: data.type,
    category: data.category,
    gender: data.gender,
    is_active: data.isActive,
    variants: data.variants,
    product_images: data.product_images,
    description: data.description,
    notes: data.notes,
    sillage: data.concentration?.sillage,
    projection: data.concentration?.projection,
    longevity: data.concentration?.longevity,
    occasion: data.occasion,
    tag: data.tag,
    max_order_threshold: data.maxOrderThreshold,
    stock_id: data.stockID,
  };
};
