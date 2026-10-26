import "server-only";
import { NextResponse } from "next/server";
import { ApiError } from "@/lib/api";

export function apiErrorResponse(error: unknown) {
  if (error instanceof ApiError && error.status === 429) return NextResponse.json({ message: `Hai effettuato diverse richieste ravvicinate. Riprova tra ${error.retryAfter || "60"} secondi.` }, { status: 429, headers: { "Retry-After": error.retryAfter || "60" } });
  if (error instanceof ApiError && error.status >= 500) return NextResponse.json({ message: "Il servizio di prenotazione non è momentaneamente disponibile. Riprova tra poco o contatta Queen Tour." }, { status: error.status });
  if (error instanceof ApiError) return NextResponse.json(error.payload, { status: error.status });
  console.error(error);
  return NextResponse.json(
    { message: "Il servizio non è momentaneamente raggiungibile. Riprova tra poco." },
    { status: 503 },
  );
}
