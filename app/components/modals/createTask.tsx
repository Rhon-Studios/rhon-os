"use client";
import { useState } from "react";
import { Task } from "@/types/TypesDB";
import { Plus, X } from "lucide-react";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-125 rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-2">
              <Plus className="h-4 w-4 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-white font-semibold text-[15px]">New Task</h2>
              <p className="text-zinc-500 text-xs mt-0.5">
                Add a task to this project.
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
              placeholder="Task name"
              className="w-full rounded-xl bg-zinc-800 px-4 py-2 text-zinc-200"
              value={newTask.name}
              onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
            />
          </div>

          <div>
            <label className="mb-1 block text-xs text-zinc-500">Priority</label>
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
          </div>

          <div>
            <label className="mb-1 block text-xs text-zinc-500">State</label>
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
          </div>

          <div>
            <label className="mb-1 block text-xs text-zinc-500">Workload</label>
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
            onClick={onCreateTask}
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium cursor-pointer hover:bg-emerald-500 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
