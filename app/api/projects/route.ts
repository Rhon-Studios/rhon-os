import { neon } from "@neondatabase/serverless";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const sql = neon(process.env.DATABASE_URL!);
  const employeeId = req.nextUrl.searchParams.get("employeeId");

  if (employeeId) {
    const projects = await sql`
      SELECT p.*
      FROM projects p
      JOIN project_employee pe ON pe.project_id = p.id
      WHERE pe.employee_id = ${employeeId}
    `;
    return NextResponse.json(projects);
  }

  const projects = await sql`SELECT * FROM projects`;
  return NextResponse.json(projects);
}
