"use client";
import Sidebar from "../components/sidebar";
import { useUser } from "@/context/userContext";
import { useActiveView } from "@/context/activeViewContext";
import { admin_sidebar, employee_sidebar } from "@/constants/sidebar";
import { ProjectDetails } from "../components/ProjectDetails";

export default function DashboardPage() {
  const { user } = useUser();
  const { activeKey, projectId } = useActiveView();
  const isAdmin = user?.role === "admin";
  const items = isAdmin ? admin_sidebar : employee_sidebar;
  const ActiveComponent =
    activeKey === "project"
      ? undefined
      : items.find((item) => item.key === activeKey)?.component;

  return (
    <div className="flex flex-col md:flex-row h-screen bg-black">
      <Sidebar />

      <main className="flex-1 m-2 md:m-6 lg:m-10 rounded-xl bg-background overflow-auto">
        {activeKey === "project" ? (
          <ProjectDetails projectId={projectId!} />
        ) : (
          ActiveComponent && <ActiveComponent />
        )}
      </main>
    </div>
  );
}
