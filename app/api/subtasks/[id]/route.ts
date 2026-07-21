// app/api/subtasks/[id]/route.ts
import { neon } from "@neondatabase/serverless";
import { NextRequest, NextResponse } from "next/server";

function isValidDateString(s: unknown): s is string {
  if (typeof s !== "string") return false;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const d = new Date(s);
  return !isNaN(d.getTime());
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  
  const { id } = await params;
  const {
    name,
    priority,
    state,
    workload,
    assigned_to,
    meant_to_assign,
    finish_date,
    done_by,
    notes,
  } = await req.json();
  console.log(finish_date);

  const safeFinishDate =
    finish_date === null || finish_date === undefined
      ? null
      : isValidDateString(finish_date)
        ? finish_date
        : null;

  try {
    const sql = neon(process.env.DATABASE_URL!);
    const result = await sql`
      UPDATE subtasks
      SET name = ${name}, priority = ${priority}, state = ${state}, workload = ${workload}, assigned_to = ${assigned_to}, meant_to_assign = ${meant_to_assign}, finish_date = ${safeFinishDate}, done_by = ${done_by}, notes = ${notes}
      WHERE id = ${id}
      RETURNING *, finish_date::text AS finish_date;
    `;
    return NextResponse.json(result[0]);
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
    await sql`DELETE FROM subtasks WHERE id = ${id}`;
    return NextResponse.json({ message: "Subtask deleted successfully" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
