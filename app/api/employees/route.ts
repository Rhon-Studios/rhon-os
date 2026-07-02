import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

export async function GET() {
  const sql = neon(process.env.DATABASE_URL!);
  const employees = await sql`
    SELECT
      e.id,
      e.name,
      e.email,
      e.active,
      r.id AS role_id,
      r.name AS role_name,
      r.is_admin
    FROM employee e
    LEFT JOIN roles r ON r.id = e.role_id
    ORDER BY e.name ASC
  `;
  return NextResponse.json(employees);
}

export async function POST(request: Request) {
  const sql = neon(process.env.DATABASE_URL!);
  const { name, email, role_id } = await request.json();
  console.log({ name, email, role_id });
  await sql`
    INSERT INTO employee (name, email, role_id)
    VALUES (${name}, ${email}, ${role_id})
  `;
  return NextResponse.json({ message: "Employee created successfully" });
}
