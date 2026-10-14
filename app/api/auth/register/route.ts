import { NextRequest, NextResponse } from "next/server";
import { registerAgency } from "@/lib/api";
import { apiErrorResponse } from "@/lib/route-utils";
import { setAgencyToken } from "@/lib/session";

export async function POST(request: NextRequest) {
  try {
    const result = await registerAgency(await request.json());
    await setAgencyToken(result.token);
    return NextResponse.json({ user: result.user }, { status: 201 });
  } catch (error) { return apiErrorResponse(error); }
}
