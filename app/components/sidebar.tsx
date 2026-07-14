"use client";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/userContext";
import { useActiveView } from "@/context/activeViewContext";
import { admin_sidebar, employee_sidebar } from "@/constants/sidebar";
import { useProjects } from "../hooks/useAppData";
import { Project } from "@/types/TypesDB";

export default function Sidebar() {
  const { logOut, user } = useUser();
  const { activeKey, setActiveKey, setProjectId, projectId } = useActiveView();
  const router = useRouter();
  const isAdmin = user?.role === "admin";
  const items = isAdmin ? admin_sidebar : employee_sidebar;

  


    const userId = user?.userId;
    const { data: projects = [] } = useProjects(userId!);

  async function handleLogout() {
    await logOut();
    router.push("/");
  }

  return (
    <aside className="w-full md:w-64 shrink-0 bg-black text-white/70 p-4 flex flex-col">
      <h1 className="text-2xl md:text-3xl font-rye text-white mb-6">
        Rhon Studios OS
      </h1>
      <div className="border border-dashed mb-2"></div>

      <nav className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible">
        {items.map((item) => {
          const isActive = item.key === activeKey;

          return (
            <button
              key={item.key}
              onClick={() => setActiveKey(item.key)}
              className={`whitespace-nowrap rounded-xl p-2 text-left transition-colors ${
                isActive
                  ? "bg-gray-500 text-white"
                  : "hover:bg-blue-500 hover:text-white cursor-pointer"
              }`}
            >
              {item.label}
            </button>
          );
        })}

        {projects.map((project: Project) => {
          const isActive = activeKey === "project" && projectId === project.id;
          return (
            <button
              key={project.id}
              onClick={() => {
                setProjectId(project.id);
                setActiveKey("project");
              }}
              className={`whitespace-nowrap rounded-xl p-2 text-left transition-colors ${
                isActive
                  ? "bg-gray-500 text-white"
                  : "hover:bg-blue-500 hover:text-white cursor-pointer"
              }`}
            >
              {project.name}
            </button>
          );
        })}

      </nav>

      <button
        onClick={handleLogout}
        className="mt-4 md:mt-auto rounded-xl p-2 hover:bg-red-500 hover:text-white transition-colors cursor-pointer"
      >
        Log Out
      </button>
    </aside>
  );
}
