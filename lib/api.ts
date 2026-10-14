import type { AgencyUser, AuthResponse, PackageFilters, PaginatedPackages, TravelPackage, ValidationErrors } from "@/app/data/travelPackages";

export type PackageQuery = {
  search?: string; destination?: string; type?: string; days?: number | string;
  min_days?: number | string; max_days?: number | string; departure?: string;
  board?: string; min_price?: number | string; max_price?: number | string;
  date?: string; featured?: boolean | 0 | 1;
  sort?: "recommended" | "price_asc" | "price_desc" | "duration" | "newest";
  per_page?: number; page?: number;
};

export type ApiErrorPayload = { message?: string; errors?: ValidationErrors; [key: string]: unknown };

export class ApiError extends Error {
  status: number;
  payload: ApiErrorPayload;
  constructor(status: number, payload: ApiErrorPayload) {
    super(payload.message || `Errore API (${status})`);
    this.name = "ApiError";
    this.status = status;
    this.payload = payload;
  }
}

type ApiRequestOptions = Omit<RequestInit, "headers"> & { token?: string | null; headers?: HeadersInit };

function apiBaseUrl() {
  const value = process.env.API_URL;
  if (!value) throw new Error("API_URL non configurata. Aggiungila alle variabili d'ambiente del frontend.");
  return value.replace(/\/$/, "");
}

function queryString(params: PackageQuery) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    query.set(key, typeof value === "boolean" ? (value ? "1" : "0") : String(value));
  });
  return query.size ? `?${query.toString()}` : "";
}

async function apiRequest<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const { token, headers, ...requestOptions } = options;
  const response = await fetch(`${apiBaseUrl()}${path}`, {
    ...requestOptions,
    headers: {
      Accept: "application/json",
      ...(requestOptions.body ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    ...(token ? { cache: "no-store" } : requestOptions.cache ? {} : { next: { revalidate: 60 } }),
  });
  if (response.status === 204) return undefined as T;
  let payload: unknown;
  try { payload = await response.json(); } catch { payload = { message: "Il server ha restituito una risposta non valida." }; }
  if (!response.ok) throw new ApiError(response.status, payload as ApiErrorPayload);
  return payload as T;
}

export function getPackages(params: PackageQuery = {}, token?: string | null) {
  return apiRequest<PaginatedPackages>(`/packages${queryString(params)}`, { token });
}
export async function getPackageFilters(token?: string | null) {
  return (await apiRequest<{ data: PackageFilters }>("/packages/filters", { token })).data;
}
export async function getPackage(slug: string, token?: string | null) {
  return (await apiRequest<{ data: TravelPackage }>(`/packages/${encodeURIComponent(slug)}`, { token })).data;
}
export function loginAgency(payload: { email: string; password: string }) {
  return apiRequest<AuthResponse>("/auth/login", { method: "POST", body: JSON.stringify(payload), cache: "no-store" });
}
export function registerAgency(payload: Record<string, unknown>) {
  return apiRequest<AuthResponse>("/auth/register", { method: "POST", body: JSON.stringify(payload), cache: "no-store" });
}
export async function getAgencyProfile(token: string) {
  return (await apiRequest<{ data: AgencyUser }>("/auth/me", { token, cache: "no-store" })).data;
}
export async function updateAgencyProfile(payload: Record<string, unknown>, token: string) {
  return (await apiRequest<{ data: AgencyUser }>("/auth/me", { method: "PUT", body: JSON.stringify(payload), token, cache: "no-store" })).data;
}
export function logoutAgency(token: string) {
  return apiRequest<void>("/auth/logout", { method: "POST", token, cache: "no-store" });
}
