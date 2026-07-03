import { verifySessionToken } from "@/app/lib/auth";
import { neon } from "@neondatabase/serverless";
import { NextRequest, NextResponse } from "next/server";

const workloadPoints = {
  low: 0.5,
  "low-medium": 1,
  medium: 2,
  "medium-high": 3,
  high: 4,
} as const;

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("session")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const session = await verifySessionToken(token);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sql = neon(process.env.DATABASE_URL!);

    const employeeId = session.userId;

    const projects = await sql`
      SELECT project_id
      FROM project_employee
      WHERE employee_id = ${employeeId}
    `;

    let myRevshare = 0;

    for (const { project_id } of projects) {
      const tasks = await sql`
        SELECT id, workload
        FROM task
        WHERE project_id = ${project_id}
      `;

      if (tasks.length === 0) continue;

      const subtasks = await sql`
        SELECT task_id, workload, done_by
        FROM subtasks
        WHERE task_id = ANY(${tasks.map((t) => t.id)})
      `;

      const totalTaskPoints = tasks.reduce(
        (sum, task) =>
          sum + workloadPoints[task.workload as keyof typeof workloadPoints],
        0,
      );

      if (totalTaskPoints === 0) continue;

      for (const task of tasks) {
        const taskShare =
          (workloadPoints[task.workload as keyof typeof workloadPoints] /
            totalTaskPoints) *
          100;

        const taskSubtasks = subtasks.filter((s) => s.task_id === task.id);

        if (taskSubtasks.length === 0) continue;

        const totalSubtaskPoints = taskSubtasks.reduce(
          (sum, subtask) =>
            sum +
            workloadPoints[subtask.workload as keyof typeof workloadPoints],
          0,
        );

        if (totalSubtaskPoints === 0) continue;

        for (const subtask of taskSubtasks) {
          if (subtask.done_by !== employeeId) continue;

          myRevshare +=
            (workloadPoints[subtask.workload as keyof typeof workloadPoints] /
              totalSubtaskPoints) *
            taskShare;
        }
      }
    }

    return NextResponse.json({
      myRevshare: Number(myRevshare.toFixed(2)),
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
