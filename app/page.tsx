"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/userContext";
import { ShieldCheck } from "lucide-react";
import Image from "next/image";

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
    <div className="min-h-screen w-full flex items-center justify-center bg-black p-6">
      <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-950 p-8 shadow-2xl">
        <div className="flex justify-center">
          <div className="h-20 w-20 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center relative overflow-hidden">
            <Image
              src="/RhonStudiosCircleLogo.png"
              alt="Rhon Studios OS"
              className="object-contain"
              fill
              sizes="80px"
            />
          </div>
        </div>

        <h1 className="text-2xl font-semibold text-white text-center mt-5 font-rye">
          Rhon Studios OS
        </h1>
        <p className="text-zinc-500 text-sm text-center mt-1.5">
          Sign in to access your projects and tasks.
        </p>

        <div className="mt-7 flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-zinc-500" />
            <span className="text-sm text-zinc-300">Admin</span>
          </div>

          <div className="relative inline-block w-11 h-5">
            <input
              id="switch-component"
              type="checkbox"
              checked={isAdmin}
              onChange={(e) => setIsAdmin(e.target.checked)}
              className="peer appearance-none w-11 h-5 bg-zinc-700 rounded-full checked:bg-emerald-600 cursor-pointer transition-colors duration-300"
            />
            <label
              htmlFor="switch-component"
              className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-300 peer-checked:translate-x-6 cursor-pointer"
            ></label>
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
        >
          <div className="mt-4 space-y-3">
            <input
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-500 outline-none focus:border-zinc-600 transition-colors"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email"
            />

            {isAdmin && (
              <input
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-500 outline-none focus:border-zinc-600 transition-colors"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="Password"
              />
            )}
          </div>

          {error && (
            <p className="text-red-400 text-sm mt-3 text-center">{error}</p>
          )}

          <button
            type="submit"
            className="w-full mt-5 rounded-xl bg-white text-zinc-900 font-medium text-sm py-2.5 cursor-pointer hover:bg-zinc-200 transition-colors"
          >
            Sign in
          </button>
        </form>
        <p className="text-zinc-600 text-xs text-center mt-6">
          Internal tool for Rhon Studios team members only.
        </p>
      </div>
    </div>
  );
}
