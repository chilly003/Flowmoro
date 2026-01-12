"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuthMutations } from "@/hooks/useAuthMutations";
import Modal from "@/components/ui/modal";

type LoginProps = { 
  onSwitchToSignup: () => void;
};

type FormValues = {
  email: string;
  password: string;
};

export default function Login({ onSwitchToSignup }: LoginProps) {
  const { loginMutation } = useAuthMutations();
  const [openModal, setOpenModal] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>();

  const onSubmit = handleSubmit(async (data) => {
    try {
      await loginMutation.mutateAsync(data);
    } catch {
      console.log("LOGIN_FAILED");
      setError("password", {
        type: "server",
        message: "이메일 또는 비밀번호가 올바르지 않습니다.",
      });
      setOpenModal(true);
    }
  });

  return (
    <>
      <div className="max-w-md mx-auto p-6">
        <h2 className="text-xl font-semibold mb-4">로그인</h2>

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
            로그인
          </button>
        </form>

        <button
          type="button"
          onClick={onSwitchToSignup}
          className="mt-4 text-sm text-blue-400"
        >
          회원가입 하러 가기
        </button>
      </div>

      {/* 공용 모달 */}
      <Modal
        open={openModal}
        title="로그인에 실패했습니다"
        description="계정이 없다면 회원가입 후 다시 로그인해 주세요."
        onClose={() => setOpenModal(false)}
      />
    </>
  );
}
