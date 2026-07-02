"use client";
import { useState } from "react";
import { Subtask } from "@/types/TypesDB";

export function EditSubtaskModal({
  open,
  onClose,
  onUpdated,
  subtask,
  priorities,
  states,
  workloads,
  employees,
}: {
  open: boolean;
  onClose: () => void;
  onUpdated: () => void;
  subtask: Subtask | null;
  priorities: string[];
  states: string[];
  workloads: string[];
  employees: { id: number; name: string }[];
}) {
  const [editSubtask, setEditSubtask] = useState<{
    name: string;
    priority: string;
    state: string;
    workload: string;
    assigned_to: number | null;
    notes: string;
  }>(() => ({
    name: subtask?.name ?? "",
    priority: subtask?.priority ?? "medium",
    state: subtask?.state ?? "not started",
    workload: subtask?.workload ?? "medium",
    assigned_to: subtask?.assigned_to ?? null,
    notes: subtask?.notes ?? "",
  }));

  const onEditSubtask = async () => {
    if (!subtask) return;

    await fetch(`/api/subtasks/${subtask.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editSubtask),
    });

    onClose();
    onUpdated();
  };

  if (!open || !subtask) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60">
      <div className="w-[500px] space-y-3 rounded-xl bg-zinc-900 p-6">
        <h2 className="text-white font-medium mb-1">Edit Subtask</h2>

        <div>
          <label className="mb-1 block text-xs text-zinc-500">Name</label>
          <input
            type="text"
            placeholder="Name"
            className="w-full rounded-xl bg-zinc-800 px-4 py-2 text-zinc-200"
            value={editSubtask.name}
            onChange={(e) =>
              setEditSubtask({ ...editSubtask, name: e.target.value })
            }
          />
        </div>

        <div>
          <label className="mb-1 block text-xs text-zinc-500">Priority</label>
          <select
            value={editSubtask.priority}
            onChange={(e) =>
              setEditSubtask({ ...editSubtask, priority: e.target.value })
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
            value={editSubtask.state}
            onChange={(e) =>
              setEditSubtask({ ...editSubtask, state: e.target.value })
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
            value={editSubtask.workload}
            onChange={(e) =>
              setEditSubtask({ ...editSubtask, workload: e.target.value })
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
          <label className="mb-1 block text-xs text-zinc-500">
            Assigned to
          </label>
          <select
            value={editSubtask.assigned_to ?? ""}
            onChange={(e) =>
              setEditSubtask({
                ...editSubtask,
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
            value={editSubtask.notes}
            onChange={(e) =>
              setEditSubtask({ ...editSubtask, notes: e.target.value })
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
            onClick={onEditSubtask}
            className="rounded-xl bg-emerald-600 px-4 py-2"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
