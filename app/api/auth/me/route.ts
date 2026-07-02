import { verifySessionToken } from "@/app/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("session")?.value;
  if (!token) return NextResponse.json({ user: null });

  const session = await verifySessionToken(token);
  return NextResponse.json({ user: session });
}
