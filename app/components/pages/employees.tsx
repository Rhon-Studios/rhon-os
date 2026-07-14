"use client";
import { Employee, Role } from "@/types/TypesDB";
import { User, X, Filter } from "lucide-react";
import { useState, useMemo } from "react";
import { EditEmployeeModal } from "../modals/editEmployee";
import { useAddEmployee, useEmployees, useRoles } from "@/app/hooks/useAppData";

export default function Employees() {
  const [createModal, setCreateModal] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [roleId, setRoleId] = useState(0);
  const [addError, setAddError] = useState<string | null>(null);

  const [editModal, setEditModal] = useState(false);
  const [employee, setEmployee] = useState<Employee | null>(null);

  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [projectFilter, setProjectFilter] = useState<string>("all");

  const {
    data: employees = [],
    isLoading: loading,
    error: employeesError,
    refetch,
  } = useEmployees();
  const { data: roles = [] } = useRoles();
  const addEmployee = useAddEmployee();

  const handleAddEmployee = () => {
    setAddError(null);
    addEmployee.mutate(
      { name, email, role_id: roleId } as Employee,
      {
        onSuccess: () => {
          setName("");
          setEmail("");
          setRoleId(0);
          setCreateModal(false);
        },
        onError: (err: Error) => setAddError(err.message),
      }
    );
  };

  const activeCount = employees.filter((e: Employee) => e.active).length;

  const projectStyles: Record<string, string> = {
    afterlight: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    tonkori: "bg-pink-500/10 text-pink-400 border-pink-500/20",
    tinycare: "bg-zinc-200/10 text-zinc-100 border-zinc-400/30",
    "the observer": "bg-blue-500/10 text-blue-400 border-blue-500/20",
    "rhon studios": "bg-black/20 text-white border-zinc-400/30",
  };

  const rolesInUse = useMemo(() => {
    const names = new Set(
      employees.map((e: Employee) => e.role_name).filter((r: string | undefined): r is string => !!r),
    );
    return roles.filter((r: Role) => names.has(r.name));
  }, [employees, roles]);

  const projectsInUse = useMemo(() => {
    const names = new Set<string>();
    employees.forEach((e: Employee) => {
      e.projects?.forEach((p) => names.add(p));
    });
    return Array.from(names).sort();
  }, [employees]);

  const filteredEmployees = useMemo(() => {
    return employees.filter((e: Employee) => {
      const roleMatch =
        roleFilter === "all"
          ? true
          : roleFilter === "none"
            ? !e.role_name
            : e.role_name === roleFilter;

      const projectMatch =
        projectFilter === "all"
          ? true
          : projectFilter === "none"
            ? !e.projects?.length
            : e.projects?.includes(projectFilter);

      return roleMatch && projectMatch;
    });
  }, [employees, roleFilter, projectFilter]);

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
            onClick={() => refetch()}
            className="rounded-xl border border-zinc-700 bg-zinc-800/60 px-4 py-2 text-sm text-zinc-200 hover:bg-zinc-700/60 transition-colors duration-150 cursor-pointer"
          >
            Refresh
          </button>
        </div>
      </div>

      {createModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-125 rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
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
                  value={name}
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label className="mb-1 block text-xs text-zinc-500">Role</label>
                <select
                  name="roleId"
                  id="roleId"
                  className="w-full rounded-xl bg-zinc-800 px-4 py-2 text-zinc-200"
                  value={roleId}
                  onChange={(e) => setRoleId(Number(e.target.value))}
                >
                  <option disabled value="0">
                    Select role
                  </option>
                  {roles.map((role: Role) => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </div>

              {addError && (
                <p className="text-xs text-red-400">{addError}</p>
              )}
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
                disabled={addEmployee.isPending}
                className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium cursor-pointer hover:bg-emerald-500 transition-colors disabled:opacity-50"
              >
                <User className="h-4 w-4" />
                {addEmployee.isPending ? "Adding..." : "Add Employee"}
              </button>
            </div>
          </div>
        </div>
      )}

      <h1 className="text-3xl font-semibold text-white mt-3">Employees</h1>
      <p className="text-zinc-500 text-sm mt-1">
        {loading
          ? "Loading your team…"
          : `${filteredEmployees.length} of ${employees.length} shown · ${activeCount} active`}
      </p>

      {/* Filtro por Role */}
      {!loading && employees.length > 0 && (
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
                  : "bg-zinc-800/60 text-zinc-400 border-zinc-700 hover:bg-zinc-700/60"
              }`}
            >
              {r.name}
            </button>
          ))}

          {employees.some((e: Employee) => !e.role_name) && (
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
        </div>
      )}

      {!loading && employees.length > 0 && projectsInUse.length > 0 && (
        <div className="mt-3 flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1.5 text-xs text-zinc-500 mr-1">
            <Filter className="h-3.5 w-3.5" />
            Project
          </span>

          <button
            onClick={() => setProjectFilter("all")}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
              projectFilter === "all"
                ? "bg-zinc-200 text-zinc-900 border-zinc-200"
                : "bg-zinc-800/60 text-zinc-400 border-zinc-700 hover:bg-zinc-700/60"
            }`}
          >
            All
          </button>

          {projectsInUse.map((p) => (
            <button
              key={p}
              onClick={() => setProjectFilter(p)}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer capitalize ${
                projectFilter === p
                  ? "bg-zinc-200 text-zinc-900 border-zinc-200"
                  : `${projectStyles[p.toLowerCase()] ?? "bg-zinc-800/60 text-zinc-400 border-zinc-700"} hover:brightness-125`
              }`}
            >
              {p}
            </button>
          ))}

          {employees.some((e: Employee) => !e.projects?.length) && (
            <button
              onClick={() => setProjectFilter("none")}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                projectFilter === "none"
                  ? "bg-zinc-200 text-zinc-900 border-zinc-200"
                  : "bg-zinc-800/60 text-zinc-400 border-zinc-700 hover:bg-zinc-700/60"
              }`}
            >
              No project
            </button>
          )}
        </div>
      )}

      {(roleFilter !== "all" || projectFilter !== "all") && (
        <button
          onClick={() => {
            setRoleFilter("all");
            setProjectFilter("all");
          }}
          className="mt-3 inline-flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-300 cursor-pointer w-fit"
        >
          <X className="h-3.5 w-3.5" />
          Clear filters
        </button>
      )}

      <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900/60 overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-800">
          <h2 className="text-base font-medium text-white">All employees</h2>
          <p className="text-zinc-500 text-xs mt-0.5">
            Everyone with access to Rhon Studios OS.
          </p>
        </div>

        <div className="grid grid-cols-[2rem_1.5fr_2fr_1fr_2fr_100px_90px_80px] px-6 py-3 text-xs uppercase tracking-wide text-zinc-500 border-b border-zinc-800/80">
          <span></span>
          <span>Name</span>
          <span>Email</span>
          <span>Role</span>
          <span>Projects</span>
          <span>Country</span>
          <span>Gender</span>
          <span className="text-right">Status</span>
        </div>

        {employeesError && (
          <div className="px-6 py-8 text-sm text-red-400">
            {employeesError.message}
          </div>
        )}

        {!employeesError && loading && (
          <div className="divide-y divide-zinc-800/60">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="grid grid-cols-[2rem_1.5fr_2fr_1fr_2fr_100px_90px_80px] items-center px-6 py-4 animate-pulse"
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

        {!employeesError && !loading && employees.length === 0 && (
          <div className="px-6 py-12 text-center">
            <p className="text-zinc-400 text-sm">No employees yet.</p>
            <p className="text-zinc-600 text-xs mt-1">
              People you add to the team will show up here.
            </p>
          </div>
        )}

        {!employeesError &&
          !loading &&
          employees.length > 0 &&
          filteredEmployees.length === 0 && (
            <div className="px-6 py-12 text-center">
              <p className="text-zinc-400 text-sm">
                No employees match these filters.
              </p>
            </div>
          )}

        {!employeesError && !loading && filteredEmployees.length > 0 && (
          <div className="flex flex-col h-full">
            <div className="hidden lg:flex flex-col flex-1 min-h-0">
              <div className="border border-zinc-800 bg-zinc-900/60 overflow-hidden flex flex-col h-full">
                <ul className="flex-1 overflow-y-auto divide-y divide-zinc-800/60 pb-30">
                  {filteredEmployees.map((employee: Employee) => (
                    <li
                      onClick={() => {
                        setEmployee(employee);
                        setEditModal(true);
                      }}
                      key={employee.id}
                      className="grid grid-cols-[2rem_1.5fr_2fr_1fr_2fr_100px_90px_80px] items-center px-6 py-4 hover:bg-zinc-800/40 transition-colors duration-150 cursor-pointer"
                    >
                      <span
                        className={`h-2 w-2 rounded-full ${
                          employee.active ? "bg-emerald-400" : "bg-zinc-600"
                        }`}
                      />
                      <span className="text-sm text-zinc-100">
                        {employee.name}
                      </span>
                      <span className="text-sm text-zinc-500">
                        {employee.email}
                      </span>
                      <span className="text-sm text-zinc-400 flex items-center gap-1.5">
                        {employee.role_name ?? "—"}
                        {employee.is_admin && (
                          <span className="text-[10px] uppercase tracking-wide bg-zinc-700 text-zinc-200 px-1.5 py-0.5 rounded-md">
                            Admin
                          </span>
                        )}
                      </span>
                      <span className="flex flex-wrap justify-center gap-1">
                        {employee.projects?.length
                          ? employee.projects.map((project: string) => (
                              <span
                                key={project}
                                className={`px-2 py-0.5 rounded-md border text-[10px] font-medium ${
                                  projectStyles[project.toLowerCase()] ??
                                  "bg-zinc-700 text-zinc-200 border-zinc-600"
                                }`}
                              >
                                {project}
                              </span>
                            ))
                          : "—"}
                      </span>
                      <span className="text-sm text-zinc-400">
                        {employee.country ?? "—"}
                      </span>

                      <span className="text-sm text-zinc-400">
                        {employee.gender ?? "—"}
                      </span>
                      <span className="text-right text-xs">
                        <span
                          className={
                            employee.active
                              ? "text-emerald-400"
                              : "text-zinc-500"
                          }
                        >
                          {employee.active ? "Active" : "Inactive"}
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="lg:hidden flex-1 overflow-y-auto divide-y divide-zinc-800">
              {filteredEmployees.map((employee: Employee) => (
                <div
                  key={employee.id}
                  onClick={() => {
                    setEmployee(employee);
                    setEditModal(true);
                  }}
                  className="p-4 space-y-3 cursor-pointer hover:bg-zinc-800/40"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-white font-medium">
                        {employee.name}
                      </h3>
                      <p className="text-sm text-zinc-500 break-all">
                        {employee.email}
                      </p>
                    </div>

                    <span
                      className={`text-xs ${
                        employee.active ? "text-emerald-400" : "text-zinc-500"
                      }`}
                    >
                      {employee.active ? "Active" : "Inactive"}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {employee.role_name && (
                      <span className="rounded-md border border-zinc-700 px-2 py-1 text-xs">
                        {employee.role_name}
                      </span>
                    )}

                    {employee.is_admin && (
                      <span className="rounded-md bg-zinc-700 px-2 py-1 text-xs">
                        Admin
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {employee.projects?.map((project) => (
                      <span
                        key={project}
                        className={`px-2 py-1 rounded-md border text-[10px] ${
                          projectStyles[project.toLowerCase()] ??
                          "bg-zinc-700 text-zinc-200 border-zinc-600"
                        }`}
                      >
                        {project}
                      </span>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-zinc-400">
                    <div>
                      <span className="text-zinc-500">Country</span>
                      <p>{employee.country || "—"}</p>
                    </div>

                    <div>
                      <span className="text-zinc-500">Gender</span>
                      <p>{employee.gender || "—"}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {editModal && (
          <EditEmployeeModal
            open={editModal}
            employee={employee}
            onClose={() => setEditModal(false)}
            onUpdated={() => setEditModal(false)}
            roles={roles}
          />
        )}
      </div>
    </div>
  );
}