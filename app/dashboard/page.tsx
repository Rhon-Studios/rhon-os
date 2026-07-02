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
  let ActiveComponent: React.FC | undefined;
  if (activeKey === "project") {
    ActiveComponent = () => <ProjectDetails projectId={projectId!} />;
  } else {
    ActiveComponent = items.find((item) => item.key === activeKey)?.component;
  }

  return (
    <div className="flex h-screen bg-black">
      <Sidebar />
      <main className="h-[90%] w-[90%] m-10 bg-background rounded-xl">
        {ActiveComponent && <ActiveComponent />}
      </main>
    </div>
  );
}
