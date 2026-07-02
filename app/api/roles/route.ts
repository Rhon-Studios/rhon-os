import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

export async function GET() {
  const sql = neon(process.env.DATABASE_URL!);
  const roles = await sql`SELECT * FROM roles`;
  return NextResponse.json(roles);
}
