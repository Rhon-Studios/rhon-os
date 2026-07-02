"use client";

import { useState, useEffect, useCallback } from "react";
import { Task, Subtask } from "@/types/TypesDB";
import { CreateTaskModal } from "./modals/createTask";
import { CreateSubtaskModal } from "./modals/createSubtask";
import { EditTaskModal } from "./modals/editTask";
import { EditSubtaskModal } from "./modals/editSubtask";

export function ProjectDetails({ projectId }: { projectId: number }) {
  const [openCreate, setOpenCreate] = useState(false);
  const [openSubtask, setOpenSubtask] = useState(false);
  const [activeTaskId, setActiveTaskId] = useState<number | null>(null);

  const [openEditSubtask, setOpenEditSubtask] = useState(false);
  const [editingSubtask, setEditingSubtask] = useState<Subtask | null>(null);

  const [openEdit, setOpenEdit] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const [tasks, setTasks] = useState<Task[]>([]);
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [projectName, setProjectName] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [employees, setEmployees] = useState<{ id: number; name: string }[]>(
    [],
  );
  const [roles, setRoles] = useState<{ id: number; name: string }[]>([]);

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

  const getTasks = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/tasks?projectId=${projectId}`);

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Error loading tasks");
        return;
      }

      const data = await res.json();
      setTasks(data.tasks);
      setSubtasks(data.subtasks);
      setProjectName(data.project);
      setIsAdmin(data.isAdmin);
      setEmployees(data.employeesInProyect ?? []);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    let ignore = false;

    async function load() {
      try {
        const res = await fetch(`/api/tasks?projectId=${projectId}`);

        if (!res.ok) {
          const data = await res.json();
          if (!ignore) setError(data.error || "Error loading tasks");
          return;
        }

        const data = await res.json();

        if (!ignore) {
          setTasks(data.tasks);
          setSubtasks(data.subtasks);
          setProjectName(data.projectName);
          setIsAdmin(data.isAdmin);
          setEmployees(data.employeesInProyect ?? []);
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    load();

    fetch("/api/roles")
      .then((res) => res.json())
      .then(setRoles);
    return () => {
      ignore = true;
    };
  }, [projectId]);

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

  const roleStyles: Record<string, string> = {
    Programmer: "text-blue-400",
    Artist: "text-purple-400",
    Designer: "text-pink-400",
    Writer: "text-emerald-400",
    "Sound designer": "text-yellow-400",
    Marketing: "text-orange-400",
    "QA Tester": "text-red-400",
    Producer: "text-cyan-400",
    Founder: "text-zinc-200 font-semibold",
    "Voice actor": "text-indigo-400",
    RRHH: "text-teal-400",
  };
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
                className="rounded-xl bg-emerald-600 px-4 py-2 text-sm cursor-pointer hover:bg-emerald-500"
              >
                New Task
              </button>

              {openCreate && (
                <CreateTaskModal
                  open={openCreate}
                  onClose={() => setOpenCreate(false)}
                  onCreated={getTasks}
                  projectId={projectId}
                  priorities={priorities}
                  states={states}
                  workloads={workloads}
                />
              )}
            </>
          )}

          <button
            onClick={getTasks}
            className="rounded-xl border cursor-pointer border-zinc-700 bg-zinc-800/60 px-4 py-2 text-sm text-zinc-200 transition-colors duration-150 hover:bg-zinc-700/60"
          >
            Refresh
          </button>
        </div>
      </div>

      <h1 className="text-3xl font-semibold text-white mt-3">
        Project {projectName}
      </h1>

      <p className="text-zinc-500 text-sm mt-1">
        {loading
          ? "Loading tasks..."
          : `${tasks.length} task${tasks.length === 1 ? "" : "s"}`}
      </p>

      <div className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900/60 max-h-[600px] overflow-y-auto">
        <div className="px-6 py-4 border-b border-zinc-800">
          <h2 className="text-base font-medium text-white">Tasks</h2>
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

        {!error && !loading && tasks.length > 0 && (
          <div className="divide-y divide-zinc-800/60">
            {tasks.map((task) => (
              <div key={task.id} className="px-6 py-5">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-white font-medium">{task.name}</h3>

                    <div className="flex flex-wrap gap-5 text-xs mt-2">
                      <span className="text-zinc-400">
                        State:{" "}
                        <span className={stateStyles[task.state]}>
                          {task.state}
                        </span>
                      </span>

                      <span className="text-zinc-400">
                        Priority:{" "}
                        <span className={priorityStyles[task.priority]}>
                          {task.priority}
                        </span>
                      </span>

                      <span className="text-zinc-400">
                        Workload:{" "}
                        <span className={workloadStyles[task.workload]}>
                          {task.workload}
                        </span>
                      </span>

                      <span className="text-zinc-400">
                        Role:{" "}
                        <span className={roleStyles[task.role_name ?? ""]}>
                          {task.role_name}
                        </span>
                      </span>
                    </div>

                    <div className="mt-4 grid gap-1 text-sm">
                      <p>
                        <span className="text-zinc-500">Assigned to:</span>{" "}
                        <span className="text-zinc-300">
                          {task.assigned_to_name ?? "Unassigned"}
                        </span>
                      </p>
                      <p>
                        <span className="text-zinc-500">RevShare:</span>{" "}
                        <span className="text-emerald-400 font-medium">
                          {task.share?.toFixed(2)}%
                        </span>
                      </p>

                      {task.state === "done" && task.finish_date && (
                        <p>
                          <span className="text-zinc-500">Finished:</span>{" "}
                          <span className="text-zinc-300">
                            {task.finish_date}
                          </span>
                        </p>
                      )}

                      {task.notes && (
                        <p className="wrap-break-words">
                          <span className="text-zinc-500">Notes:</span>{" "}
                          <span className="text-zinc-300">{task.notes}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <span className="ml-6 text-xs text-zinc-500">
                    #{String(task.id).padStart(3, "0")}
                  </span>
                </div>

                <ul className="mt-5 ml-5 space-y-3">
                  {subtasks
                    .filter((subtask) => subtask.task_id === task.id)
                    .map((subtask) => (
                      <li
                        key={subtask.id}
                        className="rounded-lg bg-zinc-800/40 px-4 py-3"
                      >
                        <div className="flex items-start justify-between gap-6">
                          <div className="flex-1">
                            <p className="text-sm text-zinc-100 font-medium">
                              {subtask.name}
                            </p>

                            <div className="flex flex-wrap gap-4 text-xs mt-2">
                              <span className={stateStyles[subtask.state]}>
                                {subtask.state}
                              </span>

                              <span
                                className={priorityStyles[subtask.priority]}
                              >
                                {subtask.priority}
                              </span>

                              <span
                                className={workloadStyles[subtask.workload]}
                              >
                                {subtask.workload}
                              </span>
                            </div>

                            <div className="mt-3 space-y-1 text-xs text-zinc-400">
                              <p>
                                <span className="text-zinc-500">
                                  Assigned to:
                                </span>{" "}
                                {subtask.assigned_to_name ?? "Unassigned"}
                              </p>
                              <p>
                                <span className="text-zinc-500">RevShare:</span>{" "}
                                <span className="text-emerald-400">
                                  {subtask.share.toFixed(2)}%
                                </span>
                              </p>
                              {subtask.state === "done" &&
                                subtask.finish_date && (
                                  <p>
                                    <span className="text-zinc-500">
                                      Finished:
                                    </span>{" "}
                                    {subtask.finish_date}
                                  </p>
                                )}

                              {subtask.notes && (
                                <p className="break-words">
                                  <span className="text-zinc-500">Notes:</span>{" "}
                                  {subtask.notes}
                                </p>
                              )}
                            </div>
                            <div>
                              {isAdmin && (
                                <button
                                  onClick={() => {
                                    setEditingSubtask(subtask);
                                    setOpenEditSubtask(true);
                                  }}
                                  className="mt-2 rounded-lg bg-zinc-700 px-3 py-1 text-xs cursor-pointer hover:bg-zinc-600"
                                >
                                  Edit
                                </button>
                              )}
                              <EditSubtaskModal
                                key={editingSubtask?.id}
                                open={openEditSubtask}
                                onClose={() => setOpenEditSubtask(false)}
                                onUpdated={getTasks}
                                subtask={editingSubtask}
                                priorities={priorities}
                                states={states}
                                workloads={workloads}
                                employees={employees}
                              />
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}

                  {subtasks.filter((s) => s.task_id === task.id).length ===
                    0 && (
                    <li className="text-xs text-zinc-600">No subtasks.</li>
                  )}
                </ul>

                {isAdmin && (
                  <>
                    <button
                      onClick={() => {
                        setActiveTaskId(task.id ?? null);
                        setOpenSubtask(true);
                      }}
                      className="mt-3 rounded-xl bg-green-600 px-4 py-2 text-sm cursor-pointer hover:bg-green-500"
                    >
                      New Subtask
                    </button>

                    {openSubtask && (
                      <CreateSubtaskModal
                        open={openSubtask}
                        onClose={() => setOpenSubtask(false)}
                        onCreated={getTasks}
                        taskId={activeTaskId}
                        priorities={priorities}
                        states={states}
                        workloads={workloads}
                      />
                    )}
                    <button
                      onClick={() => {
                        setEditingTask(task);
                        setOpenEdit(true);
                      }}
                      className="mt-3 ml-2 rounded-xl bg-zinc-700 px-4 py-2 text-sm cursor-pointer hover:bg-zinc-600"
                    >
                      Edit Task
                    </button>
                    <EditTaskModal
                      key={editingTask?.id}
                      open={openEdit}
                      onClose={() => setOpenEdit(false)}
                      onUpdated={getTasks}
                      task={editingTask}
                      priorities={priorities}
                      states={states}
                      workloads={workloads}
                      employees={employees}
                      roles={roles}
                    />
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
