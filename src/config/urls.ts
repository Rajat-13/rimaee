export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

export const API_ENDPOINTS = {
  products: {
    list: () => `/products/products/`,
    get: (slug: string) => `/products/products/${slug}/`,
    create: () => `/products/products/`,
    update: (slug: string) => `/products/products/${slug}/`,
    delete: (slug: string) => `/products/products/${slug}/`,
  },
  fragrances: {
    list: () => `/products/products/`,
    get: (id: number | string) => `/products/products/${id}/`,
    create: () => `/products/products/`,
    update: (id: number | string) => `/products/products/${id}/`,
    delete: (id: number | string) => `/products/products/${id}/`,
  },
  accessories: {
    list: () => `/accessories/accessories/`,
    get: (id: number | string) => `/accessories/accessories/${id}/`,
    create: () => `/accessories/accessories/`,
    update: (id: number | string) => `/accessories/accessories/${id}/`,
    delete: (id: number | string) => `/accessories/accessories/${id}/`,
  },
};
