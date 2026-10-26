import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ApiError, getBooking } from "@/lib/api";
import { getAgencyToken } from "@/lib/session";
import BookingView from "@/app/components/booking/BookingView";
export const metadata: Metadata = { title: "La tua pratica | Queen Tour", robots: { index: false, follow: false }, referrer: "no-referrer" };
export default async function Page({ params, searchParams }: PageProps<"/pratica/[code]">) {
  const [{ code }, query, token] = await Promise.all([params, searchParams, getAgencyToken()]);
  const access = typeof query.token === "string" ? query.token : undefined;
  try { const booking = await getBooking(code, token, access); return <BookingView key={`${code}:${access ?? "agency"}`} initialBooking={booking} accessToken={access} />; }
  catch (error) { if (error instanceof ApiError && error.status === 404) notFound(); throw error; }
}
