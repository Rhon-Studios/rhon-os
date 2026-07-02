"use client";
import { useActiveView } from "@/context/activeViewContext";
import { Project } from "@/types/TypesDB";
import { useState, useEffect, useCallback } from "react";

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const { setActiveKey, setProjectId } = useActiveView();

  const getProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/projects");
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Error al cargar proyectos");
        return;
      }
      const data = await res.json();
      setProjects(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;

    async function load() {
      try {
        const res = await fetch("/api/projects");
        if (!res.ok) {
          const data = await res.json();
          if (!ignore) setError(data.error || "Error al cargar proyectos");
          return;
        }
        const data = await res.json();
        if (!ignore) setProjects(data);
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    load();
    return () => {
      ignore = true;
    };
  }, []);

  return (
    <div className="h-full flex flex-col text-zinc-200 p-8">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2 text-sm text-zinc-500">
          <span>Rhon Studios</span>
          <span>/</span>
          <span className="text-zinc-300">Projects</span>
        </div>
        <button
          onClick={getProjects}
          className="rounded-xl border border-zinc-700 bg-zinc-800/60 px-4 py-2 text-sm text-zinc-200 hover:bg-zinc-700/60 transition-colors duration-150 cursor-pointer"
        >
          Refresh
        </button>
      </div>
      <h1 className="text-3xl font-semibold text-white mt-3">Projects</h1>
      <p className="text-zinc-500 text-sm mt-1">
        {loading
          ? "Loading your projects…"
          : `${projects.length} active project${projects.length === 1 ? "" : "s"}`}
      </p>
      <div className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900/60 overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-800">
          <h2 className="text-base font-medium text-white">All projects</h2>
          <p className="text-zinc-500 text-xs mt-0.5">
            Every project you have access to.
          </p>
        </div>
        <div className="grid grid-cols-[2rem_1fr_8rem] px-6 py-3 text-xs uppercase tracking-wide text-zinc-500 border-b border-zinc-800/80">
          <span></span>
          <span>Name</span>
          <span className="text-right">ID</span>
        </div>
        {error && <div className="px-6 py-8 text-sm text-red-400">{error}</div>}
        {!error && loading && (
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
        {!error && !loading && projects.length === 0 && (
          <div className="px-6 py-12 text-center">
            <p className="text-zinc-400 text-sm">No projects yet.</p>
            <p className="text-zinc-600 text-xs mt-1">
              New projects you&apos;re added to will show up here.
            </p>
          </div>
        )}
        {!error && !loading && projects.length > 0 && (
          <ul className="divide-y divide-zinc-800/60">
            {projects.map((project) => (
              <li
                onClick={() => {
                  setProjectId(project.id);
                  setActiveKey("project");
                }}
                key={project.id}
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
