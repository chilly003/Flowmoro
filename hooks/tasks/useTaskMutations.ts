// src/hooks/useTaskMutations.ts
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createTask,
  CreateTaskPayload,
  deleteTask,
  updateTaskStatus,
  reorderTasks,
  ReorderTasksPayload,
  addTaskTime,
  AddTaskTimePayload,
  TaskStatus,
} from "@/lib/api/tasks";

interface UseTaskMutationsOptions {
  date: string | null;
}

export function useTaskMutations({ date }: UseTaskMutationsOptions) {
  const queryClient = useQueryClient();

  const invalidateTasks = () => {
    if (!date) return;
    queryClient.invalidateQueries({ queryKey: ["tasks", date] });
  };

  // 1) 생성
  const createTaskMutation = useMutation({
    mutationFn: (payload: CreateTaskPayload) => createTask(payload),
    onSuccess: () => {
      invalidateTasks();
    },
  });

  // 2) 삭제
  const deleteTaskMutation = useMutation({
    mutationFn: (taskId: string) => deleteTask(taskId),
    onSuccess: () => {
      invalidateTasks();
    },
  });

  // 3) 상태 변경 (YET <-> DONE)
  const updateStatusMutation = useMutation({
    mutationFn: (input: { taskId: string; status: TaskStatus }) =>
      updateTaskStatus(input.taskId, { status: input.status }),
    onSuccess: () => {
      invalidateTasks();
    },
  });

  // 4) 정렬 변경 -> 우선순위 떨어짐. 시간 나면..
  const reorderTasksMutation = useMutation({
    mutationFn: (payload: ReorderTasksPayload) => reorderTasks(payload),
    onSuccess: () => {
      invalidateTasks();
    },
  });

  // 5) 시간 추가 (뽀모도로 종료 시)
  const addTaskTimeMutation = useMutation({
    mutationFn: (input: { taskId: string; payload: AddTaskTimePayload }) =>
      addTaskTime(input.taskId, input.payload),
    onSuccess: () => {
      invalidateTasks();
    },
  });

  return {
    createTaskMutation,
    deleteTaskMutation,
    updateStatusMutation,
    reorderTasksMutation,
    addTaskTimeMutation,
  };
}
