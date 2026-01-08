// src/app/app/main/page.tsx
"use client";

import { useTasksQuery } from "@/hooks/useTasksQuery";

export default function TaskItem() {
  const testDate = "2025-12-10"; // 실제로 Task 있는 날짜로 변경
  const { tasks, isLoading, isError, error } = useTasksQuery(testDate);

  if (isLoading) return <div>로딩 중...</div>;

  if (isError) {
    console.error(error);
    return (
      <div className="p-4 text-red-600">
        에러 발생: {error instanceof Error ? error.message : String(error)}
      </div>
    );
  }

  return (
    <main className="p-4">
      <h1>Tasks for {testDate}</h1>
      <pre>{JSON.stringify(tasks, null, 2)}</pre>
    </main>
  );
}