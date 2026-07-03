export type Priority = "critic" | "high" | "medium" | "low";

export type TaskState =
  "not started" | "in progress" | "waiting" | "review" | "done" | "cancelled";

export type Workload = "low" | "low-medium" | "medium" | "medium-high" | "high";

export interface Role {
  id: number;
  name: string;
  is_admin: boolean;
}

export interface Employee {
  id: number;
  name: string;
  email: string;
  role_id: number;
  active: boolean;
  role_name?: string;
  is_admin?: boolean;
  projects?: string[];
  project_ids?: number[];
}

export interface Project {
  id: number;
  name: string;
}

export interface ProjectEmployee {
  project_id: number;
  employee_id: number;
}

export interface WorkloadWeight {
  workload: Workload;
  peso: number;
}

export interface Setting {
  key: string;
  value: number;
}

export interface Task {
  id: number;
  project_id: number;
  name: string;
  priority: Priority;
  state: TaskState;
  workload: Workload;
  finish_date?: string | null; // "YYYY-MM-DD"
  ai_used?: boolean;
  weekly?: boolean;
  notes?: string | null;
  assigned_to?: number | null;
  done_by?: number | null;
  assigned_to_name?: string | null;
  done_by_name?: string | null;
  share?: number | null;
  role_name?: string | null;
  role_id?: number | null;
  project_name?: string | null;
  is_assigned_to_you?: boolean;
  meant_to_assign?: number | null;
}

export interface Subtask {
  id: number;
  task_id: number;
  name: string;
  assigned_to: number | null;
  meant_to_assign_name: string | null;
  done_by: number | null;
  priority: Priority;
  state: TaskState;
  workload: Workload;
  finish_date: string | null;
  ai_used: boolean;
  weekly: boolean;
  notes: string | null;
  assigned_to_name?: string | null;
  done_by_name?: string | null;
  share: number;
  meant_to_assign?: number | null;
}
