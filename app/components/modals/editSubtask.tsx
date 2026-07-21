"use client";
import { useState } from "react";
import { Subtask } from "@/types/TypesDB";
import { Pencil, X, Save, Calendar } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { parseDateString, toDateString } from "@/app/lib/dates";

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
    meant_to_assign: number | null;
    done_by: number | null;
    notes: string;
    finish_date: Date | null;
  }>(() => ({
    name: subtask?.name ?? "",
    priority: subtask?.priority ?? "medium",
    state: subtask?.state ?? "not started",
    workload: subtask?.workload ?? "medium",
    assigned_to: subtask?.assigned_to ?? null,
    meant_to_assign: subtask?.meant_to_assign ?? null,
    done_by: subtask?.done_by ?? null,
    notes: subtask?.notes ?? "",
    finish_date: parseDateString(subtask?.finish_date),
  }));

  const onEditSubtask = async () => {
    if (!subtask) return;

    await fetch(`/api/subtasks/${subtask.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...editSubtask,
        finish_date: toDateString(editSubtask.finish_date),
      }),
    });

    onClose();
    onUpdated();
  };

  if (!open || !subtask) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-[500px] rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="rounded-lg bg-zinc-700/60 border border-zinc-600/40 p-2">
              <Pencil className="h-4 w-4 text-zinc-300" />
            </div>
            <div>
              <h2 className="text-white font-semibold text-[15px]">
                Edit Subtask
              </h2>
              <p className="text-zinc-500 text-xs mt-0.5">{subtask.name}</p>
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

          {editSubtask.state === "done" && (
            <div>
              <label className="mb-1 flex items-center gap-1.5 text-xs text-zinc-500">
                <Calendar className="h-3.5 w-3.5" />
                Finish date
              </label>
              <DatePicker
                selected={editSubtask.finish_date}
                onChange={(date: Date | null) =>
                  setEditSubtask({ ...editSubtask, finish_date: date })
                }
                dateFormat="MMM d, yyyy"
                placeholderText="Select a date"
                isClearable
                showTimeSelect={false}
                className="w-full rounded-xl bg-zinc-800 px-4 py-2 text-zinc-200 outline-none"
                wrapperClassName="w-full"
                popperClassName="rhon-datepicker"
                calendarClassName="rhon-datepicker-calendar"
              />
            </div>
          )}

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
            <label className="mb-1 block text-xs text-zinc-500">
              Meant to assign
            </label>
            <select
              value={editSubtask.meant_to_assign ?? ""}
              onChange={(e) =>
                setEditSubtask({
                  ...editSubtask,
                  meant_to_assign: e.target.value
                    ? Number(e.target.value)
                    : null,
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
            <label className="mb-1 block text-xs text-zinc-500">Done by</label>
            <select
              value={editSubtask.done_by ?? ""}
              onChange={(e) =>
                setEditSubtask({
                  ...editSubtask,
                  done_by: e.target.value ? Number(e.target.value) : null,
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
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            className="rounded-xl bg-zinc-700 px-4 py-2 text-sm font-medium cursor-pointer hover:bg-zinc-600 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onEditSubtask}
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium cursor-pointer hover:bg-emerald-500 transition-colors"
          >
            <Save className="h-4 w-4" />
            Save
          </button>
        </div>
      </div>
    </div>
  );
}