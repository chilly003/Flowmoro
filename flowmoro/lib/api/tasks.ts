// src/lib/api/tasks.ts

export type TaskStatus = "YET" | "DONE";

export interface Task {
    id: number;
    userId: string;
    title: string;
    date: string;
    status: TaskStatus;
    order: number;
    totalTrackedMinutes: number;
    createdAt: string;
}

interface ApiErrorDetail {
    code?: string;
    message?: string;
}

type ApiResponse<T> = { success: true; data: T } | { success: false; error: ApiErrorDetail };

async function request<T>(
    input: RequestInfo,
    init?: RequestInit,
): Promise<T> {
    const res = await fetch(input, {
        ...init,
        headers: {
            "Content-Type": "application/json",
            ...(init?.headers ?? {}),
        },
    });

    if (!res.ok) {
        let body: any = null;
        try {
            body = await res.json();
        } catch {
            // ignore
        }
        const message =
            body?.error?.message ??
            body?.message ??
            `HTTP Error ${res.status}`;
        throw new Error(message);
    }

    const json = (await res.json()) as ApiResponse<T>;

    // 실패 응답 처리
    if (json.success === false) {
        throw new Error(json.error?.message ?? "알 수 없는 오류가 발생했습니다.");
    }

    // 성공 응답 처리
    if (json.success === true) {
        return json.data;
    }

    // 혹시 다른 형태가 오면 그대로 던짐 (디버깅용)
    throw new Error("예상하지 못한 응답 형식입니다.");
}

export interface GetTasksResult {
    date: string;
    tasks: Task[];
}

export async function fetchTasks(date: string): Promise<GetTasksResult> {
    return request<GetTasksResult>(`/api/tasks?date=${encodeURIComponent(date)}`);
}

export interface CreateTaskPayload {
    title: string;
    date: string;
}

export async function createTask(
    payload: CreateTaskPayload,
): Promise<Task> {
    return request<Task>("/api/tasks", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

export interface ReorderTasksPayload {
    date: string;
    orderedIds: number[];
}

export interface ReorderTasksResult {
    date: string;
    total: number;
}

export async function reorderTasks(
    payload: ReorderTasksPayload,
): Promise<ReorderTasksResult> {
    return request<ReorderTasksResult>("/api/tasks/reorder", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

export interface DeleteTaskResult {
    id: number;
}

export async function deleteTask(taskId: number): Promise<DeleteTaskResult> {
    return request<DeleteTaskResult>(`/api/tasks/${taskId}`, {
        method: "DELETE",
    });
}

export interface UpdateTaskStatusPayload {
    status: TaskStatus;
}

export async function updateTaskStatus(
    taskId: number,
    payload: UpdateTaskStatusPayload,
): Promise<Task> {
    return request<Task>(`/api/tasks/${taskId}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
    });
}

export interface AddTaskTimePayload {
    durationMinutes: number;
}

export interface TaskTimeLog {
    id: number;
    taskId: number;
    durationMinutes: number;
    createdAt: string;
}

export interface AddTaskTimeResult {
    taskId: number;
    addedMinutes: TaskTimeLog;
}

export async function addTaskTime(
    taskId: number,
    payload: AddTaskTimePayload,
): Promise<AddTaskTimeResult> {
    return request<AddTaskTimeResult>(`/api/tasks/${taskId}/time`, {
        method: "POST",
        body: JSON.stringify(payload),
    });
}
