import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export async function GET(req: NextRequest) {
  const client = neon(process.env.DATABASE_URL!);
  const { searchParams } = new URL(req.url);
  const taskId = searchParams.get("taskId");
  if (!taskId) {
    return NextResponse.json({ error: "taskId is required" }, { status: 400 });
  }

  const result = await client`SELECT * FROM subtasks WHERE task_id = ${taskId}`;
  return NextResponse.json(result);
}

export async function POST(req: NextRequest) {
  const client = neon(process.env.DATABASE_URL!);
  const body = await req.json();
  const { taskId, name, state, priority, workload } = body;
  if (!taskId || !name) {
    return NextResponse.json(
      { error: "taskId and name are required" },
      { status: 400 },
    );
  }

  await client`INSERT INTO subtasks (task_id, name, state, priority, workload)
    VALUES (${Number(taskId)}, ${name}, ${state}, ${priority}, ${workload})`;
  return NextResponse.json({ message: "Subtask created successfully" });
}
