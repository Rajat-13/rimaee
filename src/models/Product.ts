// src/models/Product.ts

export interface ProductVariant {
  size: "8ml" | "50ml" | "100ml";
  mrp: number;
  discount: number;
  price: number;
}

export const genderOptions = [
  { id: "male", name: "Male" },
  { id: "female", name: "Female" },
  { id: "unisex", name: "Unisex" },
];

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

export interface ProductImage {
  image?: string;
  images?: string[];
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  slug: string;

  type: "perfume" | "attar";
  category?: string;
  gender: "male" | "female" | "unisex";

  isActive: boolean;

  variants: ProductVariant[];
  product_images?: ProductImage[];

  description?: string;
  notes?: Notes;

  sillage?: number;
  projection?: number;
  longevity?: number;

  occasion?: string;
  tag?: string;

  maxOrderThreshold?: number;
  stockID?: number;
}
