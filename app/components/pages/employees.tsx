"use client";
import { Employee, Role } from "@/types/TypesDB";
import { User, X } from "lucide-react";
import { useState, useEffect, useCallback } from "react";

export default function Employees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [createModal, setCreateModal] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [roleId, setRoleId] = useState(0);

  const getEmployees = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/employees");
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Error al cargar empleados");
        return;
      }
      const data = await res.json();
      setEmployees(data);
    } catch {
      setError("Error al cargar empleados");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleAddEmployee = useCallback(async () => {
    const res = await fetch("/api/employees", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, role_id: roleId }),
    });
    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Error al agregar empleado");
      return;
    }
    const data = await res.json();
    setEmployees(data);
    setName("");
    setEmail("");
    setRoleId(0);
    getEmployees();
  }, [name, email, roleId]);

  useEffect(() => {
    let ignore = false;

    async function load() {
      try {
        const res = await fetch("/api/employees");
        if (!res.ok) {
          const data = await res.json();
          if (!ignore) setError(data.error || "Error al cargar empleados");
          return;
        }
        const data = await res.json();
        if (!ignore) setEmployees(data);
      } catch {
        if (!ignore) setError("Error al cargar empleados");
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    async function load_roles() {
      try {
        const res = await fetch("/api/roles");
        if (!res.ok) {
          const data = await res.json();
          if (!ignore) setError(data.error || "Error al cargar roles");
          return;
        }
        const data = await res.json();
        if (!ignore) setRoles(data);
      } catch {
        if (!ignore) setError("Error al cargar roles");
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    load();
    load_roles();
    return () => {
      ignore = true;
    };
  }, []);

  const activeCount = Array.isArray(employees)
    ? employees.filter((e) => e.active).length
    : 0;

  return (
    <div className="h-full flex flex-col text-zinc-200 p-8">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2 text-sm text-zinc-500">
          <span>Rhon Studios</span>
          <span>/</span>
          <span className="text-zinc-300">Employees</span>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => setCreateModal(true)}
            className="rounded-xl border border-zinc-700 bg-green-500/60 px-4 py-2 text-sm text-zinc-200 hover:bg-green-700/60 transition-colors duration-150 cursor-pointer"
          >
            Add Employee
          </button>
          <button
            onClick={getEmployees}
            className="rounded-xl border border-zinc-700 bg-zinc-800/60 px-4 py-2 text-sm text-zinc-200 hover:bg-zinc-700/60 transition-colors duration-150 cursor-pointer"
          >
            Refresh
          </button>
        </div>
      </div>
      {createModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-[500px] rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
            <div className="flex items-start justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-2">
                  <User className="h-4 w-4 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-white font-semibold text-[15px]">
                    New Employee
                  </h2>
                  <p className="text-zinc-500 text-xs mt-0.5">
                    Create a new employee account.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setCreateModal(false)}
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
                  name="name"
                  id="name"
                  placeholder="Employee name"
                  className="w-full rounded-xl bg-zinc-800 px-4 py-2 text-zinc-200"
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div>
                <label className="mb-1 block text-xs text-zinc-500">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="employee@email.com"
                  className="w-full rounded-xl bg-zinc-800 px-4 py-2 text-zinc-200"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label className="mb-1 block text-xs text-zinc-500">Role</label>
                <select
                  name="roleId"
                  id="roleId"
                  className="w-full rounded-xl bg-zinc-800 px-4 py-2 text-zinc-200"
                  defaultValue="0"
                  onChange={(e) => setRoleId(Number(e.target.value))}
                >
                  <option disabled value="0">
                    Select role
                  </option>
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setCreateModal(false)}
                className="rounded-xl bg-zinc-700 px-4 py-2 text-sm font-medium cursor-pointer hover:bg-zinc-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddEmployee}
                className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium cursor-pointer hover:bg-emerald-500 transition-colors"
              >
                <User className="h-4 w-4" />
                Add Employee
              </button>
            </div>
          </div>
        </div>
      )}

      <h1 className="text-3xl font-semibold text-white mt-3">Employees</h1>
      <p className="text-zinc-500 text-sm mt-1">
        {loading
          ? "Loading your team…"
          : `${activeCount} active of ${employees.length} total`}
      </p>

      <div className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900/60 overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-800">
          <h2 className="text-base font-medium text-white">All employees</h2>
          <p className="text-zinc-500 text-xs mt-0.5">
            Everyone with access to Rhon Studios OS.
          </p>
        </div>

        <div className="grid grid-cols-[2rem_1.5fr_1.5fr_1fr_5rem] px-6 py-3 text-xs uppercase tracking-wide text-zinc-500 border-b border-zinc-800/80">
          <span></span>
          <span>Name</span>
          <span>Email</span>
          <span>Role</span>
          <span className="text-right">Status</span>
        </div>

        {error && <div className="px-6 py-8 text-sm text-red-400">{error}</div>}

        {!error && loading && (
          <div className="divide-y divide-zinc-800/60">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="grid grid-cols-[2rem_1.5fr_1.5fr_1fr_5rem] items-center px-6 py-4 animate-pulse"
              >
                <span className="h-2 w-2 rounded-full bg-zinc-700" />
                <span className="h-3 w-32 rounded bg-zinc-700" />
                <span className="h-3 w-40 rounded bg-zinc-800" />
                <span className="h-3 w-20 rounded bg-zinc-800" />
                <span className="h-3 w-12 rounded bg-zinc-800 justify-self-end" />
              </div>
            ))}
          </div>
        )}

        {!error && !loading && employees.length === 0 && (
          <div className="px-6 py-12 text-center">
            <p className="text-zinc-400 text-sm">No employees yet.</p>
            <p className="text-zinc-600 text-xs mt-1">
              People you add to the team will show up here.
            </p>
          </div>
        )}

        {!error && !loading && employees.length > 0 && (
          <ul className="divide-y divide-zinc-800/60 max-h-[90%] overflow-y-auto">
            {employees.map((employee) => (
              <li
                key={employee.id}
                className="grid grid-cols-[2rem_1.5fr_1.5fr_1fr_5rem] items-center px-6 py-4 hover:bg-zinc-800/40 transition-colors duration-150 cursor-pointer"
              >
                <span
                  className={`h-2 w-2 rounded-full ${
                    employee.active ? "bg-emerald-400" : "bg-zinc-600"
                  }`}
                />
                <span className="text-sm text-zinc-100">{employee.name}</span>
                <span className="text-sm text-zinc-500">{employee.email}</span>
                <span className="text-sm text-zinc-400 flex items-center gap-1.5">
                  {employee.role_name ?? "—"}
                  {employee.is_admin && (
                    <span className="text-[10px] uppercase tracking-wide bg-zinc-700 text-zinc-200 px-1.5 py-0.5 rounded-md">
                      Admin
                    </span>
                  )}
                </span>
                <span className="text-right text-xs">
                  <span
                    className={
                      employee.active ? "text-emerald-400" : "text-zinc-500"
                    }
                  >
                    {employee.active ? "Active" : "Inactive"}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
