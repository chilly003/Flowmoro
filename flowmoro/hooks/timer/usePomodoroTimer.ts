"use client";

import { useEffect, useRef, useState } from "react";
import { useTaskMutations } from "@/hooks/tasks/useTaskMutations";

export function usePomodoroTimer({
  taskId,
  date,
  totalSeconds,
}: {
  taskId: string;
  date: string | null;
  totalSeconds: number;
}) {
  const { addTaskTimeMutation } = useTaskMutations({ date });

  const [isRunning, setIsRunning] = useState(false);
  const [remaining, setRemaining] = useState<number>(() =>
    Number.isFinite(totalSeconds) ? totalSeconds : 0
  );

  const intervalRef = useRef<number | null>(null);
  const recordedRef = useRef(false);

  // totalSeconds 변경 시 초기화
  useEffect(() => {
    if (Number.isFinite(totalSeconds)) {
      setIsRunning(false);
      setRemaining(totalSeconds);
      recordedRef.current = false;
    }
  }, [totalSeconds]);

  // 실행/정지
  useEffect(() => {
    if (!isRunning) {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
      intervalRef.current = null;
      return;
    }

    intervalRef.current = window.setInterval(() => {
      setRemaining((prev) => prev - 1);
    }, 1000);

    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    };
  }, [isRunning]);

  const start = () => {
    if (!Number.isFinite(totalSeconds)) return;
    if (remaining <= 0) return;
    setIsRunning(true);
  };

  const stop = () => setIsRunning(false);

  // 실제 경과시간(분) 기록: totalSeconds - remainingSeconds
  const recordOnce = async (remainingSeconds: number) => {
    if (recordedRef.current) return;
    recordedRef.current = true;

    if (!taskId) return;
    if (!Number.isFinite(totalSeconds) || totalSeconds <= 0) return;
    if (!date) return;

    const elapsedSeconds = Math.max(0, totalSeconds - Math.max(0, remainingSeconds));
    const elapsedMinutes = Math.max(1, Math.floor(elapsedSeconds / 60));

    await addTaskTimeMutation.mutateAsync({
      taskId,
      payload: { durationMinutes: elapsedMinutes },
    });
  };

  return {
    isRunning,
    remaining,
    setRemaining,
    start,
    stop,
    recordOnce,
    addTaskTimeMutation,
  };
}
