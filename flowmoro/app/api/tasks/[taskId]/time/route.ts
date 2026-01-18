// src/app/api/tasks/[taskId]/time/route.ts
import { NextRequest } from "next/server";
import { query, execute } from "@/lib/db";
import { ok, fail, withErrorHandling } from "@/lib/api-utils";
import { requireUserId } from "@/lib/auth-guard";


type TaskRow = {
  id: number;
  userId: number;
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
  const id = Number(taskId);
  
  if (!taskId || Number.isNaN(id)) {
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
    SELECT id, userId
    FROM Task
    WHERE id = ? AND userId = ?
    `,
    [id, userId],
  );

  if (!task) {
    return fail(
      "TASK_NOT_FOUND",
      "시간을 기록할 작업을 찾을 수 없습니다.",
      404,
    );
  }

  await execute(
    `
    INSERT INTO TaskTimeLog (taskId, durationMinutes)
    VALUES (?, ?)
    `,
    [id, durationMinutes],
  );

  await execute(
    `
    UPDATE Task
    SET totalTrackedMinutes = totalTrackedMinutes + ?
    WHERE id = ? AND userId = ?
    `,
    [durationMinutes, id, userId],
  );

  return ok(
    {
      taskId: id,
      addedMinutes: durationMinutes,
    },
    200,
  );
};

export const POST = withErrorHandling(addTaskTime);
