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
    const sql = neon(process.env.DATABASE_URL!);

    const projectId = req.nextUrl.searchParams.get("projectId");
    const myTasksOnly = req.nextUrl.searchParams.get("myTasksOnly");

    const token = req.cookies.get("session")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const session = await verifySessionToken(token);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const employeeId = session.userId;
    const is_admin = await sql`
      SELECT
        e.id,
        e.name,
        r.is_admin
      FROM employee e
      JOIN roles r ON r.id = e.role_id
      WHERE e.id = ${employeeId};`;

    const isAdmin = is_admin[0]?.is_admin;

    if (projectId) {
      const tasks = await sql`
        SELECT
          t.*,
          a.name AS assigned_to_name,
          d.name AS done_by_name,
          ro.name AS role_name
        FROM task t
        LEFT JOIN employee a ON a.id = t.assigned_to
        LEFT JOIN employee d ON d.id = t.done_by
        LEFT JOIN roles ro ON ro.id = t.role_id
        WHERE t.project_id = ${projectId}
        ORDER BY t.id
      `;

      const subtasks = await sql`
        SELECT
          s.*,
          a.name AS assigned_to_name,
          d.name AS done_by_name
        FROM subtasks s
        LEFT JOIN employee a ON a.id = s.assigned_to
        LEFT JOIN employee d ON d.id = s.done_by
        WHERE s.task_id IN (
          SELECT id
          FROM task
          WHERE project_id = ${projectId}
        )
        ORDER BY s.task_id, s.id
      `;

      const projectName = await sql`
        SELECT name
        FROM projects
        WHERE id = ${projectId}
      `;
      const employeesInProyect = await sql`
        SELECT
          e.id,
          e.name
        FROM employee e
        JOIN project_employee ep
          ON ep.employee_id = e.id
        WHERE ep.project_id = ${projectId}
        ORDER BY e.name
      `;

      const totalPoints = tasks.reduce(
        (sum, task) =>
          sum + workloadPoints[task.workload as keyof typeof workloadPoints],
        0,
      );

      tasks.forEach((task) => {
        const taskShare =
          totalPoints === 0
            ? 0
            : (workloadPoints[task.workload as keyof typeof workloadPoints] /
                totalPoints) *
              100;

        task.share = Number(taskShare.toFixed(2));

        const children = subtasks.filter((s) => s.task_id === task.id);

        if (children.length === 0) return;

        const subPoints = children.reduce(
          (sum, subtask) =>
            sum +
            workloadPoints[subtask.workload as keyof typeof workloadPoints],
          0,
        );

        children.forEach((subtask) => {
          const share =
            subPoints === 0
              ? 0
              : (workloadPoints[
                  subtask.workload as keyof typeof workloadPoints
                ] /
                  subPoints) *
                taskShare;

          subtask.share = Number(share.toFixed(2));
        });
      });

      return NextResponse.json({
        tasks,
        subtasks,
        projectName: projectName[0]?.name,
        employeesInProyect: isAdmin ? employeesInProyect : null,
        isAdmin,
      });
    }

    if (myTasksOnly) {
      const subtasks = await sql`
        SELECT
          s.*,
          a.name AS assigned_to_name,
          d.name AS done_by_name
        FROM subtasks s
        LEFT JOIN employee a ON a.id = s.assigned_to
        LEFT JOIN employee d ON d.id = s.done_by
        WHERE s.assigned_to = ${employeeId}
        ORDER BY s.id
      `;

      const subtaskTaskIds = [...new Set(subtasks.map((s) => s.task_id))];

      const tasks = await sql`
        SELECT
          t.*,
          ro.name AS role_name,
          p.name AS project_name
        FROM task t
        LEFT JOIN roles ro ON ro.id = t.role_id
        LEFT JOIN projects p ON p.id = t.project_id
        WHERE t.assigned_to = ${employeeId}
           OR t.id = ANY(${subtaskTaskIds})
        ORDER BY t.id
      `;

      const tasksWithFlag = tasks.map((task) => ({
        ...task,
        is_assigned_to_you: task.assigned_to === employeeId,
      }));

      return NextResponse.json({
        tasks: tasksWithFlag,
        subtasks,
        isAdmin,
      });
    }

    return NextResponse.json(
      { error: "projectId or employeeId is required" },
      { status: 400 },
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const { projectId, name, priority, state, workload } = await req.json();

  if (!projectId || !name || !priority || !state || !workload) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 },
    );
  }
  try {
    const sql = neon(process.env.DATABASE_URL!);

    const result = await sql`
      INSERT INTO task (project_id, name, priority, state, workload, assigned_to, notes)
      VALUES (${projectId}, ${name}, ${priority}, ${state}, ${workload}, NULL, NULL)
      RETURNING *;
    `;

    return NextResponse.json(result[0]);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
