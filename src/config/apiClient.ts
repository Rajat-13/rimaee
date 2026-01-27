import { API_BASE_URL } from "./urls";

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<APIResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;
  try {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    const response = await fetch(url, { ...options, headers });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      return { success: false, message: err.message || "Request failed" };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error: any) {
    return { success: false, message: error.message || "Network error" };
  }
}
