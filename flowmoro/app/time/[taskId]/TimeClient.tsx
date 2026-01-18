"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTasksQuery } from "@/hooks/tasks/useTasksQuery";

const PRESETS = [15, 30, 60] as const;

export default function TimeClient({ taskId }: { taskId: number }) {
  const router = useRouter();
  const sp = useSearchParams();

  const date = sp.get("date");
  const { tasks, isError } = useTasksQuery(date);

  const task = useMemo(() => {
    return tasks.find((t: any) => Number(t.id) === taskId);
  }, [tasks, taskId]);

  const title = task?.title ?? `Task #${taskId}`;

  const [selected, setSelected] = useState<number | null>(30);
  const [custom, setCustom] = useState("");

  const goTimer = (minutes: number) => {
    router.push(`/timer?taskId=${taskId}&date=${date}&m=${minutes}`);
  };

  const customMinutes = useMemo(() => {
    const n = Number(custom);
    if (!Number.isFinite(n)) return null;
    const int = Math.floor(n);
    if (int <= 0) return null;
    return int;
  }, [custom]);

  const startMinutes = selected ?? customMinutes ?? null;

  if (isError) return <div className="p-4 text-red-600">일정을 불러오지 못했습니다.</div>;

  const baseBtn =
    "rounded-md border px-3 py-2 transition hover:outline-none active:scale-[0.99]";
  const baseInput =
    "rounded-md border px-3 py-2 outline-none transition hover:outline-none";

  return (
    <main className="mx-auto w-full max-w-xl pt-28 pb-10">
      <section className="rounded-md bg-white border border-zinc-200 p-5">
        <header className="space-y-2">
          <p className="text-3xl font-semibold text-black">{title}</p>
          <p className="text-xl text-zinc-500">집중할 시간을 선택해 주세요.</p>
        </header>

        <hr className="my-5 border-zinc-200 border-[1px]" />

        <div className="mt-5">
          <p className="mb-2 font-medium text-zinc-500">빠른 선택</p>

          <div className="grid grid-cols-3 gap-2">
            {PRESETS.map((m) => {
              const active = selected === m;
              return (
                <button
                  key={m}
                  type="button"
                  onClick={() => {
                    setSelected(m);
                    setCustom("");
                  }}
                  aria-pressed={active}
                  className={[
                    baseBtn,
                    "border-blues-400",
                    "py-4 text-center",
                    active ? "bg-blues-300/40 text-blues-500 border-2" : "bg-blues-100 text-zinc-800",
                  ].join(" ")}
                >
                  <div className="text-2xl font-semibold leading-none">
                    {m}
                    <span className="ml-1 align-baseline text-sm font-normal text-zinc-500">
                      분
                    </span>
                  </div>

                </button>
              );
            })}
          </div>
        </div>

        {/* 직접 입력 */}
        <div className="mt-5">
          <p className="mb-2 font-medium text-zinc-500">직접 입력</p>

          <div className="flex gap-2">
            <div className="relative w-full">
              <input
                value={custom}
                onChange={(e) => {
                  const v = e.target.value.replace(/[^\d]/g, "");
                  setCustom(v);
                  setSelected(null);
                }}
                inputMode="numeric"
                placeholder="직접 입력(분)"
                className={[baseInput, "w-full border-blues-400 pr-10 bg-blues-100"].join(" ")}
                aria-label="집중 시간(분) 직접 입력"
              />
            </div>
          </div>
        </div>

        <div className="mt-24">
          <button
            type="button"
            onClick={() => startMinutes && goTimer(startMinutes)}
            disabled={!startMinutes}
            className={[
              baseBtn,
              "w-full border-blues-400 py-3 text-base",
              startMinutes ? "bg-zinc-800 text-white" : "bg-zinc-100 text-zinc-400 cursor-not-allowed",
            ].join(" ")}
          >
            {startMinutes ? `${startMinutes}분 시작` : "시간을 선택해 주세요"}
          </button>
        </div>
      </section>
    </main>
  );
}
