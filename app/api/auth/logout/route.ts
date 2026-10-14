import { NextResponse } from "next/server";
import { logoutAgency } from "@/lib/api";
import { clearAgencyToken, getAgencyToken } from "@/lib/session";

export async function POST() {
  const token = await getAgencyToken();
  try { if (token) await logoutAgency(token); }
  catch { /* Il cookie locale va eliminato anche se il token è già scaduto. */ }
  await clearAgencyToken();
  return new NextResponse(null, { status: 204 });
}
