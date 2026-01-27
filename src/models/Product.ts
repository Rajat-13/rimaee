// src/models/Product.ts

export interface ProductVariant {
  size: "8ml" | "50ml" | "100ml";
  mrp: number;
  discount: number;
  price: number;
}

export interface Concentration {
  sillage: number;
  projection: number;
  longevity: number;
}

export interface Notes {
  top: string[];
  middle: string[];
  base: string[];
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  type: "perfume" | "attar";
  category: string;
  gender: "male" | "female" | "unisex";
  isActive: boolean;
  price: number;
  images?: string[];
  variants: ProductVariant[];
  description?: string;
  notes?: Notes;
  concentration?: Concentration;
  occasion?: string;
  tag?: string;
  maxOrderThreshold?: number;
  stockID?: number;
}
