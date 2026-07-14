"use client";

import { useState, useMemo } from "react";
import { Task, Subtask, Role } from "@/types/TypesDB";
import { CreateTaskModal } from "./modals/createTask";
import { CreateSubtaskModal } from "./modals/createSubtask";
import { EditTaskModal } from "./modals/editTask";
import { EditSubtaskModal } from "./modals/editSubtask";
import {
  Plus,
  RefreshCw,
  Pencil,
  ListPlus,
  CircleDot,
  ChevronDown,
  ChevronRight,
  Filter,
  X,
} from "lucide-react";
import { useProjectTasks, useRoles } from "../hooks/useAppData";

export function ProjectDetails({ projectId }: { projectId: number }) {
  const [openCreate, setOpenCreate] = useState(false);
  const [openSubtask, setOpenSubtask] = useState(false);
  const [activeTaskId, setActiveTaskId] = useState<number | null>(null);

  const [openEditSubtask, setOpenEditSubtask] = useState(false);
  const [editingSubtask, setEditingSubtask] = useState<Subtask | null>(null);

  const [openEdit, setOpenEdit] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const [roleFilter, setRoleFilter] = useState<string>("all");

  const [collapsedTasks, setCollapsedTasks] = useState<Set<number>>(new Set());
  const {
    data,
    isLoading: loading,
    error: queryError,
    refetch,
  } = useProjectTasks(projectId);
  const { data: roles = [] } = useRoles();

  const tasks = useMemo(() => data?.tasks ?? [], [data?.tasks]);
  const subtasks = data?.subtasks ?? [];
  const projectName = data?.projectName ?? null;
  const isAdmin = data?.isAdmin ?? false;
  const employees = data?.employeesInProyect ?? [];
  const error = queryError?.message ?? null;
  const toggleCollapsed = (taskId: number) => {
    setCollapsedTasks((prev) => {
      const next = new Set(prev);
      if (next.has(taskId)) {
        next.delete(taskId);
      } else {
        next.add(taskId);
      }
      return next;
    });
  };

  const workloads: Task["workload"][] = [
    "low",
    "low-medium",
    "medium",
    "medium-high",
    "high",
  ];
  const priorities: Task["priority"][] = ["critic", "high", "medium", "low"];
  const states: Task["state"][] = [
    "not started",
    "in progress",
    "waiting",
    "review",
    "done",
    "cancelled",
  ];

  const rolesInUse = useMemo(() => {
    const names = new Set(
      tasks
        .map((t: Task) => t.role_name)
        .filter((r: string | undefined): r is string => !!r),
    );
    return roles.filter((r: Role) => names.has(r.name));
  }, [tasks, roles]);

  const filteredTasks = useMemo(() => {
    if (roleFilter === "all") return tasks;
    if (roleFilter === "none") return tasks.filter((t: Task) => !t.role_name);
    return tasks.filter((t: Task) => t.role_name === roleFilter);
  }, [tasks, roleFilter]);

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

  return (
    <div className="h-full flex flex-col text-zinc-200 p-8">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2 text-sm text-zinc-500">
          <span>Rhon Studios</span>
          <span>/</span>
          <span className="text-zinc-300">Project {projectName}</span>
        </div>
        <div className="flex gap-2">
          {isAdmin && (
            <>
              <button
                onClick={() => setOpenCreate(true)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium cursor-pointer hover:bg-emerald-500 transition-colors"
              >
                <Plus className="h-4 w-4" />
                New Task
              </button>

              {openCreate && (
                <CreateTaskModal
                  open={openCreate}
                  onClose={() => setOpenCreate(false)}
                  onCreated={() => refetch()}
                  projectId={projectId}
                  priorities={priorities}
                  states={states}
                  workloads={workloads}
                />
              )}
            </>
          )}

          <button
            onClick={(e) => {
              refetch();

              const icon = e.currentTarget.querySelector("svg");
              icon?.classList.add("animate-spin");

              setTimeout(() => {
                icon?.classList.remove("animate-spin");
              }, 500);
            }}
            className="inline-flex items-center gap-1.5 rounded-xl border cursor-pointer border-zinc-700 bg-zinc-800/60 px-4 py-2 text-sm text-zinc-200 transition-colors duration-150 hover:bg-zinc-700/60"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </div>
      </div>

      <h1 className="text-3xl font-semibold text-white mt-3 tracking-tight">
        Project {projectName}
      </h1>

      <p className="text-zinc-500 text-sm mt-1">
        {loading
          ? "Loading tasks..."
          : `${filteredTasks.length} of ${tasks.length} task${tasks.length === 1 ? "" : "s"}`}
      </p>

      {!loading && tasks.length > 0 && (
        <div className="mt-5 flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1.5 text-xs text-zinc-500 mr-1">
            <Filter className="h-3.5 w-3.5" />
            Role
          </span>

          <button
            onClick={() => setRoleFilter("all")}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
              roleFilter === "all"
                ? "bg-zinc-200 text-zinc-900 border-zinc-200"
                : "bg-zinc-800/60 text-zinc-400 border-zinc-700 hover:bg-zinc-700/60"
            }`}
          >
            All
          </button>

          {rolesInUse.map((r: Role) => (
            <button
              key={r.id}
              onClick={() => setRoleFilter(r.name)}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer capitalize ${
                roleFilter === r.name
                  ? "bg-zinc-200 text-zinc-900 border-zinc-200"
                  : `${roleStyles[r.name] ?? "bg-zinc-800/60 text-zinc-400 border-zinc-700"} hover:brightness-125`
              }`}
            >
              {r.name}
            </button>
          ))}

          {tasks.some((t: Task) => !t.role_name) && (
            <button
              onClick={() => setRoleFilter("none")}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                roleFilter === "none"
                  ? "bg-zinc-200 text-zinc-900 border-zinc-200"
                  : "bg-zinc-800/60 text-zinc-400 border-zinc-700 hover:bg-zinc-700/60"
              }`}
            >
              No role
            </button>
          )}

          {roleFilter !== "all" && (
            <button
              onClick={() => setRoleFilter("all")}
              className="inline-flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-300 ml-1 cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
              Clear
            </button>
          )}
        </div>
      )}

      <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900/60 max-h-150 overflow-y-auto">
        <div className="px-6 py-4 border-b border-zinc-800 sticky top-0 bg-zinc-900/95 backdrop-blur">
          <h2 className="text-base font-semibold text-white">Tasks</h2>
          <p className="text-zinc-500 text-xs mt-0.5">
            Tasks and subtasks for this project.
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
              This project has no tasks yet.
            </p>
          </div>
        )}

        {!error &&
          !loading &&
          tasks.length > 0 &&
          filteredTasks.length === 0 && (
            <div className="px-6 py-12 text-center">
              <p className="text-zinc-400 text-sm">
                No tasks match this role filter.
              </p>
            </div>
          )}

        {!error && !loading && filteredTasks.length > 0 && (
          <div className="divide-y divide-zinc-800/60">
            {filteredTasks.map((task: Task) => {
              const taskSubtasks = subtasks.filter(
                (s: Subtask) => s.task_id === task.id,
              );
              const isCollapsed = collapsedTasks.has(task.id);

              return (
                <div
                  key={task.id}
                  className="px-6 py-5 hover:bg-zinc-800/20 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono text-zinc-600">
                          #{String(task.id).padStart(3, "0")}
                        </span>
                        <h3 className="text-white font-semibold text-[15px] truncate">
                          {task.name}
                        </h3>
                      </div>

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

                      <div className="mt-4 space-y-2 text-sm">
                        <div className="flex items-center gap-3">
                          <span className="text-zinc-500 text-xs w-16 shrink-0">
                            RevShare
                          </span>
                          <div className="flex-1 h-1.5 rounded-full bg-zinc-800 overflow-hidden max-w-40">
                            <div
                              className="h-full rounded-full bg-emerald-500"
                              style={{
                                width: `${Math.min(task.share ?? 0, 100)}%`,
                              }}
                            />
                          </div>
                          <span className="text-emerald-400 font-medium text-xs">
                            {task.share?.toFixed(2)}%
                          </span>
                        </div>

                        {task.state === "done" && task.finish_date && (
                          <p className="text-xs">
                            <span className="text-zinc-500">Finished:</span>{" "}
                            <span className="text-zinc-300">
                              {task.finish_date}
                            </span>
                          </p>
                        )}

                        {task.notes && (
                          <p className="text-xs wrap-break-words bg-zinc-800/40 rounded-lg px-3 py-2 text-zinc-300 border border-zinc-800">
                            {task.notes}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {taskSubtasks.length > 0 && (
                    <button
                      onClick={() => toggleCollapsed(task.id)}
                      className="mt-4 ml-2 inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 cursor-pointer transition-colors"
                    >
                      {isCollapsed ? (
                        <ChevronRight className="h-3.5 w-3.5" />
                      ) : (
                        <ChevronDown className="h-3.5 w-3.5" />
                      )}
                      {isCollapsed
                        ? `Show ${taskSubtasks.length} subtask${taskSubtasks.length === 1 ? "" : "s"}`
                        : `Hide subtasks`}
                    </button>
                  )}

                  {!isCollapsed && (
                    <div className="mt-3 ml-2 pl-4 border-l border-zinc-800 space-y-3">
                      {taskSubtasks.length === 0 && (
                        <p className="text-xs text-zinc-600 flex items-center gap-1.5">
                          <CircleDot className="h-3 w-3" />
                          No subtasks.
                        </p>
                      )}

                      {taskSubtasks.map((subtask: Subtask) => (
                        <div
                          key={subtask.id}
                          className="rounded-xl bg-zinc-800/40 border border-zinc-800 px-4 py-3.5 hover:border-zinc-700 transition-colors"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-zinc-100 font-medium truncate">
                                <span className="text-zinc-600">
                                  #P0{subtask.id}
                                </span>{" "}
                                {subtask.name}
                              </p>

                              <div className="flex flex-wrap gap-2 mt-2">
                                <Badge
                                  label={subtask.state}
                                  className={stateStyles[subtask.state]}
                                />
                                <Badge
                                  label={subtask.priority}
                                  className={priorityStyles[subtask.priority]}
                                />
                                <Badge
                                  label={subtask.workload}
                                  className={workloadStyles[subtask.workload]}
                                />
                              </div>

                              <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3">
                                <div>
                                  <p className="text-[10px] uppercase tracking-wide text-zinc-500 font-medium">
                                    Assigned to
                                  </p>
                                  <p className="text-sm text-zinc-100 mt-0.5">
                                    {subtask.assigned_to_name ?? (
                                      <span className="text-zinc-600 italic">
                                        Unassigned
                                      </span>
                                    )}
                                  </p>
                                </div>

                                {isAdmin && (
                                  <div>
                                    <p className="text-[10px] uppercase tracking-wide text-zinc-500 font-medium">
                                      Meant to assign
                                    </p>
                                    <p className="text-sm text-zinc-100 mt-0.5">
                                      {subtask.meant_to_assign_name ?? (
                                        <span className="text-zinc-600 italic">
                                          Unassigned
                                        </span>
                                      )}
                                    </p>
                                  </div>
                                )}

                                <div>
                                  <p className="text-[10px] uppercase tracking-wide text-zinc-500 font-medium">
                                    RevShare
                                  </p>
                                  <p className="text-sm text-emerald-400 font-semibold mt-0.5">
                                    {subtask.share.toFixed(2)}%
                                  </p>
                                </div>

                                {subtask.state === "done" &&
                                  subtask.finish_date && (
                                    <div>
                                      <p className="text-[10px] uppercase tracking-wide text-zinc-500 font-medium">
                                        Finished
                                      </p>
                                      <p className="text-sm text-zinc-100 mt-0.5">
                                        {subtask.finish_date}
                                      </p>
                                    </div>
                                  )}
                              </div>

                              {subtask.notes && (
                                <p className="wrap-break-words text-sm text-zinc-300 bg-zinc-900/50 rounded-lg px-3 py-2 mt-3 border border-zinc-800">
                                  {subtask.notes}
                                </p>
                              )}

                              {isAdmin && (
                                <button
                                  onClick={() => {
                                    setEditingSubtask(subtask);
                                    setOpenEditSubtask(true);
                                  }}
                                  className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-zinc-700/60 px-3 py-1.5 text-xs font-medium cursor-pointer hover:bg-zinc-600 transition-colors"
                                >
                                  <Pencil className="h-3 w-3" />
                                  Edit
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {isAdmin && (
                    <div className="mt-4 ml-2 flex gap-2">
                      <button
                        onClick={() => {
                          setActiveTaskId(task.id ?? null);
                          setOpenSubtask(true);
                        }}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-green-600 px-4 py-2 text-sm font-medium cursor-pointer hover:bg-green-500 transition-colors"
                      >
                        <ListPlus className="h-4 w-4" />
                        New Subtask
                      </button>

                      <button
                        onClick={() => {
                          setEditingTask(task);
                          setOpenEdit(true);
                        }}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-zinc-700 px-4 py-2 text-sm font-medium cursor-pointer hover:bg-zinc-600 transition-colors"
                      >
                        <Pencil className="h-4 w-4" />
                        Edit Task
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modales fuera del .map, montados una sola vez */}
      {openSubtask && (
        <CreateSubtaskModal
          open={openSubtask}
          onClose={() => setOpenSubtask(false)}
          onCreated={() => refetch()}
          taskId={activeTaskId}
          priorities={priorities}
          states={states}
          workloads={workloads}
        />
      )}

      <EditSubtaskModal
        key={editingSubtask?.id}
        open={openEditSubtask}
        onClose={() => setOpenEditSubtask(false)}
        onUpdated={() => refetch()}
        subtask={editingSubtask}
        priorities={priorities}
        states={states}
        workloads={workloads}
        employees={employees}
      />

      <EditTaskModal
        key={editingTask?.id}
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        onUpdated={() => refetch()}
        task={editingTask}
        priorities={priorities}
        states={states}
        workloads={workloads}
        employees={employees}
        roles={roles}
      />
    </div>
  );
}
