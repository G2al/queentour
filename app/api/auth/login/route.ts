import { NextRequest, NextResponse } from "next/server";
import { loginAgency } from "@/lib/api";
import { apiErrorResponse } from "@/lib/route-utils";
import { setAgencyToken } from "@/lib/session";

export async function POST(request: NextRequest) {
  try {
    const result = await loginAgency(await request.json());
    await setAgencyToken(result.token);
    return NextResponse.json({ user: result.user });
  } catch (error) { return apiErrorResponse(error); }
}
