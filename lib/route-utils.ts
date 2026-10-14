import "server-only";
import { NextResponse } from "next/server";
import { ApiError } from "@/lib/api";

export function apiErrorResponse(error: unknown) {
  if (error instanceof ApiError) return NextResponse.json(error.payload, { status: error.status });
  console.error(error);
  return NextResponse.json(
    { message: "Il servizio non è momentaneamente raggiungibile. Riprova tra poco." },
    { status: 503 },
  );
}
