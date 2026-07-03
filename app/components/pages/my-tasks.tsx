"use client";

import { useUser } from "@/context/userContext";
import { Task, Subtask } from "@/types/TypesDB";
import { useCallback, useEffect, useState } from "react";
import { RefreshCw, CircleDot } from "lucide-react";

export default function MyTasks() {
  const { user, loading: userLoading } = useUser();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loading = userLoading || (!!user && fetching);

  const priorityStyles: Record<Task["priority"], string> = {
    critic: "bg-red-500/10 text-red-400 border-red-500/20",
    high: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    medium: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    low: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  };

  const stateStyles: Record<Task["state"], string> = {
    "not started": "bg-zinc-700/40 text-zinc-300 border-zinc-600/40",
    "in progress": "bg-blue-500/10 text-blue-400 border-blue-500/20",
    waiting: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    review: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    done: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    cancelled: "bg-red-500/10 text-red-400 border-red-500/20",
  };

  const workloadStyles: Record<Task["workload"], string> = {
    low: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    "low-medium": "bg-lime-500/10 text-lime-400 border-lime-500/20",
    medium: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    "medium-high": "bg-orange-500/10 text-orange-400 border-orange-500/20",
    high: "bg-red-500/10 text-red-400 border-red-500/20",
  };

  const roleStyles: Record<string, string> = {
    Programmer: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    Artist: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    Designer: "bg-pink-500/10 text-pink-400 border-pink-500/20",
    Writer: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    "Sound designer": "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    Marketing: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    "QA Tester": "bg-red-500/10 text-red-400 border-red-500/20",
    Producer: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    Founder: "bg-zinc-200/10 text-zinc-100 border-zinc-400/30 font-semibold",
    "Voice actor": "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
    RRHH: "bg-teal-500/10 text-teal-400 border-teal-500/20",
  };

  function Badge({ label, className }: { label: string; className: string }) {
    return (
      <span
        className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-medium capitalize ${className}`}
      >
        {label}
      </span>
    );
  }

  const getTasks = useCallback(async () => {
    if (!user) return;

    setFetching(true);
    setError(null);

    try {
      const res = await fetch(`/api/tasks?myTasksOnly=${true}`);

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Error loading tasks");
        return;
      }

      const data = await res.json();
      setTasks(data.tasks);
      setSubtasks(data.subtasks);
    } finally {
      setFetching(false);
    }
  }, [user]);

  useEffect(() => {
    if (userLoading || !user) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    getTasks();
  }, [user, userLoading, getTasks]);

  return (
    <div className="h-full flex flex-col text-zinc-200 p-8">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2 text-sm text-zinc-500">
          <span>Rhon Studios</span>
          <span>/</span>
          <span className="text-zinc-300">My Tasks</span>
        </div>

        <button
          onClick={getTasks}
          className="inline-flex items-center gap-1.5 rounded-xl border cursor-pointer border-zinc-700 bg-zinc-800/60 px-4 py-2 text-sm text-zinc-200 transition-colors duration-150 hover:bg-zinc-700/60"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      <h1 className="text-3xl font-semibold text-white mt-3 tracking-tight">
        My Tasks
      </h1>

      <p className="text-zinc-500 text-sm mt-1">
        {loading
          ? "Loading your tasks..."
          : `${tasks.length} task${tasks.length === 1 ? "" : "s"} with items assigned to you`}
      </p>

      <div className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900/60 max-h-[600px] overflow-y-auto">
        <div className="px-6 py-4 border-b border-zinc-800 sticky top-0 bg-zinc-900/95 backdrop-blur">
          <h2 className="text-base font-semibold text-white">Your tasks</h2>
          <p className="text-zinc-500 text-xs mt-0.5">
            Tasks and subtasks assigned to you.
          </p>
        </div>

        {error && <div className="px-6 py-8 text-sm text-red-400">{error}</div>}

        {!error && loading && (
          <div className="divide-y divide-zinc-800/60">
            {[1, 2, 3].map((i) => (
              <div key={i} className="px-6 py-5 animate-pulse">
                <div className="h-4 w-48 rounded bg-zinc-700 mb-3" />
                <div className="space-y-2 pl-4">
                  <div className="h-3 w-36 rounded bg-zinc-800" />
                  <div className="h-3 w-28 rounded bg-zinc-800" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!error && !loading && tasks.length === 0 && (
          <div className="px-6 py-12 text-center">
            <p className="text-zinc-400 text-sm">
              You have no assigned tasks or subtasks. Ask a founder or a Lead
              project to assign you something.
            </p>
          </div>
        )}

        {!error && !loading && tasks.length > 0 && (
          <div className="divide-y divide-zinc-800/60">
            {tasks.map((task) => {
              const taskSubtasks = subtasks.filter(
                (s) => s.task_id === task.id,
              );

              return (
                <div
                  key={task.id}
                  className="px-6 py-5 hover:bg-zinc-800/20 transition-colors"
                >
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] font-mono text-zinc-600">
                      #{String(task.id).padStart(3, "0")}
                    </span>
                    <h3 className="text-white font-semibold text-[15px] truncate">
                      {task.name}
                    </h3>

                    {!task.is_assigned_to_you && (
                      <Badge
                        label="Subtask only"
                        className="bg-zinc-800 text-zinc-400 border-zinc-700"
                      />
                    )}
                  </div>

                  {task.project_name && (
                    <p className="text-xs text-zinc-500 mt-0.5">
                      Project: {task.project_name}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-2 mt-3">
                    <Badge
                      label={task.state}
                      className={stateStyles[task.state]}
                    />
                    <Badge
                      label={task.priority}
                      className={priorityStyles[task.priority]}
                    />
                    <Badge
                      label={task.workload}
                      className={workloadStyles[task.workload]}
                    />
                    {task.role_name && (
                      <Badge
                        label={task.role_name}
                        className={
                          roleStyles[task.role_name] ??
                          "bg-zinc-700/40 text-zinc-300 border-zinc-600/40"
                        }
                      />
                    )}
                  </div>

                  {/* Subtareas: indentadas con línea guía, igual que en ProjectDetails */}
                  <div className="mt-4 ml-2 pl-4 border-l border-zinc-800 space-y-3">
                    {taskSubtasks.length === 0 && (
                      <p className="text-xs text-zinc-600 flex items-center gap-1.5">
                        <CircleDot className="h-3 w-3" />
                        No subtasks.
                      </p>
                    )}

                    {taskSubtasks.map((subtask) => (
                      <div
                        key={subtask.id}
                        className="rounded-xl bg-zinc-800/40 border border-zinc-800 px-4 py-3.5 hover:border-zinc-700 transition-colors"
                      >
                        <div className="flex items-center justify-between gap-4">
                          <p className="text-sm text-zinc-100 font-medium truncate">
                            {subtask.name}
                          </p>
                          <Badge
                            label={subtask.state}
                            className={stateStyles[subtask.state]}
                          />
                        </div>

                        <div className="flex flex-wrap gap-2 mt-2">
                          <Badge
                            label={subtask.priority}
                            className={priorityStyles[subtask.priority]}
                          />
                          <Badge
                            label={subtask.workload}
                            className={workloadStyles[subtask.workload]}
                          />
                        </div>

                        {subtask.notes && (
                          <p className="break-words text-sm text-zinc-300 bg-zinc-900/50 rounded-lg px-3 py-2 mt-3 border border-zinc-800">
                            {subtask.notes}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
