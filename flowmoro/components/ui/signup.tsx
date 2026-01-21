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
    formState: { errors, isSubmitting, isValid },
  } = useForm<FormValues>({ mode: "onChange" });

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
      <h2 className="text-ml font-semibold mb-3 text-blues-500">회원가입</h2>

      <form onSubmit={onSubmit} className="space-y-4">
        {/* 이메일 */}
        <div>
          <label className="block text-sm mb-1">이메일</label>
          <input
            type="email"
            {...register("email", {
              required: "이메일을 입력하세요.",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "유효한 이메일 주소를 입력하세요."
              }
            })}
            className="w-full rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blues-400 bg-blues-200"
          />
          {errors.email && (
            <p className="text-xs text-red-500">{errors.email.message}</p>
          )}
        </div>

        {/* 비밀번호 */}
        <div>
          <label className="block text-sm mb-1">
            비밀번호 <span className="text-xs text-gray-500 font-normal">(8자 이상)</span>
          </label>
          <input
            type="password"
            placeholder="8자 이상 입력해주세요"
            {...register("password", {
              required: "비밀번호를 입력하세요.",
              minLength: {
                value: 8,
                message: "비밀번호는 8자 이상이어야 합니다.",
              },
            })}
            className="w-full rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blues-400 bg-blues-200"
          />
          {errors.password && (
            <p className="text-xs text-red-500">{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !isValid}
          className={`w-full py-2 rounded text-white transition-colors duration-200 ${isValid && !isSubmitting
            ? "bg-blues-400 hover:bg-blues-500"
            : "bg-gray-300 cursor-not-allowed"
            }`}
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
