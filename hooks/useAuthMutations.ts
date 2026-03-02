"use client";

import { useMutation } from "@tanstack/react-query";
import { signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { signup, withdraw } from "@/lib/api/auth";

type Credentials = { email: string; password: string };

export function useAuthMutations() {
  const router = useRouter();

  const signupMutation = useMutation({
    mutationFn: (payload: Credentials) => signup(payload),
  });

  const loginMutation = useMutation({
    mutationFn: async (payload: Credentials) => {
      const res = await signIn("credentials", {
        email: payload.email,
        password: payload.password,
        redirect: false,
      });

      if (!res || res.error) {
        throw new Error("LOGIN_FAILED");
      }
      return true;
    },
    onSuccess: () => {
      router.push("/main");
    },
  });

  const signupAndLoginMutation = useMutation({
    mutationFn: async (payload: Credentials) => {
      await signup(payload);
      const res = await signIn("credentials", {
        email: payload.email,
        password: payload.password,
        redirect: false,
      });
      if (!res?.ok) throw new Error("회원가입은 완료됐지만 로그인에 실패했습니다.");
      return true;
    },
    onSuccess: () => {
      router.push("/main");
    },
  });

  const withdrawMutation = useMutation({
    mutationFn: async () => {
      await withdraw();
      await signOut({ callbackUrl: "/" });
      return true;
    },
  });

  return { signupMutation, loginMutation, signupAndLoginMutation, withdrawMutation };
}
