"use client";

import { useMutation } from "@tanstack/react-query";
import { signIn } from "next-auth/react";
import { signup } from "@/lib/api/auth";

type Credentials = { email: string; password: string };

export function useAuthMutations() {
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

      if (!res?.ok) {
        throw new Error("이메일 또는 비밀번호가 올바르지 않습니다.");
      }
      return true;
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
  });

  return { signupMutation, loginMutation, signupAndLoginMutation };
}
