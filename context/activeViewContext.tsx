"use client";
import { createContext, useContext, useState } from "react";

type ActiveViewContextType = {
  activeKey: string;
  setActiveKey: (key: string) => void;
  projectId: number | null;
  setProjectId: (id: number | null) => void;
};

const ActiveViewContext = createContext<ActiveViewContextType | undefined>(
  undefined,
);

export function ActiveViewProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [activeKey, setActiveKey] = useState("dashboard");
  const [projectId, setProjectId] = useState<number | null>(null);
  return (
    <ActiveViewContext.Provider
      value={{
        activeKey,
        setActiveKey,
        projectId,
        setProjectId,
      }}
    >
      {children}
    </ActiveViewContext.Provider>
  );
}

export function useActiveView() {
  const context = useContext(ActiveViewContext);
  if (!context)
    throw new Error(
      "useActiveView debe usarse dentro de un ActiveViewProvider",
    );
  return context;
}
