// src/app/api/tasks/[taskId]/time/route.ts
import { NextRequest } from "next/server";
import { query, execute } from "@/lib/db";
import { ok, fail, withErrorHandling } from "@/lib/api-utils";
import { requireUserId } from "@/lib/auth-guard";


import { v4 as uuidv4 } from "uuid";

type TaskRow = {
  id: string;
  userId: string;
};

type RouteParams = {
  params: Promise<{ taskId: string }>;
};

const addTaskTime = async (
  req: NextRequest,
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

  const body = await req.json();
  const { durationMinutes } = body as { durationMinutes?: number };

  if (
    typeof durationMinutes !== "number" ||
    !Number.isFinite(durationMinutes) ||
    durationMinutes <= 0
  ) {
    return fail(
      "VALIDATION_ERROR",
      "durationMinutes는 0보다 큰 숫자여야 합니다.",
      400,
    );
  }

  const [task] = await query<TaskRow>(
    `
    SELECT id, user_id as userId
    FROM task
    WHERE id = ? AND user_id = ?
    `,
    [taskId, userId],
  );

  if (!task) {
    return fail(
      "TASK_NOT_FOUND",
      "시간을 기록할 작업을 찾을 수 없습니다.",
      404,
    );
  }

  const logId = uuidv4();

  await execute(
    `
    INSERT INTO task_time_log (id, task_id, duration_minutes)
    VALUES (?, ?, ?)
    `,
    [logId, taskId, durationMinutes],
  );

  await execute(
    `
    UPDATE task
    SET total_tracked_minutes = total_tracked_minutes + ?
    WHERE id = ? AND user_id = ?
    `,
    [durationMinutes, taskId, userId],
  );

  return ok(
    {
      taskId: taskId,
      addedMinutes: durationMinutes,
    },
    200,
  );
};

export const POST = withErrorHandling(addTaskTime);
