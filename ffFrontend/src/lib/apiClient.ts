import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { API_BASE_URL } from "@/config/api";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("admin_token");
  if (token) {
    config.headers.set?.("Authorization", `Bearer ${token}`);
  }
  return config;
});

apiClient.interceptors.response.use(
  (res) => res,
  (error: AxiosError) => {
    const status = error.response?.status;
    if (status === 401 && window.location.pathname.startsWith("/admin")) {
      localStorage.removeItem("admin_token");
      if (window.location.pathname !== "/admin/login") {
        window.location.href = "/admin/login";
      }
    } else if (status && status >= 500) {
      toast.error("Something went wrong. Please try again.");
    }
    return Promise.reject(error);
  }
);

export async function apiGet<T>(url: string, params?: Record<string, unknown>): Promise<T> {
  const { data } = await apiClient.get<T>(url, { params });
  return data;
}

export async function apiPost<T, B = unknown>(url: string, body?: B): Promise<T> {
  const { data } = await apiClient.post<T>(url, body);
  return data;
}

export async function apiPut<T, B = unknown>(url: string, body?: B): Promise<T> {
  const { data } = await apiClient.put<T>(url, body);
  return data;
}

export async function apiPatch<T, B = unknown>(url: string, body?: B): Promise<T> {
  const { data } = await apiClient.patch<T>(url, body);
  return data;
}

export async function apiDelete<T>(url: string): Promise<T> {
  const { data } = await apiClient.delete<T>(url);
  return data;
}