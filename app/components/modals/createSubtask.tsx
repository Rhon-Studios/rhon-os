"use client";

import { useState } from "react";

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
    <div className="fixed inset-0 flex items-center justify-center bg-black/60">
      <div className="w-[500px] space-y-3 rounded-xl bg-zinc-900 p-6">
        <input
          type="text"
          placeholder="Name"
          className="w-full rounded-xl bg-zinc-800 px-4 py-2 text-zinc-200"
          value={newSubtask.name}
          onChange={(e) =>
            setNewSubtask({ ...newSubtask, name: e.target.value })
          }
        />

        <select
          value={newSubtask.priority}
          onChange={(e) =>
            setNewSubtask({
              ...newSubtask,
              priority: e.target.value,
            })
          }
          className="w-full rounded-xl bg-zinc-800 px-4 py-2 text-zinc-200"
        >
          {priorities.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>

        <select
          value={newSubtask.state}
          onChange={(e) =>
            setNewSubtask({
              ...newSubtask,
              state: e.target.value,
            })
          }
          className="w-full rounded-xl bg-zinc-800 px-4 py-2 text-zinc-200"
        >
          {states.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <select
          value={newSubtask.workload}
          onChange={(e) =>
            setNewSubtask({
              ...newSubtask,
              workload: e.target.value,
            })
          }
          className="w-full rounded-xl bg-zinc-800 px-4 py-2 text-zinc-200"
        >
          {workloads.map((w) => (
            <option key={w} value={w}>
              {w}
            </option>
          ))}
        </select>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-xl bg-zinc-700 px-4 py-2"
          >
            Cancel
          </button>

          <button
            onClick={onCreateSubtask}
            className="rounded-xl bg-emerald-600 px-4 py-2"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
