"use client";

import { useForm } from "react-hook-form";

type FormValues = {
  email: string;
  password: string;
};

export default function Page() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit = handleSubmit((data) => {
    console.log(data);
    // TODO: NextAuth signIn 연동 예정
  });

  return (
    <main className="min-h-screen flex flex-col bg-blues-100 text-foreground">
      {/* 상단 안내 영역 */}
      <section className="flex-1 px-6 py-10">
        {/* 추후 Guide / 설명 영역 */}
      </section>

      {/* 하단 Form 영역 */}
      <section>
        <div className="max-w-md mx-auto py-8 px-4">
          <h1 className="text-xl font-semibold mb-2 text-blues-500">
            이메일로 시작하기
          </h1>
          <form onSubmit={onSubmit} className="space-y-4">
            {/* 이메일 */}
            <div>
              <label className="block text-sm font-medium mb-1 text-blues-500">
                이메일
              </label>
              <input
                type="email"
                {...register("email", { required: "이메일을 입력하세요." })}
                placeholder="you@example.com"
                className="
                  w-full rounded-md
                  border border-blues-300
                  bg-blues-100
                  px-3 py-2 text-sm
                  outline-none
                  focus:ring-2 focus:ring-blues-300
                "
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* 비밀번호 */}
            <div>
              <label className="block text-sm font-medium mb-1 text-blues-500">
                비밀번호
              </label>
              <input
                type="password"
                {...register("password", {
                  required: "비밀번호를 입력하세요.",
                })}
                placeholder="8자 이상 비밀번호"
                className="
                  w-full rounded-md
                  border border-blues-300
                  bg-blues-100
                  px-3 py-2 text-sm
                  outline-none
                  focus:ring-2 focus:ring-blues-300
                "
              />
              {errors.password && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* 제출 버튼 */}
            <button
              type="submit"
              className="
                w-full rounded-md
                bg-blues-400
                px-4 py-2 text-sm font-medium text-white
                hover:bg-blues-300
                transition-colors
              "
            >
              회원가입
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
