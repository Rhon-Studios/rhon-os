"use client";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/userContext";
import { useActiveView } from "@/context/activeViewContext";
import { admin_sidebar, employee_sidebar } from "@/constants/sidebar";

export default function Sidebar() {
  const { logOut, user } = useUser();
  const { activeKey, setActiveKey } = useActiveView();
  const router = useRouter();
  const isAdmin = user?.role === "admin";
  const items = isAdmin ? admin_sidebar : employee_sidebar;

  async function handleLogout() {
    await logOut();
    router.push("/");
  }

  return (
    <aside className="h-screen max-w-[10%] flex flex-col gap-5 p-4 text-white/70">
      <div>
        <h1 className="text-4xl text-white font-rye">Rhon Studios OS</h1>
      </div>
      <nav className="flex flex-col gap-4">
        <div className="w-full border border-dotted"></div>
        {items.map((item) => {
          const isActive = item.key === activeKey;
          return (
            <button
              key={item.key}
              onClick={() => setActiveKey(item.key)}
              className={`w-full text-left rounded-xl transition-colors duration-200 ease-in p-2 ${
                isActive
                  ? "bg-gray-500 text-white cursor-default"
                  : "hover:bg-blue-500 hover:text-white cursor-pointer"
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </nav>
      <button
        onClick={handleLogout}
        className="mt-auto rounded-xl hover:bg-red-500 hover:text-white transition-colors duration-200 ease-in cursor-pointer p-2 mb-10"
      >
        Log Out
      </button>
    </aside>
  );
}
