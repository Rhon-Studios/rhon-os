"use client";

import { useState } from "react";
import { Task } from "@/types/TypesDB";

export function CreateTaskModal({
  open,
  onClose,
  onCreated,
  projectId,
  priorities,
  states,
  workloads,
}: {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
  projectId: number;
  priorities: Task["priority"][];
  states: Task["state"][];
  workloads: Task["workload"][];
}) {
  const [newTask, setNewTask] = useState<{
    name: string;
    priority: Task["priority"];
    state: Task["state"];
    workload: Task["workload"];
    assigned_to: string;
    notes: string;
  }>({
    name: "",
    priority: "medium",
    state: "not started",
    workload: "medium",
    assigned_to: "",
    notes: "",
  });

  const onCreateTask = async () => {
    await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...newTask, projectId }),
    });

    setNewTask({
      name: "",
      priority: "medium",
      state: "not started",
      workload: "medium",
      assigned_to: "",
      notes: "",
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
          placeholder="Task name"
          className="w-full rounded-xl bg-zinc-800 px-4 py-2 text-zinc-200"
          value={newTask.name}
          onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
        />

        <select
          value={newTask.priority}
          onChange={(e) =>
            setNewTask({
              ...newTask,
              priority: e.target.value as Task["priority"],
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
          value={newTask.state}
          onChange={(e) =>
            setNewTask({
              ...newTask,
              state: e.target.value as Task["state"],
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
          value={newTask.workload}
          onChange={(e) =>
            setNewTask({
              ...newTask,
              workload: e.target.value as Task["workload"],
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
            onClick={onCreateTask}
            className="rounded-xl bg-emerald-600 px-4 py-2"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
