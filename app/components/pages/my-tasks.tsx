"use client";

import { useUser } from "@/context/userContext";
import { Task, Subtask } from "@/types/TypesDB";
import { useCallback, useEffect, useState } from "react";

export default function MyTasks() {
  const { user, loading: userLoading } = useUser();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const priorityStyles: Record<Task["priority"], string> = {
    critic: "text-red-500",
    high: "text-orange-400",
    medium: "text-yellow-400",
    low: "text-emerald-400",
  };

  const stateStyles: Record<Task["state"], string> = {
    "not started": "text-zinc-400",
    "in progress": "text-blue-400",
    waiting: "text-yellow-400",
    review: "text-purple-400",
    done: "text-emerald-400",
    cancelled: "text-red-500",
  };

  const workloadStyles: Record<Task["workload"], string> = {
    low: "text-emerald-400",
    "low-medium": "text-lime-400",
    medium: "text-yellow-400",
    "medium-high": "text-orange-400",
    high: "text-red-500",
  };

  const getTasks = useCallback(async () => {
    if (!user) return;

    setLoading(true);
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
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (userLoading) return;
    if (!user) {
      setLoading(false);
      return;
    }

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
          className="rounded-xl border border-zinc-700 bg-zinc-800/60 px-4 py-2 text-sm hover:bg-zinc-700/60 cursor-pointer"
        >
          Refresh
        </button>
      </div>

      <h1 className="text-3xl font-semibold text-white mt-3">My Tasks</h1>

      <p className="text-zinc-500 text-sm mt-1">
        {loading
          ? "Loading your tasks..."
          : `${tasks.length} task${tasks.length === 1 ? "" : "s"} with items assigned to you`}
      </p>

      <div className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900/60 overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-800">
          <h2 className="text-base font-medium text-white">Your tasks</h2>
          <p className="text-zinc-500 text-xs mt-0.5">
            Tasks and subtasks assigned to you.
          </p>
        </div>

        {error && <div className="px-6 py-8 text-red-400 text-sm">{error}</div>}

        {!error && loading && (
          <div className="divide-y divide-zinc-800/60">
            {[1, 2, 3].map((i) => (
              <div key={i} className="px-6 py-5 animate-pulse">
                <div className="h-4 w-48 rounded bg-zinc-700 mb-3" />
                <div className="space-y-2">
                  <div className="h-3 w-64 rounded bg-zinc-800" />
                  <div className="h-3 w-40 rounded bg-zinc-800" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!error && !loading && tasks.length === 0 && (
          <div className="px-6 py-12 text-center">
            <p className="text-zinc-400">
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
                <div key={task.id} className="px-6 py-5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-white font-medium">{task.name}</h3>

                    {!task.is_assigned_to_you && (
                      <span className="text-[10px] uppercase tracking-wide rounded-full bg-zinc-800 border border-zinc-700 px-2 py-0.5 text-zinc-400">
                        Subtask only
                      </span>
                    )}
                  </div>

                  {task.project_name && (
                    <p className="text-xs text-zinc-500 mt-0.5">
                      Project: {task.project_name}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-5 text-xs mt-2">
                    <span>
                      State:{" "}
                      <span className={stateStyles[task.state]}>
                        {task.state}
                      </span>
                    </span>

                    <span>
                      Priority:{" "}
                      <span className={priorityStyles[task.priority]}>
                        {task.priority}
                      </span>
                    </span>

                    <span>
                      Workload:{" "}
                      <span className={workloadStyles[task.workload]}>
                        {task.workload}
                      </span>
                    </span>

                    {task.role_name && (
                      <span>
                        Role:{" "}
                        <span className="text-zinc-300">{task.role_name}</span>
                      </span>
                    )}
                  </div>

                  <ul className="mt-4 ml-5 space-y-2">
                    {taskSubtasks.map((subtask) => (
                      <li
                        key={subtask.id}
                        className="flex justify-between rounded-lg bg-zinc-800/40 px-3 py-2"
                      >
                        <span>{subtask.name}</span>

                        <span className={stateStyles[subtask.state]}>
                          {subtask.state}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
