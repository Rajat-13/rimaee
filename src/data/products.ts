export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  image: string;
  images: string[];
  tag?: string;
  gender: "for-him" | "for-her" | "unisex";
  category: string;
  type?: "perfume" | "attar";
  sku?: string;
  minOrderThreshold?: number;
  stockQuantity?: number;
  watchingCount?: number;
  isActive?: boolean;
  notes: {
    top: string[];
    middle: string[];
    base: string[];
  };
  description: string;
  occasion: string;
  concentration: {
    sillage: number;
    projection: number;
    longevity: number;
  };
}

export const allProducts: Product[] = [
  {
    id: "1",
    name: "Sandal Veer",
    slug: "sandal-veer",
    price: 1129,
    originalPrice: 1499,
    image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&auto=format&fit=crop&q=80",
    ],
    tag: "Bestseller",
    gender: "for-him",
    category: "woody",
    notes: {
      top: ["Grapefruit", "Cardamom", "Pepper"],
      middle: ["Orris", "Sandalwood", "Cinnamon"],
      base: ["Musk", "Dry Amber", "Akigalawood"],
    },
    description: "A bold and sophisticated fragrance that captures the essence of timeless elegance.",
    occasion: "All Day",
    concentration: { sillage: 85, projection: 75, longevity: 90 },
  },
  {
    id: "2",
    name: "Flora Bliss",
    slug: "flora-bliss",
    price: 899,
    image: "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=800&auto=format&fit=crop&q=80",
    ],
    gender: "for-her",
    category: "floral",
    notes: {
      top: ["Rose", "Jasmine", "Bergamot"],
      middle: ["Peony", "Lily", "Violet"],
      base: ["White Musk", "Cedarwood", "Vanilla"],
    },
    description: "A delicate floral symphony that evokes blooming gardens at dawn.",
    occasion: "Evening",
    concentration: { sillage: 70, projection: 80, longevity: 85 },
  },
  {
    id: "3",
    name: "Purple Mystique",
    slug: "purple-mystique",
    price: 499,
    originalPrice: 799,
    image: "https://images.unsplash.com/photo-1594035900144-17fc72a68908?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1594035900144-17fc72a68908?w=600&auto=format&fit=crop&q=80",
    ],
    tag: "Bestseller",
    gender: "unisex",
    category: "oriental",
    notes: {
      top: ["Lavender", "Bergamot", "Pink Pepper"],
      middle: ["Iris", "Violet", "Geranium"],
      base: ["Amber", "Sandalwood", "Musk"],
    },
    description: "A mysterious and enchanting fragrance with deep purple notes.",
    occasion: "Night Out",
    concentration: { sillage: 80, projection: 85, longevity: 88 },
  },
  {
    id: "4",
    name: "Ocean Breeze",
    slug: "ocean-breeze",
    price: 599,
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&auto=format&fit=crop&q=80",
    ],
    gender: "for-him",
    category: "fresh",
    notes: {
      top: ["Sea Salt", "Bergamot", "Lemon"],
      middle: ["Marine Accord", "Jasmine", "Rosemary"],
      base: ["Driftwood", "Musk", "Ambergris"],
    },
    description: "Refreshing aquatic fragrance inspired by ocean waves.",
    occasion: "Daily Wear",
    concentration: { sillage: 65, projection: 70, longevity: 75 },
  },
  {
    id: "5",
    name: "Midnight Rose",
    slug: "midnight-rose",
    price: 549,
    originalPrice: 899,
    image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&auto=format&fit=crop&q=80",
    ],
    tag: "Sale",
    gender: "for-her",
    category: "floral",
    notes: {
      top: ["Rose", "Raspberry", "Black Currant"],
      middle: ["Peony", "Jasmine", "Lily"],
      base: ["Musk", "Cedar", "Amber"],
    },
    description: "A romantic floral bouquet perfect for evening occasions.",
    occasion: "Date Night",
    concentration: { sillage: 75, projection: 80, longevity: 82 },
  },
  {
    id: "6",
    name: "Fresh Citrus",
    slug: "fresh-citrus",
    price: 449,
    image: "https://images.unsplash.com/photo-1595535873420-a599195b3f4a?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1595535873420-a599195b3f4a?w=600&auto=format&fit=crop&q=80",
    ],
    gender: "unisex",
    category: "citrus",
    notes: {
      top: ["Lemon", "Orange", "Grapefruit"],
      middle: ["Neroli", "Petitgrain", "Green Tea"],
      base: ["White Musk", "Cedar", "Vetiver"],
    },
    description: "An energizing citrus burst for a fresh start.",
    occasion: "Morning",
    concentration: { sillage: 60, projection: 65, longevity: 70 },
  },
  {
    id: "7",
    name: "Woody Essence",
    slug: "woody-essence",
    price: 699,
    image: "https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=600&auto=format&fit=crop&q=80",
    ],
    gender: "for-him",
    category: "woody",
    notes: {
      top: ["Bergamot", "Cardamom", "Pink Pepper"],
      middle: ["Cedar", "Vetiver", "Oud"],
      base: ["Sandalwood", "Amber", "Leather"],
    },
    description: "A rich woody composition for the confident man.",
    occasion: "Office",
    concentration: { sillage: 85, projection: 80, longevity: 90 },
  },
  {
    id: "8",
    name: "Floral Dreams",
    slug: "floral-dreams",
    price: 549,
    image: "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=600&auto=format&fit=crop&q=80",
    ],
    gender: "for-her",
    category: "floral",
    notes: {
      top: ["Peach", "Pear", "Bergamot"],
      middle: ["Rose", "Peony", "Magnolia"],
      base: ["Musk", "Sandalwood", "Vanilla"],
    },
    description: "A dreamy floral fantasy for the romantic soul.",
    occasion: "Casual",
    concentration: { sillage: 70, projection: 75, longevity: 80 },
  },
  {
    id: "9",
    name: "Spicy Oud",
    slug: "spicy-oud",
    price: 899,
    originalPrice: 1199,
    image: "https://images.unsplash.com/photo-1590736969955-71cc94901144?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1590736969955-71cc94901144?w=600&auto=format&fit=crop&q=80",
    ],
    tag: "Premium",
    gender: "unisex",
    category: "oriental",
    notes: {
      top: ["Saffron", "Cinnamon", "Cardamom"],
      middle: ["Oud", "Rose", "Incense"],
      base: ["Amber", "Sandalwood", "Musk"],
    },
    description: "An exotic oriental journey with precious oud.",
    occasion: "Special Events",
    concentration: { sillage: 90, projection: 85, longevity: 95 },
  },
  {
    id: "10",
    name: "Summer Vibes",
    slug: "summer-vibes",
    price: 399,
    image: "https://images.unsplash.com/photo-1547887538-e3a2f32cb1cc?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1547887538-e3a2f32cb1cc?w=600&auto=format&fit=crop&q=80",
    ],
    gender: "unisex",
    category: "fresh",
    notes: {
      top: ["Coconut", "Pineapple", "Lime"],
      middle: ["Jasmine", "Frangipani", "Sea Breeze"],
      base: ["Vanilla", "Musk", "Driftwood"],
    },
    description: "A tropical escape in a bottle.",
    occasion: "Beach & Vacation",
    concentration: { sillage: 65, projection: 60, longevity: 70 },
  },
  {
    id: "11",
    name: "Vanilla Silk",
    slug: "vanilla-silk",
    price: 649,
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&auto=format&fit=crop&q=80",
    ],
    gender: "for-her",
    category: "gourmand",
    notes: {
      top: ["Bergamot", "Pink Pepper", "Pear"],
      middle: ["Vanilla Orchid", "Jasmine", "Heliotrope"],
      base: ["Vanilla", "Benzoin", "White Musk"],
    },
    description: "A silky smooth vanilla indulgence.",
    occasion: "Evening",
    concentration: { sillage: 75, projection: 80, longevity: 85 },
  },
  {
    id: "12",
    name: "Leather & Smoke",
    slug: "leather-smoke",
    price: 799,
    image: "https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=600&auto=format&fit=crop&q=80",
    ],
    gender: "for-him",
    category: "leather",
    notes: {
      top: ["Whiskey", "Black Pepper", "Cardamom"],
      middle: ["Leather", "Tobacco", "Oud"],
      base: ["Smoky Accord", "Vetiver", "Amber"],
    },
    description: "Bold and daring leather fragrance for the fearless.",
    occasion: "Night Out",
    concentration: { sillage: 85, projection: 90, longevity: 92 },
  },
];

export const categories = [
  { id: "floral", name: "Floral", description: "Romantic flower bouquets" },
  { id: "woody", name: "Woody", description: "Earthy and warm woods" },
  { id: "fresh", name: "Fresh", description: "Clean and crisp scents" },
  { id: "oriental", name: "Oriental", description: "Exotic and spicy notes" },
  { id: "citrus", name: "Citrus", description: "Zesty and energizing" },
  { id: "gourmand", name: "Gourmand", description: "Sweet and edible notes" },
  { id: "leather", name: "Leather", description: "Rich and masculine" },
];

export const genderOptions = [
  { id: "for-him", name: "For Him" },
  { id: "for-her", name: "For Her" },
  { id: "unisex", name: "Unisex" },
];
