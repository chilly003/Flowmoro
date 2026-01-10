// src/hooks/useTasksQuery.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchTasks, GetTasksResult } from "@/lib/api/tasks";

export function useTasksQuery(date: string | null) {
  const query = useQuery<GetTasksResult>({
    queryKey: ["tasks", date],
    queryFn: () => fetchTasks(date!),
    enabled: !!date,
  });

  return {
    ...query,
    tasks: query.data?.tasks ?? [],
    selectedDate: query.data?.date ?? date,
  };
}
