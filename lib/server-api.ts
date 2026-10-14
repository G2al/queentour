import "server-only";
import { ApiError, getAgencyProfile, getPackage, getPackageFilters, getPackages, type PackageQuery } from "@/lib/api";
import { getAgencyToken } from "@/lib/session";

export async function getServerPackages(params: PackageQuery = {}) {
  const token = await getAgencyToken();
  try { return await getPackages(params, token); }
  catch (error) { if (token && error instanceof ApiError && error.status === 401) return getPackages(params); throw error; }
}
export async function getServerPackageFilters() {
  const token = await getAgencyToken();
  try { return await getPackageFilters(token); }
  catch (error) { if (token && error instanceof ApiError && error.status === 401) return getPackageFilters(); throw error; }
}
export async function getServerPackage(slug: string) {
  const token = await getAgencyToken();
  try { return await getPackage(slug, token); }
  catch (error) { if (token && error instanceof ApiError && error.status === 401) return getPackage(slug); throw error; }
}
export async function getCurrentAgency() {
  return (await getAgencySession()).user;
}

export async function getAgencySession() {
  const token = await getAgencyToken();
  if (!token) return { user: null, invalid: false };
  try { return { user: await getAgencyProfile(token), invalid: false }; }
  catch (error) { return { user: null, invalid: error instanceof ApiError && error.status === 401 }; }
}
