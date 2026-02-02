// src/models/accessory.ts

export interface Accessory {
  id: number;
  name: string;
  sku: string;
  slug?: string;
  price: number;
  mrp?: number;
  originalPrice?: number;
  discount?: number;
  image: string;
  images?: string[];
  description: string;
  category?: string;
  tag?: string;
  isActive: boolean;
  stockQuantity?: number;
  minOrderThreshold?: number;
}

// Transform API response to Accessory model
export const transformApiToAccessory = (data: any): Accessory => {
  return {
    id: data.id,
    name: data.name || "",
    sku: data.sku || "",
    slug: data.slug || data.name?.toLowerCase().replace(/\s+/g, "-"),
    price: Number(data.price) || 0,
    mrp: Number(data.mrp) || undefined,
    originalPrice: Number(data.original_price) || undefined,
    discount: Number(data.discount) || undefined,
    image: data.image || "",
    images: data.images || [],
    description: data.description || "",
    category: data.category || "",
    tag: data.tag || undefined,
    isActive: data.is_active ?? true,
    stockQuantity: data.stock_quantity || 0,
    minOrderThreshold: data.min_order_threshold || 5,
  };
};

// Transform Accessory model to API format
export const transformAccessoryToApi = (data: Partial<Accessory>): any => {
  return {
    name: data.name,
    sku: data.sku,
    slug: data.slug,
    price: data.price,
    mrp: data.mrp,
    original_price: data.originalPrice,
    discount: data.discount,
    image: data.image,
    images: data.images,
    description: data.description,
    category: data.category,
    tag: data.tag,
    is_active: data.isActive,
    stock_quantity: data.stockQuantity,
    min_order_threshold: data.minOrderThreshold,
  };
};
