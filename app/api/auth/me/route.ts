import { NextRequest, NextResponse } from "next/server";
import { ApiError, getAgencyProfile, updateAgencyProfile } from "@/lib/api";
import { apiErrorResponse } from "@/lib/route-utils";
import { clearAgencyToken, getAgencyToken } from "@/lib/session";

async function requireToken() {
  const token = await getAgencyToken();
  if (!token) return null;
  return token;
}

export async function GET() {
  const token = await requireToken();
  if (!token) return NextResponse.json({ message: "Non autenticato." }, { status: 401 });
  try { return NextResponse.json({ data: await getAgencyProfile(token) }); }
  catch (error) {
    if (error instanceof ApiError && error.status === 401) await clearAgencyToken();
    return apiErrorResponse(error);
  }
}

export async function PUT(request: NextRequest) {
  const token = await requireToken();
  if (!token) return NextResponse.json({ message: "Non autenticato." }, { status: 401 });
  try { return NextResponse.json({ data: await updateAgencyProfile(await request.json(), token) }); }
  catch (error) {
    if (error instanceof ApiError && error.status === 401) await clearAgencyToken();
    return apiErrorResponse(error);
  }
}
