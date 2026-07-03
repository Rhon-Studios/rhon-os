import { neon } from "@neondatabase/serverless";
import { NextRequest, NextResponse } from "next/server";

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
    notes,
  } = await req.json();

  try {
    const sql = neon(process.env.DATABASE_URL!);
    const result = await sql`
      UPDATE subtasks
      SET name = ${name}, priority = ${priority}, state = ${state}, workload = ${workload}, assigned_to = ${assigned_to}, meant_to_assign = ${meant_to_assign}, notes = ${notes}
      WHERE id = ${id}
      RETURNING *;
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
