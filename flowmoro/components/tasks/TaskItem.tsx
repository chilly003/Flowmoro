// src/app/app/main/page.tsx
"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useTasksQuery } from "@/hooks/tasks/useTasksQuery";
import { useDateStore } from "@/hooks/useDateStore";
import { useTaskMutations } from "@/hooks/tasks/useTaskMutations";
import { isToday } from "@/lib/date-utils";
import type { TaskStatus } from "@/lib/api/tasks";

export default function TaskItem() {
  const date = useDateStore((s) => s.selectedDateKey);
  const { tasks } = useTasksQuery(date);
  const router = useRouter();
  const { createTaskMutation, deleteTaskMutation, updateStatusMutation } =
    useTaskMutations({ date });
  const canEdit = useMemo(() => isToday(date), [date]);
  const [title, setTitle] = useState("");

  const handleCreate = async () => {
    if (!canEdit) return;
    const trimmed = title.trim();
    if (!trimmed) return;

    // CreateTaskPayload에 맞춰 필요한 필드만 맞추세요.
    await createTaskMutation.mutateAsync({
      title: trimmed,
      date,
    });

    setTitle("");
  };

  const handleDelete = async (taskId: number) => {
    if (!canEdit) return;
    await deleteTaskMutation.mutateAsync(taskId);
  };

  const handleToggleDone = async (taskId: number, checked: boolean) => {
    if (!canEdit) return;
    const next: TaskStatus = checked ? "DONE" : "YET";
    await updateStatusMutation.mutateAsync({ taskId, status: next });
  };


  return (
    <main className="w-full max-w-xl mx-auto p-4 space-y-4">
      {/* 헤더 */}
      <header className="space-y-1 text-center">
        <h1>{date}</h1>
      </header>

      {/* ✅ 오늘만 “추가 UI” 노출 */}
      {canEdit && (
        <section className="flex gap-2">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="새 일정 제목"
            className="flex-1 rounded-md border px-3 py-2 text-sm"
            disabled={createTaskMutation.isPending}
          />
          <button
            type="button"
            onClick={handleCreate}
            disabled={createTaskMutation.isPending || !title.trim()}
            className="rounded-md bg-blues-500 px-4 py-2 text-sm text-white disabled:opacity-50"
          >
            추가
          </button>
        </section>
      )}

      {/* 목록 */}
      <section className="space-y-2">
        {(tasks ?? []).length === 0 ? (
          <div className="text-sm text-zinc-500 text-center">일정이 없습니다.</div>
        ) : (
          <ul className="space-y-2">
            {tasks.map((t: any) => {
              const checked = t.status === "DONE";
              return (
                <li
                  key={t.id}
                  className="flex items-center justify-between rounded-md border px-3 py-2"
                >
                  <div className="flex items-center gap-3">
                    {/* ✅ 체크박스: 오늘만 토글 가능 */}
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(e) => handleToggleDone(t.id, e.target.checked)}
                      disabled={!canEdit || updateStatusMutation.isPending}
                      className="h-4 w-4"
                      aria-label="완료 체크"
                    />

                    <div className="flex flex-col">
                      <span
                        className={[
                          "text-sm",
                          checked ? "line-through text-zinc-400" : "",
                        ].join(" ")}
                      >
                        {t.title}
                      </span>

                      {typeof t.totalTrackedMinutes === "number" && (
                        <span className="text-xs text-zinc-500">
                          집중시간: {t.totalTrackedMinutes}분
                        </span>
                      )}
                    </div>
                  </div>

                  {canEdit && (
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => handleDelete(t.id)}
                        disabled={deleteTaskMutation.isPending}
                        className="rounded-md border px-2 py-1 text-xs text-red-600"
                        aria-label="삭제"
                      >
                        삭제
                      </button>
                      <button
                        type="button"
                        onClick={() => router.push(`/time/${t.id}?date=${date}`)}
                        disabled={deleteTaskMutation.isPending}
                        className="rounded-md border px-2 py-1 text-xs text-blues-500"
                        aria-label="뽀모도로"
                      >
                        뽀모도로
                      </button>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </main>
  );
}
