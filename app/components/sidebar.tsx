"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
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

  const [mobileOpen, setMobileOpen] = useState(false);

  const userId = user?.userId;
  const { data: projects = [] } = useProjects(userId!);

  async function handleLogout() {
    await logOut();
    router.push("/");
  }

  function selectAndClose(fn: () => void) {
    fn();
    setMobileOpen(false);
  }

  return (
    <>
      {/* Mobile top bar */}
      <div className="md:hidden flex items-center justify-between bg-black text-white p-4">
        <h1 className="text-xl font-rye text-white">Rhon Studios OS</h1>
        <button
          onClick={() => setMobileOpen(true)}
          className="rounded-lg p-2 hover:bg-white/10 transition-colors cursor-pointer"
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/60"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar: drawer on mobile, static column on desktop */}
      <aside
        className={`
          fixed md:static inset-y-0 left-0 z-50
          w-64 md:w-64 shrink-0 bg-black text-white/70 p-4 flex flex-col
          transition-transform duration-200 ease-in-out
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl md:text-3xl font-rye text-white hidden md:block">
            Rhon Studios OS
          </h1>
          <button
            onClick={() => setMobileOpen(false)}
            className="md:hidden rounded-lg p-2 hover:bg-white/10 transition-colors cursor-pointer ml-auto"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="border border-dashed mb-2"></div>

        <nav className="flex flex-col gap-2 overflow-y-auto">
          {items.map((item) => {
            const isActive = item.key === activeKey;

            return (
              <button
                key={item.key}
                onClick={() => selectAndClose(() => setActiveKey(item.key))}
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
            const isActive =
              activeKey === "project" && projectId === project.id;
            return (
              <button
                key={project.id}
                onClick={() =>
                  selectAndClose(() => {
                    setProjectId(project.id);
                    setActiveKey("project");
                  })
                }
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
    </>
  );
}