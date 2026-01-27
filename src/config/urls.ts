export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

export const API_ENDPOINTS = {
  products: {
    list: () => `/products/`,
    get: (id: number) => `/products/${id}/`,
    create: () => `/products/`,
    update: (id: number) => `/products/${id}/`,
    delete: (id: number) => `/products/${id}/`,
  },
};
