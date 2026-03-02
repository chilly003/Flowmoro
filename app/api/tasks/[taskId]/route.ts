// src/app/api/tasks/[taskId]/route.ts
import { NextRequest } from "next/server";
import { query, execute } from "@/lib/db";
import { ok, fail, withErrorHandling } from "@/lib/api-utils";
import { requireUserId } from "@/lib/auth-guard";

type TaskStatus = "YET" | "DONE";

type TaskRow = {
  id: string;
  userId: string;
  title: string;
  date: string;
  status: TaskStatus;
  order: number;
  totalTrackedMinutes: number;
  createdAt: string;
};

type RouteParams = {
  params: Promise<{ taskId: string }>;
};

// DELETE
const deleteTask = async (
  _req: NextRequest,
  { params }: RouteParams,
): Promise<Response> => {
  const userId = await requireUserId();
  const { taskId } = await params;

  if (!taskId) {
    return fail(
      "VALIDATION_ERROR",
      "유효한 taskId가 필요합니다.",
      400,
    );
  }

  const result: any = await execute(
    `
    DELETE FROM task
    WHERE id = ? AND user_id = ?
    `,
    [taskId, userId],
  );

  if (result.affectedRows === 0) {
    return fail(
      "TASK_NOT_FOUND",
      "삭제할 작업을 찾을 수 없습니다.",
      404,
    );
  }

  return ok({ id: taskId }, 200);
};

// PATCH
const updateTaskStatus = async (
  req: NextRequest,
  { params }: RouteParams,
): Promise<Response> => {
  const { taskId } = await params;
  const userId = await requireUserId();

  if (!taskId) {
    return fail(
      "VALIDATION_ERROR",
      "유효한 taskId가 필요합니다.",
      400,
    );
  }

  const body = await req.json();
  const { status } = body as { status?: TaskStatus };

  if (!status || !["YET", "DONE"].includes(status)) {
    return fail(
      "VALIDATION_ERROR",
      "status는 'YET' 또는 'DONE'이어야 합니다.",
      400,
    );
  }

  const result: any = await execute(
    `
    UPDATE task
    SET status = ?
    WHERE id = ? AND user_id = ?
    `,
    [status, taskId, userId],
  );

  if (result.affectedRows === 0) {
    return fail(
      "TASK_NOT_FOUND",
      "상태를 변경할 작업을 찾을 수 없습니다.",
      404,
    );
  }

  const [updated] = await query<TaskRow>(
    `
    SELECT
      id,
      user_id as userId,
      title,
      date,
      status,
      sort_order as \`order\`,
      total_tracked_minutes as totalTrackedMinutes,
      created_at as createdAt
    FROM task
    WHERE id = ?
    `,
    [taskId],
  );

  if (!updated) {
    return fail(
      "INTERNAL_SERVER_ERROR",
      "업데이트된 작업을 조회하지 못했습니다.",
      500,
    );
  }

  return ok(updated, 200);
};

export const DELETE = withErrorHandling(deleteTask);
export const PATCH = withErrorHandling(updateTaskStatus);
