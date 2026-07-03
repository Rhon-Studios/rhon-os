"use client";
import { useState } from "react";
import { ListPlus, X } from "lucide-react";

export function CreateSubtaskModal({
  open,
  onClose,
  onCreated,
  taskId,
  priorities,
  states,
  workloads,
}: {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
  taskId: number | null;
  priorities: string[];
  states: string[];
  workloads: string[];
}) {
  const [newSubtask, setNewSubtask] = useState<{
    name: string;
    priority: string;
    state: string;
    workload: string;
  }>({
    name: "",
    priority: "medium",
    state: "not started",
    workload: "medium",
  });

  const onCreateSubtask = async () => {
    await fetch("/api/subtasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...newSubtask, taskId }),
    });
    setNewSubtask({
      name: "",
      priority: "medium",
      state: "not started",
      workload: "medium",
    });
    onClose();
    onCreated();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-[500px] rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="rounded-lg bg-green-500/10 border border-green-500/20 p-2">
              <ListPlus className="h-4 w-4 text-green-400" />
            </div>
            <div>
              <h2 className="text-white font-semibold text-[15px]">
                New Subtask
              </h2>
              <p className="text-zinc-500 text-xs mt-0.5">
                Add a subtask to this task.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 cursor-pointer transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-xs text-zinc-500">Name</label>
            <input
              type="text"
              placeholder="Subtask name"
              className="w-full rounded-xl bg-zinc-800 px-4 py-2 text-zinc-200"
              value={newSubtask.name}
              onChange={(e) =>
                setNewSubtask({ ...newSubtask, name: e.target.value })
              }
            />
          </div>

          <div>
            <label className="mb-1 block text-xs text-zinc-500">Priority</label>
            <select
              value={newSubtask.priority}
              onChange={(e) =>
                setNewSubtask({ ...newSubtask, priority: e.target.value })
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
              value={newSubtask.state}
              onChange={(e) =>
                setNewSubtask({ ...newSubtask, state: e.target.value })
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
              value={newSubtask.workload}
              onChange={(e) =>
                setNewSubtask({ ...newSubtask, workload: e.target.value })
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
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            className="rounded-xl bg-zinc-700 px-4 py-2 text-sm font-medium cursor-pointer hover:bg-zinc-600 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onCreateSubtask}
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium cursor-pointer hover:bg-emerald-500 transition-colors"
          >
            <ListPlus className="h-4 w-4" />
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
