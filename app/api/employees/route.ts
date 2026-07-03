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
      r.is_admin,
      COALESCE(
        ARRAY_AGG(DISTINCT p.id ORDER BY p.id)
        FILTER (WHERE p.id IS NOT NULL),
        '{}'
      ) AS project_ids,
      COALESCE(
        ARRAY_AGG(DISTINCT p.name ORDER BY p.name)
        FILTER (WHERE p.id IS NOT NULL),
        '{}'
      ) AS projects
    FROM employee e
    LEFT JOIN roles r ON r.id = e.role_id
    LEFT JOIN project_employee pe ON pe.employee_id = e.id
    LEFT JOIN projects p ON p.id = pe.project_id
    GROUP BY
      e.id,
      e.name,
      e.email,
      e.active,
      r.id,
      r.name,
      r.is_admin
    ORDER BY
      r.is_admin DESC,
      e.name ASC
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
