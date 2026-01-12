"use client";

import { useState, useEffect } from "react";
import {useSession} from "next-auth/react"
import { useRouter } from "next/navigation";

import Login from "@/components/ui/login";
import Signup from "@/components/ui/signup";

type AuthView = "login" | "signup";

export default function Flowmoro() {
  const [view, setView] = useState<AuthView>("login");
  const {status} = useSession();
  const router = useRouter();

  useEffect(()=> {
    if (status === "authenticated") {
      router.replace("/main");
    }
  }, [status, router])

  //로딩 화면 필요
  if (status === "loading") {
    return null;
  }

  return (
    <div className="">
      {view === "login" && (
        <Login onSwitchToSignup={() => setView("signup")} />
      )}

      {view === "signup" && (
        <Signup onSwitchToLogin={() => setView("login")} />
      )}
    </div>
  );
}