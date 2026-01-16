/**
 * RIMAE API Client
 * Connect to Django Backend
 */

// Change this to your Django server URL
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

// Token management
let accessToken: string | null = localStorage.getItem('access_token');
let refreshToken: string | null = localStorage.getItem('refresh_token');

export const setTokens = (access: string, refresh: string) => {
  accessToken = access;
  refreshToken = refresh;
  localStorage.setItem('access_token', access);
  localStorage.setItem('refresh_token', refresh);
};

export const clearTokens = () => {
  accessToken = null;
  refreshToken = null;
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
};

export const getAccessToken = () => accessToken;

// API request helper
async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (accessToken) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${accessToken}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  // Handle token refresh
  if (response.status === 401 && refreshToken) {
    const refreshResponse = await fetch(`${API_BASE_URL}/auth/token/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (refreshResponse.ok) {
      const { access } = await refreshResponse.json();
      accessToken = access;
      localStorage.setItem('access_token', access);
      
      // Retry original request
      (headers as Record<string, string>)['Authorization'] = `Bearer ${access}`;
      const retryResponse = await fetch(url, { ...options, headers });
      return retryResponse.json();
    } else {
      clearTokens();
      window.location.href = '/';
    }
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || error.error || 'Request failed');
  }

  return response.json();
}

// ============================================
// AUTH API
// ============================================
export const authAPI = {
  sendOTP: (phone: string) => 
    request<{ message: string; otp?: string }>('/auth/send-otp/', {
      method: 'POST',
      body: JSON.stringify({ phone }),
    }),

  verifyOTP: (phone: string, otp: string) =>
    request<{ verified: boolean }>('/auth/verify-otp/', {
      method: 'POST',
      body: JSON.stringify({ phone, otp }),
    }),

  login: (phone: string, otp: string) =>
    request<{ user: User; tokens: Tokens; is_new_user: boolean }>('/auth/login/', {
      method: 'POST',
      body: JSON.stringify({ phone, otp }),
    }),

  register: (data: RegisterData) =>
    request<{ user: User; tokens: Tokens }>('/auth/register/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  logout: () => {
    const refresh = refreshToken;
    clearTokens();
    return request('/auth/logout/', {
      method: 'POST',
      body: JSON.stringify({ refresh }),
    });
  },

  getProfile: () => request<User>('/auth/profile/'),
  
  updateProfile: (data: Partial<User>) =>
    request<User>('/auth/profile/', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};

// ============================================
// PRODUCTS API
// ============================================
export const productsAPI = {
  list: (params?: ProductListParams) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', String(params.page));
    if (params?.type) searchParams.set('type', params.type);
    if (params?.gender) searchParams.set('gender', params.gender);
    if (params?.search) searchParams.set('search', params.search);
    if (params?.ordering) searchParams.set('ordering', params.ordering);
    
    return request<PaginatedResponse<Product>>(`/products/?${searchParams}`);
  },

  get: (id: number) => request<Product>(`/products/${id}/`),

  bestsellers: (type?: 'perfume' | 'attar') => {
    const params = type ? `?type=${type}` : '';
    return request<Product[]>(`/products/bestsellers/${params}`);
  },

  search: (query: string) =>
    request<Product[]>(`/products/search/?q=${encodeURIComponent(query)}`),
};

// ============================================
// CART API
// ============================================
export const cartAPI = {
  get: () => request<Cart>('/cart/'),
  
  add: (productId: number, quantity: number = 1, size?: string) =>
    request<Cart>('/cart/add/', {
      method: 'POST',
      body: JSON.stringify({ product_id: productId, quantity, size }),
    }),

  update: (itemId: number, quantity: number) =>
    request<Cart>(`/cart/update/${itemId}/`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    }),

  remove: (itemId: number) =>
    request<Cart>(`/cart/remove/${itemId}/`, { method: 'DELETE' }),

  clear: () => request('/cart/clear/', { method: 'DELETE' }),
};

// ============================================
// WISHLIST API
// ============================================
export const wishlistAPI = {
  get: () => request<WishlistItem[]>('/wishlist/'),
  
  add: (productId: number) =>
    request<WishlistItem>('/wishlist/add/', {
      method: 'POST',
      body: JSON.stringify({ product_id: productId }),
    }),

  remove: (productId: number) =>
    request(`/wishlist/remove/${productId}/`, { method: 'DELETE' }),
};

// ============================================
// ADDRESSES API
// ============================================
export const addressesAPI = {
  list: () => request<Address[]>('/addresses/'),
  
  create: (data: AddressInput) =>
    request<Address>('/addresses/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: number, data: Partial<AddressInput>) =>
    request<Address>(`/addresses/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: number) =>
    request(`/addresses/${id}/`, { method: 'DELETE' }),

  setDefault: (id: number) =>
    request<Address>(`/addresses/${id}/default/`, { method: 'PUT' }),
};

// ============================================
// ORDERS API
// ============================================
export const ordersAPI = {
  list: (page?: number) => {
    const params = page ? `?page=${page}` : '';
    return request<PaginatedResponse<Order>>(`/orders/${params}`);
  },

  get: (id: number) => request<Order>(`/orders/${id}/`),

  create: (addressId: number, paymentMethod: string, notes?: string) =>
    request<Order>('/orders/', {
      method: 'POST',
      body: JSON.stringify({ address_id: addressId, payment_method: paymentMethod, notes }),
    }),
};

// ============================================
// REVIEWS API
// ============================================
export const reviewsAPI = {
  getForProduct: (productId: number) =>
    request<Review[]>(`/products/${productId}/reviews/`),

  create: (productId: number, data: ReviewInput) =>
    request<Review>(`/products/${productId}/reviews/`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// ============================================
// ADMIN APIs
// ============================================
export const adminAPI = {
  // Fragrances
  fragrances: {
    list: (params?: FragranceListParams) => {
      const searchParams = new URLSearchParams();
      if (params?.page) searchParams.set('page', String(params.page));
      if (params?.type) searchParams.set('type', params.type);
      if (params?.status) searchParams.set('status', params.status);
      if (params?.search) searchParams.set('search', params.search);
      
      return request<PaginatedResponse<Fragrance>>(`/fragrances/?${searchParams}`);
    },
    get: (id: number) => request<Fragrance>(`/fragrances/${id}/`),
    create: (data: FragranceInput) =>
      request<Fragrance>('/fragrances/', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (id: number, data: Partial<FragranceInput>) =>
      request<Fragrance>(`/fragrances/${id}/`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    delete: (id: number) =>
      request(`/fragrances/${id}/`, { method: 'DELETE' }),
  },

  // Ingredients
  ingredients: {
    list: () => request<Ingredient[]>('/ingredients/'),
    create: (data: IngredientInput) =>
      request<Ingredient>('/ingredients/', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (id: number, data: Partial<IngredientInput>) =>
      request<Ingredient>(`/ingredients/${id}/`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    delete: (id: number) =>
      request(`/ingredients/${id}/`, { method: 'DELETE' }),
  },

  // Orders
  orders: {
    list: (page?: number) => {
      const params = page ? `?page=${page}` : '';
      return request<PaginatedResponse<Order>>(`/orders/admin/${params}`);
    },
    updateStatus: (id: number, status: string) =>
      request<Order>(`/orders/${id}/status/`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      }),
  },

  // Customers
  customers: {
    list: (params?: CustomerListParams) => {
      const searchParams = new URLSearchParams();
      if (params?.page) searchParams.set('page', String(params.page));
      if (params?.search) searchParams.set('search', params.search);
      
      return request<PaginatedResponse<User>>(`/customers/?${searchParams}`);
    },
    get: (id: number) => request<User>(`/customers/${id}/`),
    getOrders: (id: number) => request<Order[]>(`/customers/${id}/orders/`),
  },

  // Analytics
  analytics: {
    dashboard: () => request<DashboardStats>('/analytics/dashboard/'),
    sales: () => request<SalesAnalytics>('/analytics/sales/'),
    products: () => request<ProductAnalytics>('/analytics/products/'),
    customers: () => request<CustomerAnalytics>('/analytics/customers/'),
  },

  // Payments
  payments: {
    list: (page?: number) => {
      const params = page ? `?page=${page}` : '';
      return request<PaginatedResponse<Payment>>(`/payments/${params}`);
    },
  },

  // Settings
  settings: {
    get: () => request<BrandSettings>('/settings/'),
    update: (data: Partial<BrandSettings>) =>
      request<BrandSettings>('/settings/brand/', {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
  },

  // Notifications
  notifications: {
    broadcast: (data: BroadcastInput) =>
      request('/notifications/broadcast/', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  },
};

// ============================================
// TYPE DEFINITIONS
// ============================================
export interface User {
  id: number;
  phone: string;
  email?: string;
  username?: string;
  full_name?: string;
  avatar?: string;
  role: 'customer' | 'admin' | 'manager';
  is_phone_verified: boolean;
  is_email_verified: boolean;
  notifications_enabled: boolean;
  created_at: string;
}

export interface Tokens {
  access: string;
  refresh: string;
}

export interface RegisterData {
  phone: string;
  email?: string;
  username?: string;
  full_name?: string;
  notifications_enabled?: boolean;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  type: 'perfume' | 'attar';
  sku: string;
  price: number;
  discount: number;
  final_price: number;
  gender: 'men' | 'women' | 'unisex';
  concentration?: string;
  stock_quantity: number;
  is_bestseller: boolean;
  rating: number;
  review_count: number;
  images: ProductImage[];
  top_notes?: string[];
  middle_notes?: string[];
  base_notes?: string[];
}

export interface ProductImage {
  id: number;
  image: string;
  is_cover: boolean;
}

export interface ProductListParams {
  page?: number;
  type?: string;
  gender?: string;
  search?: string;
  ordering?: string;
}

export interface Cart {
  id: number;
  items: CartItem[];
  total_items: number;
  subtotal: number;
}

export interface CartItem {
  id: number;
  product: Product;
  quantity: number;
  size?: string;
  unit_price: number;
  total_price: number;
}

export interface WishlistItem {
  id: number;
  product: Product;
  created_at: string;
}

export interface Address {
  id: number;
  label?: string;
  type: 'home' | 'office' | 'other';
  full_name: string;
  phone: string;
  address_line1: string;
  address_line2?: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  is_default: boolean;
  full_address: string;
}

export interface AddressInput {
  label?: string;
  type?: 'home' | 'office' | 'other';
  full_name: string;
  phone: string;
  address_line1: string;
  address_line2?: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  is_default?: boolean;
}

export interface Order {
  id: number;
  order_number: string;
  status: string;
  payment_status: string;
  total_amount: number;
  items: OrderItem[];
  shipping_address: string;
  created_at: string;
}

export interface OrderItem {
  id: number;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface Review {
  id: number;
  user_name: string;
  rating: number;
  title?: string;
  comment: string;
  is_verified_purchase: boolean;
  created_at: string;
}

export interface ReviewInput {
  rating: number;
  title?: string;
  comment: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface Fragrance {
  id: number;
  name: string;
  sku: string;
  type: 'perfume' | 'attar';
  concentration?: string;
  price: number;
  discount: number;
  stock_quantity: number;
  min_order_threshold: number;
  watching_count: number;
  status: 'draft' | 'active' | 'discontinued';
  is_active: boolean;
  images: ProductImage[];
}

export interface FragranceInput {
  name: string;
  sku: string;
  type: 'perfume' | 'attar';
  concentration?: string;
  description?: string;
  price: number;
  discount?: number;
  stock_quantity?: number;
  min_order_threshold?: number;
  status?: string;
}

export interface FragranceListParams {
  page?: number;
  type?: string;
  status?: string;
  search?: string;
}

export interface Ingredient {
  id: number;
  name: string;
  category: 'top' | 'middle' | 'base';
  description?: string;
  origin?: string;
  cost_per_unit: number;
  stock_quantity: number;
  unit: string;
  is_active: boolean;
}

export interface IngredientInput {
  name: string;
  category: 'top' | 'middle' | 'base';
  description?: string;
  origin?: string;
  cost_per_unit?: number;
  stock_quantity?: number;
  unit?: string;
}

export interface CustomerListParams {
  page?: number;
  search?: string;
}

export interface DashboardStats {
  orders: { total: number; pending: number };
  revenue: { total: number; monthly: number };
  customers: { total: number; new: number };
  products: { total: number; low_stock: number };
}

export interface SalesAnalytics {
  monthly_sales: { month: string; total: number; count: number }[];
}

export interface ProductAnalytics {
  top_products: { product__name: string; total_sold: number; total_revenue: number }[];
  category_distribution: { category__name: string; count: number }[];
}

export interface CustomerAnalytics {
  total_customers: number;
  customers_with_orders: number;
  repeat_customers: number;
  conversion_rate: number;
  retention_rate: number;
}

export interface Payment {
  id: number;
  transaction_id: string;
  order_number: string;
  customer_name: string;
  amount: number;
  method: string;
  status: string;
  created_at: string;
}

export interface BrandSettings {
  brand_name: string;
  tagline: string;
  currency: string;
  currency_symbol: string;
  support_email: string;
  support_phone?: string;
  free_shipping_threshold: number;
  default_shipping_cost: number;
  gst_percentage: number;
}

export interface BroadcastInput {
  title: string;
  message: string;
  type?: 'promo' | 'system';
}
