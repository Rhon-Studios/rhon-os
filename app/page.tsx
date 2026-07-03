"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/userContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const { refresh } = useUser();

  const [isAdmin, setIsAdmin] = useState(false);
  async function handleLogin() {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password: password || undefined }),
    });
    if (!res.ok) {
      const data = await res.json();
      setError(data.error);
      return;
    }
    await refresh();
    router.push("/dashboard");
  }

  return (
    <div className="flex flex-col items-center justify-center m-auto gap-10 bg-black/60 p-5 rounded-xl">
      <h1 className="text-4xl font-bold font-rye">Rhon studios OS</h1>

      <div className="flex justify-around w-full">
        <p>Admin</p>
        <div className="relative inline-block w-11 h-5">
          <input
            id="switch-component"
            type="checkbox"
            checked={isAdmin}
            onChange={(e) => setIsAdmin(e.target.checked)}
            className="peer appearance-none w-11 h-5 bg-slate-100 rounded-full checked:bg-slate-800 cursor-pointer transition-colors duration-300"
          />
          <label
            htmlFor="switch-component"
            className="absolute top-0 left-0 w-5 h-5 bg-white rounded-full border border-slate-300 shadow-sm transition-transform duration-300 peer-checked:translate-x-6 peer-checked:border-slate-800 cursor-pointer"
          ></label>
        </div>
      </div>
      <input
        className="rounded-2xl border-gray-500 border-2 px-4 py-2"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />

      {isAdmin && (
        <>
          <input
            className="rounded-2xl border-gray-500 border-2 px-4 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
          />
        </>
      )}
      {error && <p className="text-red-400">{error}</p>}
      <button
        onClick={handleLogin}
        className="rounded-2xl border-gray-500 border-2 px-4 py-2 hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
      >
        Entrar
      </button>
    </div>
  );
}
