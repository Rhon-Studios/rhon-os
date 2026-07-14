"use client";

import { useUser } from "@/context/userContext";
import { Task, Subtask } from "@/types/TypesDB";
import {
  User,
  ListChecks,
  Clock,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { useActiveView } from "@/context/activeViewContext";
import { useMyTasks, useRevshare } from "@/app/hooks/useAppData";

export default function Dashboard() {
  const { user, loading: userLoading } = useUser();

  const { setActiveKey } = useActiveView();

  const {data, isLoading, error} = useMyTasks(true);
  const {data: revshareData, isLoading: revshareLoading} = useRevshare();

  const tasks: Task[] = data?.tasks || [];
  const subtasks: Subtask[] = data?.subtasks || [];
  const myRevshare: number = revshareData?.myRevshare || 0;

  const loading = isLoading || userLoading || revshareLoading;

  const stateStyles: Record<Task["state"], string> = {
    "not started": "bg-zinc-700/40 text-zinc-300 border-zinc-600/40",
    "in progress": "bg-blue-500/10 text-blue-400 border-blue-500/20",
    waiting: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    review: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    done: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    cancelled: "bg-red-500/10 text-red-400 border-red-500/20",
  };

  const priorityStyles: Record<Task["priority"], string> = {
    critic: "bg-red-500/10 text-red-400 border-red-500/20",
    high: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    medium: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    low: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  };

  const inProgressCount = subtasks.filter(
    (s) => s.state === "in progress",
  ).length;
  const doneCount = subtasks.filter((s) => s.state === "done").length;
  const totalCount = subtasks.length;

  const initials =
    user?.name
      ?.split(" ")
      .map((n: string) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() ?? "?";

  if (userLoading) {
    return (
      <div className="flex justify-center items-center min-h-[90%] text-zinc-400">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-[90%] text-zinc-200 p-8">
      <div className="flex items-center gap-2 text-sm text-zinc-500 mb-1">
        <span>Rhon Studios</span>
        <span>/</span>
        <span className="text-zinc-300">Dashboard</span>
      </div>
      <p className="text-3xl font-semibold text-emerald-400">
        {myRevshare.toFixed(2)}%
      </p>

      <h1 className="text-3xl font-semibold text-white mt-3 tracking-tight">
        Welcome back, {user?.name}
      </h1>
      <p className="text-zinc-500 text-sm mt-1">
        Let&apos;s create words that stays with you!
      </p>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 flex flex-col items-center text-center">
          <div className="h-16 w-16 rounded-full bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-lg font-semibold text-emerald-400">
            {initials}
          </div>

          <h2 className="text-white font-semibold mt-3">{user?.name}</h2>

          {user?.email && (
            <p className="text-zinc-500 text-xs mt-0.5">{user.email}</p>
          )}

          {user?.role_name && (
            <span className="inline-flex items-center gap-1.5 rounded-full border bg-zinc-800/60 border-zinc-700 text-zinc-300 px-3 py-1 text-xs font-medium mt-4 capitalize">
              <User className="h-3 w-3" />
              {user.role_name}
            </span>
          )}
        </div>

        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
            <div className="flex items-center gap-2 text-zinc-500 text-xs">
              <ListChecks className="h-4 w-4" />
              Assigned subtasks
            </div>
            <p className="text-3xl font-semibold text-white mt-2">
              {loading ? "—" : totalCount}
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
            <div className="flex items-center gap-2 text-zinc-500 text-xs">
              <Clock className="h-4 w-4" />
              In progress
            </div>
            <p className="text-3xl font-semibold text-blue-400 mt-2">
              {loading ? "—" : inProgressCount}
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
            <div className="flex items-center gap-2 text-zinc-500 text-xs">
              <CheckCircle2 className="h-4 w-4" />
              Done
            </div>
            <p className="text-3xl font-semibold text-emerald-400 mt-2">
              {loading ? "—" : doneCount}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900/60">
        <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-white">Your tasks</h2>
            <p className="text-zinc-500 text-xs mt-0.5">
              A quick look at what you&apos;re working on.
            </p>
          </div>

          <button
            onClick={() => setActiveKey("my-tasks")}
            className="inline-flex items-center gap-1 text-xs text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
          >
            View all
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {error && <div className="px-6 py-8 text-sm text-red-400">{error.toString()}</div>}

        {!error && loading && (
          <div className="divide-y divide-zinc-800/60">
            {[1, 2, 3].map((i) => (
              <div key={i} className="px-6 py-4 animate-pulse">
                <div className="h-4 w-48 rounded bg-zinc-700 mb-2" />
                <div className="h-3 w-24 rounded bg-zinc-800" />
              </div>
            ))}
          </div>
        )}

        {!error && !loading && tasks.length === 0 && (
          <div className="px-6 py-12 text-center">
            <p className="text-zinc-400 text-sm">
              You have no assigned tasks or subtasks yet.
            </p>
          </div>
        )}

        {!error && !loading && tasks.length > 0 && (
          <div className="divide-y divide-zinc-800/60">
            {tasks.slice(0, 5).map((task) => {
              const taskSubtasks = subtasks.filter(
                (s) => s.task_id === task.id,
              );

              return (
                <div key={task.id} className="px-6 py-4">
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="text-white font-medium text-sm truncate">
                      {task.name}
                    </h3>
                    <span
                      className={`inline-flex shrink-0 items-center rounded-full border px-2.5 py-1 text-[11px] font-medium capitalize ${stateStyles[task.state]}`}
                    >
                      {task.state}
                    </span>
                  </div>

                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {taskSubtasks
                      .filter((s) => s.assigned_to === user?.id)
                      .slice(0, 3)
                      .map((s) => (
                        <span
                          key={s.id}
                          className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-medium capitalize ${priorityStyles[s.priority]}`}
                        >
                          {s.name}
                        </span>
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
