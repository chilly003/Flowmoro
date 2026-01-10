"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTasksQuery } from "@/hooks/tasks/useTasksQuery";

export default function TimeClient({ taskId }: { taskId: number }) {
  const router = useRouter();
  const sp = useSearchParams();

  const date = sp.get("date");
  const { tasks, isError } = useTasksQuery(date);

  const task = useMemo(() => {
    return tasks.find((t: any) => Number(t.id) === taskId);
  }, [tasks, taskId]);

  const title = task?.title ?? `Task #${taskId}`;

  const [custom, setCustom] = useState("");

  const goTimer = (minutes: number) => {
    // ✅ timer에서도 taskId + date + minutes 전달 (API 추가 없이 유지)
    router.push(`/timer?taskId=${taskId}&date=${date}&m=${minutes}`);
  };

  const customMinutes = useMemo(() => {
    const n = Number(custom);
    if (!Number.isFinite(n) || n <= 0) return null;
    return Math.floor(n);
  }, [custom]);

  if (isError) return <div className="p-4 text-red-600">일정을 불러오지 못했습니다.</div>;

  return (
    <main className="w-full max-w-xl mx-auto p-4 space-y-4">
      <header className="text-center space-y-1">
        <h1 className="text-lg font-semibold">{title}</h1>
        <p className="text-sm text-zinc-500">집중 시간을 선택하세요.</p>
      </header>

      <section className="grid grid-cols-3 gap-2">
        <button className="rounded-md border px-3 py-2 text-sm" onClick={() => goTimer(15)}>
          15분
        </button>
        <button className="rounded-md border px-3 py-2 text-sm" onClick={() => goTimer(30)}>
          30분
        </button>
        <button className="rounded-md border px-3 py-2 text-sm" onClick={() => goTimer(60)}>
          1시간
        </button>
      </section>

      <section className="flex gap-2">
        <input
          value={custom}
          onChange={(e) => setCustom(e.target.value)}
          inputMode="numeric"
          placeholder="직접 입력(분)"
          className="flex-1 rounded-md border px-3 py-2 text-sm"
        />
        <button
          type="button"
          onClick={() => customMinutes && goTimer(customMinutes)}
          disabled={!customMinutes}
          className="rounded-md bg-blues-500 px-4 py-2 text-sm text-white disabled:opacity-50"
        >
          시작
        </button>
      </section>
    </main>
  );
}
