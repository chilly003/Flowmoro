// src/app/api/tasks/reorder/route.ts
import { NextRequest } from "next/server";
import { execute } from "@/lib/db";
import { ok, fail, withErrorHandling } from "@/lib/api-utils";
import { requireUserId } from "@/lib/auth-guard";

interface ReorderBody {
  date?: string;
  orderedIds?: number[];
}

const reorderTasks = async (req: NextRequest): Promise<Response> => {
  const body = (await req.json()) as ReorderBody;
  const { date, orderedIds } = body;
  const userId = await requireUserId();

  if (!date || !Array.isArray(orderedIds) || orderedIds.length === 0) {
    return fail(
      "VALIDATION_ERROR",
      "date와 orderedIds 배열이 필요합니다.",
      400,
    );
  }

  let order = 1;

  for (const taskId of orderedIds) {
    await execute(
      `
      UPDATE Task
      SET \`order\` = ?
      WHERE id = ? AND userId = ? AND DATE(date) = ?
      `,
      [order, taskId, userId, date],
    );

    order++;
  }

  return ok(
    {
      date,
      total: orderedIds.length,
    },
    200,
  );
};

export const POST = withErrorHandling(reorderTasks);
