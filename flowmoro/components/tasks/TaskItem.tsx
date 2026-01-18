// src/app/app/main/page.tsx
"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { IoClose, IoTimeOutline } from "react-icons/io5";
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
    <main className="w-full max-w-xl mx-auto py-4 px-6 space-y-4">
      {/* ✅ 오늘만 “추가 UI” 노출 */}
      {canEdit && (
        <section className="flex gap-2">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="새 일정 제목"
            className="input-base text-sm"
            disabled={createTaskMutation.isPending}
          />
          <button
            type="button"
            onClick={handleCreate}
            disabled={createTaskMutation.isPending || !title.trim()}
            className="btn-primary"
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
          <ul className="space-y-3">
            {tasks.map((t: any) => {
              const checked = t.status === "DONE";
              return (
                <li
                  key={t.id}
                  className={[
                    "flex items-center justify-between rounded-md border border-2 px-3 py-2 transition-colors",
                    checked
                      ? "bg-blues-300 border-blues-300"
                      : "bg-white border-blues-300",
                  ].join(" ")}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(e) => handleToggleDone(t.id, e.target.checked)}
                      disabled={!canEdit || updateStatusMutation.isPending}
                      className="h-4 w-4"
                      aria-label="완료 체크"
                    />

                    <div className="flex flex-row gap-2">
                      <span
                        className={[
                          "text-sm",
                          checked ? "line-through text-zinc-400" : "",
                        ].join(" ")}
                      >
                        {t.title}
                      </span>

                      {typeof t.totalTrackedMinutes === "number" && (
                        <span className="text-sm text-blues-450">
                          집중시간: {t.totalTrackedMinutes}분
                        </span>
                      )}
                    </div>
                  </div>

                  {canEdit && (
                    <div className="flex flex-col gap-1">
                      {/* 삭제 버튼 */}
                      <button
                        type="button"
                        onClick={() => handleDelete(t.id)}
                        disabled={deleteTaskMutation.isPending}
                        aria-label="삭제"
                        className=" rounded-md text-red-400 transition hover:text-red-600 hover:scale-130 hover:font-semibold disabled:cursor-not-allowed"
                      >
                        <IoClose size={18} />
                      </button>

                      {/* 뽀모도로 버튼 */}
                      {!checked && (
                        <button
                          type="button"
                          onClick={() => router.push(`/time/${t.id}?date=${date}`)}
                          disabled={deleteTaskMutation.isPending}
                          aria-label="뽀모도로"
                          className="rounded-md text-blues-400 transition hover:text-blues-500 hover:scale-130 hover:font-semibold disabled:cursor-not-allowed"
                        >
                          <IoTimeOutline size={18} />
                        </button>
                      )}
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
