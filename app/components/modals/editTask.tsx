"use client";
import { useState } from "react";
import { Task } from "@/types/TypesDB";

export function EditTaskModal({
  open,
  onClose,
  onUpdated,
  task,
  priorities,
  states,
  workloads,
  employees,
  roles,
}: {
  open: boolean;
  onClose: () => void;
  onUpdated: () => void;
  task: Task | null;
  priorities: string[];
  states: string[];
  workloads: string[];
  employees: { id: number; name: string }[];
  roles: { id: number; name: string }[];
}) {
  const [editTask, setEditTask] = useState<{
    projectId: number;
    name: string;
    priority: string;
    state: string;
    workload: string;
    assigned_to: number | null;
    notes: string;
    role_id: number | null;
  }>(() => ({
    projectId: task?.project_id ?? 0,
    name: task?.name ?? "",
    priority: task?.priority ?? "medium",
    state: task?.state ?? "not started",
    workload: task?.workload ?? "medium",
    assigned_to: task?.assigned_to ?? null,
    notes: task?.notes ?? "",
    role_id: task?.role_id ?? null,
  }));

  const onEditTask = async () => {
    if (!task) return;

    await fetch(`/api/tasks/${task.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editTask),
    });

    onClose();
    onUpdated();
  };

  if (!open || !task) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60">
      <div className="w-[500px] space-y-3 rounded-xl bg-zinc-900 p-6">
        <h2 className="text-white font-medium mb-1">Edit Task</h2>

        <div>
          <label className="mb-1 block text-xs text-zinc-500">Name</label>
          <input
            type="text"
            placeholder="Name"
            className="w-full rounded-xl bg-zinc-800 px-4 py-2 text-zinc-200"
            value={editTask.name}
            onChange={(e) => setEditTask({ ...editTask, name: e.target.value })}
          />
        </div>

        <div>
          <label className="mb-1 block text-xs text-zinc-500">Priority</label>
          <select
            value={editTask.priority}
            onChange={(e) =>
              setEditTask({ ...editTask, priority: e.target.value })
            }
            className="w-full rounded-xl bg-zinc-800 px-4 py-2 text-zinc-200"
          >
            {priorities.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-xs text-zinc-500">State</label>
          <select
            value={editTask.state}
            onChange={(e) =>
              setEditTask({ ...editTask, state: e.target.value })
            }
            className="w-full rounded-xl bg-zinc-800 px-4 py-2 text-zinc-200"
          >
            {states.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-xs text-zinc-500">Workload</label>
          <select
            value={editTask.workload}
            onChange={(e) =>
              setEditTask({ ...editTask, workload: e.target.value })
            }
            className="w-full rounded-xl bg-zinc-800 px-4 py-2 text-zinc-200"
          >
            {workloads.map((w) => (
              <option key={w} value={w}>
                {w}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-xs text-zinc-500">Role</label>
          <select
            value={editTask.role_id ?? ""}
            onChange={(e) =>
              setEditTask({
                ...editTask,
                role_id: e.target.value ? Number(e.target.value) : null,
              })
            }
            className="w-full rounded-xl bg-zinc-800 px-4 py-2 text-zinc-200"
          >
            <option value="">No role</option>
            {roles.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-xs text-zinc-500">
            Assigned to
          </label>
          <select
            value={editTask.assigned_to ?? ""}
            onChange={(e) =>
              setEditTask({
                ...editTask,
                assigned_to: e.target.value ? Number(e.target.value) : null,
              })
            }
            className="w-full rounded-xl bg-zinc-800 px-4 py-2 text-zinc-200"
          >
            <option value="">Unassigned</option>
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-xs text-zinc-500">Notes</label>
          <textarea
            placeholder="Notes"
            className="w-full rounded-xl bg-zinc-800 px-4 py-2 text-zinc-200"
            rows={3}
            value={editTask.notes}
            onChange={(e) =>
              setEditTask({ ...editTask, notes: e.target.value })
            }
          />
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-xl bg-zinc-700 px-4 py-2"
          >
            Cancel
          </button>
          <button
            onClick={onEditTask}
            className="rounded-xl bg-emerald-600 px-4 py-2"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
