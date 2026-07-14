import Dashboard from "@/app/components/pages/dashboard";
import Employees from "@/app/components/pages/employees";
import MyTasks from "@/app/components/pages/my-tasks";
import Projects from "@/app/components/pages/projects";

export const admin_sidebar = [
  { key: "dashboard", label: "Dashboard", component: Dashboard },
  { key: "projects", label: "Projects", component: Projects },
  { key: "employees", label: "Employees", component: Employees },
  { key: "my-tasks", label: "My Tasks", component: MyTasks },
];

export const employee_sidebar = [
  { key: "dashboard", label: "Dashboard", component: Dashboard },
  { key: "my-tasks", label: "My Tasks", component: MyTasks },
];
