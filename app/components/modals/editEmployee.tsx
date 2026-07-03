"use client";

import { Employee, Project, Role } from "@/types/TypesDB";
import { Pencil, X } from "lucide-react";
import { useEffect, useState } from "react";

export function EditEmployeeModal({
  open,
  onClose,
  onUpdated,
  employee,
  roles,
}: {
  open: boolean;
  onClose: () => void;
  onUpdated: () => void;
  employee: Employee | null;
  roles: Role[];
}) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    active: true,
    role_id: 0,
    country: "",
    timezone: "",
    gender: "",
    projectIds: [] as number[],
  });
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    fetch("/api/projects")
      .then((r) => r.json())
      .then(setProjects);
  }, []);

  useEffect(() => {
    if (!employee) return;

    setForm({
      name: employee.name,
      email: employee.email,
      active: employee.active,
      role_id: employee.role_id,
      projectIds: employee.project_ids ?? [],
      country: employee.country ?? "",
      timezone: employee.timezone ?? "",
      gender: employee.gender ?? "",
    });
  }, [employee]);

  const toggleProject = (id: number) => {
    setForm((prev) => ({
      ...prev,
      projectIds: prev.projectIds.includes(id)
        ? prev.projectIds.filter((p) => p !== id)
        : [...prev.projectIds, id],
    }));
  };

  const onSave = async () => {
    if (!employee) return;

    await fetch(`/api/employees/${employee.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    onClose();
    onUpdated();
  };

  if (!open || !employee) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-[500px] rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
        <div className="mb-5 flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <div className="rounded-lg border border-blue-500/20 bg-blue-500/10 p-2">
              <Pencil className="h-4 w-4 text-blue-400" />
            </div>
            <div>
              <h2 className="text-[15px] font-semibold text-white">
                Edit Employee
              </h2>
              <p className="mt-0.5 text-xs text-zinc-500">
                Update employee information.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="cursor-pointer rounded-lg p-1.5 text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-zinc-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-xs text-zinc-500">Name</label>
            <input
              className="w-full rounded-xl bg-zinc-800 px-4 py-2 text-zinc-200"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div>
            <label className="mb-1 block text-xs text-zinc-500">Email</label>
            <input
              className="w-full rounded-xl bg-zinc-800 px-4 py-2 text-zinc-200"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-zinc-500">Country</label>
            <input
              className="w-full rounded-xl bg-zinc-800 px-4 py-2 text-zinc-200"
              value={form.country}
              onChange={(e) => setForm({ ...form, country: e.target.value })}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-zinc-500">Timezone</label>
            <input
              className="w-full rounded-xl bg-zinc-800 px-4 py-2 text-zinc-200"
              value={form.timezone}
              onChange={(e) => setForm({ ...form, timezone: e.target.value })}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-zinc-500">Gender</label>
            <select
              className="w-full rounded-xl bg-zinc-800 px-4 py-2 text-zinc-200"
              value={form.gender}
              onChange={(e) => setForm({ ...form, gender: e.target.value })}
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="na">Prefer not to say</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs text-zinc-500">Role</label>
            <select
              className="w-full rounded-xl bg-zinc-800 px-4 py-2 text-zinc-200"
              value={form.role_id}
              onChange={(e) =>
                setForm({ ...form, role_id: Number(e.target.value) })
              }
            >
              {roles.map((role_id) => (
                <option key={role_id.id} value={role_id.id}>
                  {role_id.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-xs text-zinc-500">Projects</label>

            <div className="flex flex-wrap gap-2">
              {projects.map((project) => {
                const selected = form.projectIds.includes(project.id);

                return (
                  <button
                    key={project.id}
                    type="button"
                    onClick={() => toggleProject(project.id)}
                    className={`rounded-lg border px-3 py-1 text-xs transition-colors cursor-pointer ${
                      selected
                        ? "border-emerald-500 bg-emerald-500/20 text-emerald-300"
                        : "border-zinc-700 bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                    }`}
                  >
                    {project.name}
                  </button>
                );
              })}
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm text-zinc-300">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) => setForm({ ...form, active: e.target.checked })}
            />
            Active
          </label>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="cursor-pointer rounded-xl bg-zinc-700 px-4 py-2 text-sm font-medium transition-colors hover:bg-zinc-600"
          >
            Cancel
          </button>

          <button
            onClick={onSave}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium transition-colors hover:bg-blue-500"
          >
            <Pencil className="h-4 w-4" />
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
