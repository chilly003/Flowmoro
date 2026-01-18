"use client";

import { useState } from "react";

import Login from "@/components/ui/login";
import Signup from "@/components/ui/signup";

type AuthView = "login" | "signup";

export default function Flowmoro() {
  const [view, setView] = useState<AuthView>("login");

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute bottom-3/4 left-1/4 h-120 w-120 -translate-x-1/2 rounded-full bg-blue-200/40 blur-3xl" />
        <div className="absolute top-3/4 left-3/5 h-130 w-140 rounded-full bg-blues-500/30 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md px-6">
        <div className="mb-3 flex items-center gap-3">
          <p className="text-4xl font-bold text-blues-500">
            Flowmoro
          </p>
          <span className="h-5 w-px bg-zinc-300" />
          <p className="text-xl text-zinc-500">
            일정별 집중 타이머!
          </p>
        </div>

        <div>
          {view === "login" && (
            <Login onSwitchToSignup={() => setView("signup")} />
          )}

          {view === "signup" && (
            <Signup onSwitchToLogin={() => setView("login")} />
          )}
        </div>
      </div>
    </div>

  );
}