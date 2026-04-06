import { NextResponse } from "next/server";

/** Use GET /api/health to confirm the app (not only Vercel’s edge) is serving this deployment. */
export function GET() {
  return NextResponse.json({ ok: true, service: "ems-store" });
}
