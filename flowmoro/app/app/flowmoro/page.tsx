"use client";

import { useState } from "react";
import Login from "@/components/ui/login";
import Signup from "@/components/ui/signup";

type AuthView = "login" | "signup";

export default function Flowmoro() {
  const [view, setView] = useState<AuthView>("login");

  return (
    <div>
      <h1>Flowmoro</h1>

      {view === "login" && (
        <Login onSwitchToSignup={() => setView("signup")} />
      )}

      {view === "signup" && (
        <Signup onSwitchToLogin={() => setView("login")} />
      )}
    </div>
  );
}