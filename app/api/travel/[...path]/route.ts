import { NextRequest, NextResponse } from "next/server";
import { ApiError, apiRequest } from "@/lib/api";
import { apiErrorResponse } from "@/lib/route-utils";
import { clearAgencyToken, getAgencyToken } from "@/lib/session";

async function handle(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const { path } = await context.params;
  const route = path.join("/");
  const read = /^(settings|insurances|legal-pages(?:\/[a-zA-Z0-9_-]+)?|packages\/[a-zA-Z0-9_-]+|bookings(?:\/[a-zA-Z0-9_-]+)?)$/;
  const write = /^(cart\/quote|bookings(?:\/[a-zA-Z0-9_-]+\/(option|confirm|cancel))?)$/;
  if (!(request.method === "GET" ? read : write).test(route)) return NextResponse.json({ message: "Risorsa non disponibile." }, { status: 404 });
  const origin = request.headers.get("origin");
  const host = request.headers.get("x-forwarded-host")?.split(",")[0].trim() || request.headers.get("host");
  if (request.method === "POST" && origin && new URL(origin).host !== host) return NextResponse.json({ message: "Origine non valida." }, { status: 403 });
  try {
    const token = await getAgencyToken();
    const query = request.nextUrl.searchParams.toString();
    const bookingToken = request.headers.get("x-booking-token");
    const result = await apiRequest<unknown>(`/${route}${query ? `?${query}` : ""}`, {
      method: request.method, token, cache: "no-store",
      headers: bookingToken ? { "X-Booking-Token": bookingToken } : undefined,
      ...(request.method === "POST" ? { body: JSON.stringify(await request.json()) } : {}),
    });
    return NextResponse.json(result, { status: request.method === "POST" && route === "bookings" ? 201 : 200, headers: { "Cache-Control": "private, no-store" } });
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) await clearAgencyToken();
    return apiErrorResponse(error);
  }
}
export const GET = handle;
export const POST = handle;
