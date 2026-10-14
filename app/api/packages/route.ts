import { NextRequest, NextResponse } from "next/server";
import { ApiError, getPackages, type PackageQuery } from "@/lib/api";
import { apiErrorResponse } from "@/lib/route-utils";
import { clearAgencyToken, getAgencyToken } from "@/lib/session";

export async function GET(request: NextRequest) {
  const params = Object.fromEntries(request.nextUrl.searchParams.entries()) as PackageQuery;
  const token = await getAgencyToken();
  try {
    return NextResponse.json(await getPackages(params, token));
  } catch (error) {
    if (token && error instanceof ApiError && error.status === 401) {
      await clearAgencyToken();
      try { return NextResponse.json(await getPackages(params)); } catch (retryError) { return apiErrorResponse(retryError); }
    }
    return apiErrorResponse(error);
  }
}
