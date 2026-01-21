"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";

// src/hooks/timer/useTimerParams.ts
export function useTimerParams() {
  const sp = useSearchParams();

  const taskId = sp.get("taskId") || ""; // string
  const date = sp.get("date");
  const minutes = useMemo(() => Number(sp.get("m")), [sp]);

  const totalSeconds = useMemo(() => {
    if (!Number.isFinite(minutes)) return NaN;
    const m = Math.floor(minutes);
    if (m <= 0) return NaN;
    return m * 60;
  }, [minutes]);

  return { taskId, date, minutes, totalSeconds };
}
