"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";

export function useTimerParams() {
  const sp = useSearchParams();

  const taskId = useMemo(() => Number(sp.get("taskId")), [sp]);
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
