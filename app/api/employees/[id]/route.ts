import { neon } from "@neondatabase/serverless";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const body = await request.json();
  const { id } = await params;
  const client = neon(process.env.DATABASE_URL!);

  const {
    name,
    email,
    active,
    role_id,
    projectIds,
    country,
    timezone,
    gender,
  } = body;

  await client`
    UPDATE employee
    SET
      name = ${name},
      email = ${email},
      active = ${active},
      role_id = ${role_id},
      country = ${country},
      timezone = ${timezone},
      gender = ${gender || null}
    WHERE id = ${id}
  `;

  await client`
    DELETE FROM project_employee
    WHERE employee_id = ${id}
  `;

  for (const projectId of projectIds) {
    await client`
      INSERT INTO project_employee (project_id, employee_id)
      VALUES (${projectId}, ${id})
    `;
  }

  return NextResponse.json({ success: true });
}
