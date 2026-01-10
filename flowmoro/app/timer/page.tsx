"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTimerParams } from "@/hooks/timer/useTimerParams";
import { usePomodoroTimer } from "@/hooks/timer/usePomodoroTimer";
import Timer from "@/components/ui/Timer";

export default function TimerPage() {
  const router = useRouter();

  const { taskId, date, totalSeconds } = useTimerParams();
  const timer = usePomodoroTimer({ taskId, date, totalSeconds });

  // 0초 도달 시 자동 정지 + 기록 + 이동
  useEffect(() => {
    if (!timer.isRunning) return;
    if (timer.remaining <= 0) {
      timer.stop();
      timer.setRemaining(0);

      (async () => {
        try {
          await timer.recordOnce(0);
        } finally {
          router.push("/main");
        }
      })();
    }
  }, [timer.isRunning, timer.remaining, router]); // timer 내부는 ref 기반으로 안전

  const onEnd = async () => {
    timer.stop();
    const currentRemaining = timer.remaining;

    try {
      await timer.recordOnce(currentRemaining);
    } finally {
      router.push("/main");
    }
  };

  return (
    <main className="w-full max-w-xl mx-auto p-6">
      <div className="p-6">
        <Timer remaining={timer.remaining} totalSeconds={totalSeconds} />

        <section className="mt-6 flex flex-col items-center gap-3">
          {!timer.isRunning ? (
            <button
              type="button"
              onClick={timer.start}
              disabled={timer.remaining <= 0 || timer.addTaskTimeMutation.isPending}
              className="w-full max-w-xs rounded-full bg-blues-500 px-6 py-3 text-white font-medium disabled:opacity-50"
            >
              시작
            </button>
          ) : (
            <button
              type="button"
              onClick={onEnd}
              disabled={timer.addTaskTimeMutation.isPending}
              className="w-full max-w-xs rounded-full border px-6 py-3 font-medium text-zinc-700 disabled:opacity-50"
            >
              끝내기
            </button>
          )}
        </section>

        {timer.addTaskTimeMutation.isError && (
          <div className="mt-3 text-center text-sm text-red-600">
            시간 기록에 실패했습니다.
          </div>
        )}
      </div>
    </main>
  );
}
