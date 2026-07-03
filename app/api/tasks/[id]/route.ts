import { neon } from "@neondatabase/serverless";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const { projectId, name, priority, state, workload, notes, role_id } =
    await req.json();

  try {
    const sql = neon(process.env.DATABASE_URL!);
    const result = await sql`
      UPDATE task
      SET project_id = ${projectId}, name = ${name}, priority = ${priority}, state = ${state}, workload = ${workload}, notes = ${notes}, role_id = ${role_id}
      WHERE id = ${id}
      RETURNING *;
    `;

    const taskWithRole = await sql`
      SELECT
        t.*,
        a.name AS assigned_to_name,
        d.name AS done_by_name,
        r.name AS role_name
      FROM task t
      LEFT JOIN employee a ON a.id = t.assigned_to
      LEFT JOIN employee d ON d.id = t.done_by
      LEFT JOIN roles r ON r.id = t.role_id
      WHERE t.id = ${id}
    `;

    return NextResponse.json(taskWithRole[0]);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const sql = neon(process.env.DATABASE_URL!);
    await sql`
      DELETE FROM task
      WHERE id = ${id};
    `;
    return NextResponse.json({ message: "Task deleted" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
