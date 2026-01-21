// src/app/api/tasks/route.ts
import { NextRequest } from "next/server";
import { query, execute } from "@/lib/db";
import { ok, fail, withErrorHandling } from "@/lib/api-utils";
import { requireUserId } from "@/lib/auth-guard";

type TaskStatus = "YET" | "DONE";
type TaskRow = {
  id: number;
  userId: string;
  title: string;
  date: string;
  status: TaskStatus;
  order: number;
  totalTrackedMinutes: number;
  createdAt: string;
}

//GET
const getTasks = async (req: NextRequest): Promise<Response> => {
  const { searchParams } = new URL(req.url);
  const dateParam = searchParams.get("date");
  const userId = await requireUserId();

  if (!dateParam) {
    return fail(
      "VALIDATION_ERROR",
      "date 쿼리 파라미터가 필요합니다.",
      400
    )
  }

  const tasks = await query<TaskRow>(
    `
    SELECT id, userId, title, date, status, \`order\`, totalTrackedMinutes, createdAt
    FROM Task
    WHERE userId = ? AND DATE(date) = ?
    ORDER BY \`order\` ASC
    `,
    [userId, dateParam]
  )

  return ok(
    {
      date: dateParam,
      tasks,
    },
    200,
  )
}

//POST
const createTask = async (req: NextRequest): Promise<Response> => {
  const body = await req.json();
  const userId = await requireUserId();
  const { title, date } = body as {
    title?: string,
    date?: string,
  }

  if (!title || !date) {
    return fail(
      "VALIDATION_ERROR",
      "title, date(YYYY-MM-DD)는 필수 값입니다.",
      400,
    );
  }

  const dateTime = `${date} 00:00:00`;

  // 1) 해당 날짜의 가장 큰 order 조회
  const [row] = await query<{ maxOrder: number | null }>(
    `
    SELECT MAX(\`order\`) AS maxOrder
    FROM Task
    WHERE userId = ? AND DATE(date) = ?
    `,
    [userId, date],
  );

  const nextOrder = (row?.maxOrder ?? 0) + 1;

  // 2) 자동 계산된 order로 INSERT
  const result: any = await execute(
    `
    INSERT INTO Task (userId, title, date, status, \`order\`, totalTrackedMinutes)
    VALUES (?, ?, ?, 'YET', ?, 0)
    `,
    [userId, title, dateTime, nextOrder],
  );


  const insertedId = result.insertId as number;

  const [created] = await query<TaskRow>(
    `
    SELECT id, userId, title, date, status, \`order\`, totalTrackedMinutes, createdAt
    FROM Task
    WHERE id = ?
    `,
    [insertedId],
  );

  if (!created) {
    return fail(
      "INTERNAL_SERVER_ERROR",
      "생성된 작업을 조회하지 못했습니다.",
      500,
    )
  }

  return ok(created, 201)
}

export const GET = withErrorHandling(getTasks);
export const POST = withErrorHandling(createTask);