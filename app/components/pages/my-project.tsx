"use client";
import { useUser } from "@/context/userContext";
import { useActiveView } from "@/context/activeViewContext";
import { useProjects } from "@/app/hooks/useAppData";
import { Project } from "@/types/TypesDB";

export default function MyProjects() {
  const { user } = useUser();
  const userId = user?.userId;
  const { data: projects = [], error, isLoading, refetch } = useProjects(userId!);


  const { setActiveKey, setProjectId } = useActiveView();


  return (
    <div className="h-full flex flex-col text-zinc-200 p-8">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2 text-sm text-zinc-500">
          <span>Rhon Studios</span>
          <span>/</span>
          <span className="text-zinc-300">My Projects</span>
        </div>
        <button
          onClick={() => refetch()}
          className="rounded-xl border border-zinc-700 bg-zinc-800/60 px-4 py-2 text-sm text-zinc-200 hover:bg-zinc-700/60 transition-colors duration-150 cursor-pointer"
        >
          Refresh
        </button>
      </div>
      <h1 className="text-3xl font-semibold text-white mt-3">My Projects</h1>
      <p className="text-zinc-500 text-sm mt-1">
        {isLoading
          ? "Loading your projects…"
          : `${projects?.length} project${projects?.length === 1 ? "" : "s"} assigned to you`}
      </p>
      <div className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900/60 overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-800">
          <h2 className="text-base font-medium text-white">Your projects</h2>
          <p className="text-zinc-500 text-xs mt-0.5">
            Projects you&apos;ve been added to.
          </p>
        </div>
        <div className="grid grid-cols-[2rem_1fr_8rem] px-6 py-3 text-xs uppercase tracking-wide text-zinc-500 border-b border-zinc-800/80">
          <span></span>
          <span>Name</span>
          <span className="text-right">ID</span>
        </div>
        {error && <div className="px-6 py-8 text-sm text-red-400">{error.toString()}</div>}
        {!error && isLoading && (
          <div className="divide-y divide-zinc-800/60">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="grid grid-cols-[2rem_1fr_8rem] items-center px-6 py-4 animate-pulse"
              >
                <span className="h-3 w-3 rounded-full bg-zinc-700" />
                <span className="h-3 w-40 rounded bg-zinc-700" />
                <span className="h-3 w-10 rounded bg-zinc-800 justify-self-end" />
              </div>
            ))}
          </div>
        )}
        {!error && !isLoading && projects?.length === 0 && (
          <div className="px-6 py-12 text-center">
            <p className="text-zinc-400 text-sm">
              You&apos;re not on any project yet.
            </p>
            <p className="text-zinc-600 text-xs mt-1">
              Projects you get added to will show up here.
            </p>
          </div>
        )}
        {!error && !isLoading && projects?.length > 0 && (
          <ul className="divide-y divide-zinc-800/60">
            {projects.map((project: Project) => (
              <li
                key={project.id}
                onClick={() => {
                  setProjectId(project.id);
                  setActiveKey("project");
                }}
                className="grid grid-cols-[2rem_1fr_8rem] items-center px-6 py-4 hover:bg-zinc-800/40 transition-colors duration-150 cursor-pointer"
              >
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                <span className="text-sm text-zinc-100">{project.name}</span>
                <span className="text-right text-xs text-zinc-500 tabular-nums">
                  #{String(project.id).padStart(3, "0")}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
