import "server-only";
import { cookies } from "next/headers";

export const AGENCY_TOKEN_COOKIE = "queentour_agency_token";

export async function getAgencyToken() {
  return (await cookies()).get(AGENCY_TOKEN_COOKIE)?.value ?? null;
}
export async function setAgencyToken(token: string) {
  (await cookies()).set(AGENCY_TOKEN_COOKIE, token, {
    httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production",
    path: "/", maxAge: 60 * 60 * 24 * 30, priority: "high",
  });
}
export async function clearAgencyToken() { (await cookies()).delete(AGENCY_TOKEN_COOKIE); }
