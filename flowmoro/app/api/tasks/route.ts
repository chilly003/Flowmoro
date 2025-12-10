// src/app/api/tasks/route.ts
import { NextRequest } from "next/server";
import { query, execute } from "@/lib/db";
import { ok, fail, withErrorHandling } from "@/lib/api-utils";

const TEMP_USER_ID = 1; // User 테이블에 INSERT한 test user의 id

type TaskStatus = "YET" | "DONE";
type TaskRow = {
  id: number;
  userId: number;
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
    [TEMP_USER_ID, dateParam]
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
  const { title, date, order } = body as {
    title?: string,
    date?: string,
    order?: number,
  }

  if (!title || !date || typeof order !== "number") {
    return fail(
      "VALIDATION_ERROR",
      "title, date(YYYY-MM-DD), order는 필수 값입니다.",
      400,
    );
  }

  const dateTime = `${date} 00:00:00`;

  const result: any = await execute(
    `
    INSERT INTO Task (userId, title, date, status, \`order\`, totalTrackedMinutes)
    VALUES (?, ?, ?, 'YET', ?, 0)
    `,
    [TEMP_USER_ID, title, dateTime, order],
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

  if (!created){
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