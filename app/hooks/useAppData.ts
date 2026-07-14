import { Employee } from "@/types/TypesDB";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useRoles() {
  return useQuery({
    queryKey: ["roles"],
    queryFn: () => fetch("/api/roles").then((r) => r.json()),
  });
}

export function useProjects(employeeId?: number) {
  return useQuery({
    queryKey: ["projects", employeeId],
    queryFn: async () => {
      const res = await fetch(
        employeeId !== undefined
          ? `/api/projects?employeeId=${employeeId}`
          : "/api/projects"
      );

      return res.json();
    },
    staleTime: 0,
    refetchOnMount: true,
  });
}


export function useProjectTasks(projectId: number) {
  return useQuery({
    queryKey: ["tasks", projectId],
    queryFn: () => fetch(`/api/tasks?projectId=${projectId}`).then((r) => r.json()),
    enabled: !!projectId,
  });
}

export function useMyTasks(MyTasks: boolean) {
  return useQuery({
    queryKey: ["tasks", MyTasks],
    queryFn: () => fetch(`/api/tasks?myTasksOnly=${MyTasks}`).then((r) => r.json()),
    enabled: MyTasks !== undefined,
  });
}
  
export function useEmployees() {
  return useQuery({
    queryKey: ["employees"],
    queryFn: async () => {
      const res = await fetch("/api/employees");
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Error al cargar empleados");
      }
      return res.json();
    },
  });
}


export function useAddEmployee() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (form: Employee) =>{
      const res = await fetch("/api/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to add employee");
      }
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["employees"] });
    },
  });
}

export function useDeleteEmployee() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/employees/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to delete employee");
      }
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["employees"] });
    },
  });
}

export function useUpdateEmployee() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({  form }: {  form: Employee }) =>
      fetch(`/api/employees/${form.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["employees"] });
    },
  });
}

export function useRevshare() {
  return useQuery({
    queryKey: ["revshare"],
    queryFn: () => fetch("/api/revshare").then((r) => r.json()),
  });
}