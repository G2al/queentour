import type { ValidationErrors } from "@/app/data/travelPackages";
export class RequestError extends Error {
  constructor(public status: number, message: string, public errors: ValidationErrors = {}) { super(message); }
}
export async function travelRequest<T>(path: string, options: RequestInit = {}, accessToken?: string) {
  const response = await fetch(`/api/travel/${path}`, { ...options, cache: "no-store", headers: { Accept: "application/json", ...(options.body ? { "Content-Type": "application/json" } : {}), ...(accessToken ? { "X-Booking-Token": accessToken } : {}), ...options.headers } });
  let result;
  try { result = await response.json(); } catch { throw new RequestError(response.status, "Risposta non valida. Riprova tra poco."); }
  if (!response.ok) {
    if (response.status === 401) window.dispatchEvent(new Event("agency-session-expired"));
    throw new RequestError(response.status, result.message || "Operazione non riuscita.", result.errors ?? {});
  }
  return result as T;
}
