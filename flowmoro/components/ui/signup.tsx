"use client";

import { useForm } from "react-hook-form";
import { useAuthMutations } from "@/hooks/useAuthMutations";

type SignupProps = {
  onSwitchToLogin: () => void;
};

type FormValues = {
  email: string;
  password: string;
};

export default function Signup({ onSwitchToLogin }: SignupProps) {
  const { signupAndLoginMutation } = useAuthMutations();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>();

  const onSubmit = handleSubmit(async (data) => {
    try {
      await signupAndLoginMutation.mutateAsync(data);
      // 성공 시 이미 로그인 상태
    } catch (err: any) {
      setError("email", {
        type: "server",
        message: err.message,
      });
    }
  });

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-xl font-semibold mb-4">회원가입</h2>

      <form onSubmit={onSubmit} className="space-y-4">
        {/* 이메일 */}
        <div>
          <label className="block text-sm mb-1">이메일</label>
          <input
            type="email"
            {...register("email", { required: "이메일을 입력하세요." })}
            className="w-full border rounded px-3 py-2"
          />
          {errors.email && (
            <p className="text-xs text-red-500">{errors.email.message}</p>
          )}
        </div>

        {/* 비밀번호 */}
        <div>
          <label className="block text-sm mb-1">비밀번호</label>
          <input
            type="password"
            {...register("password", {
              required: "비밀번호를 입력하세요.",
              minLength: {
                value: 8,
                message: "비밀번호는 8자 이상이어야 합니다.",
              },
            })}
            className="w-full border rounded px-3 py-2"
          />
          {errors.password && (
            <p className="text-xs text-red-500">{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blues-400 hover:bg-blues-500 text-white py-2 rounded disabled:opacity-60"
        >
          회원가입
        </button>
      </form>

      <button
        type="button"
        onClick={onSwitchToLogin}
        className="mt-4 text-sm text-blue-400"
      >
        로그인 하러 가기
      </button>
    </div>
  );
}
