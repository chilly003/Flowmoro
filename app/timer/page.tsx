// src/app/app/timer/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTimerParams } from "@/hooks/timer/useTimerParams";
import { usePomodoroTimer } from "@/hooks/timer/usePomodoroTimer";
import Timer from "@/components/ui/Timer";

import dynamic from "next/dynamic";
const PixelSnow = dynamic(() => import("@/components/ui/pixel-snow"), {
  ssr: false,
});

export default function TimerPage() {
  const router = useRouter();

  const { taskId, date, totalSeconds } = useTimerParams();
  const timer = usePomodoroTimer({ taskId, date, totalSeconds });

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
  }, [timer.isRunning, timer.remaining, router]);

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
    <main className="relative min-h-screen w-full flex items-center justify-center">
      <div
        className="pointer-events-none absolute inset-0 bg-black -z-10"
        aria-hidden="true"
      >
        <PixelSnow />
      </div>

      <div className="w-full max-w-xl p-6">
        <div className="p-6 flex flex-col items-center">
          <Timer remaining={timer.remaining} totalSeconds={totalSeconds} />

          <section className="mt-8 flex flex-col items-center gap-3 w-full">
            {!timer.isRunning ? (
              <button
                type="button"
                onClick={timer.start}
                disabled={
                  timer.remaining <= 0 || timer.addTaskTimeMutation.isPending
                }
                className="w-full text-2xl max-w-xs rounded-full bg-white border-2 border-white px-6 py-3 text-zinc-800 disabled:opacity-50"
              >
                START
              </button>
            ) : (
              <button
                type="button"
                onClick={onEnd}
                disabled={timer.addTaskTimeMutation.isPending}
                className="w-full text-2xl max-w-xs rounded-full bg-white/20 border-2 px-6 py-3 text-blues-100 disabled:opacity-50"
              >
                END
              </button>
            )}
          </section>

          {timer.addTaskTimeMutation.isError && (
            <div className="mt-3 text-center text-sm text-red-600">
              시간 기록에 실패했습니다.
            </div>
          )}
        </div>
      </div>
    </main>

  );
}
