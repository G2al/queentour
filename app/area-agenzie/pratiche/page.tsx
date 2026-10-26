import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAgencyToken } from "@/lib/session";
import { ApiError, getBookings } from "@/lib/api";
import { getCurrentAgency } from "@/lib/server-api";
import AgencyBookings from "./AgencyBookings";
export const metadata: Metadata = { title: "Le mie pratiche | Queen Tour", robots: { index: false, follow: false } };
export default async function Page() {
  if (!(await getCurrentAgency())) redirect("/area-agenzie/accedi");
  const token = await getAgencyToken();
  try { const initial = await getBookings({}, token); return <AgencyBookings initial={initial} />; }
  catch (error) { if (error instanceof ApiError && error.status === 401) redirect("/area-agenzie/accedi"); throw error; }
}
