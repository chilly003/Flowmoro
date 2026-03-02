import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { withTransaction } from "@/lib/db";

export async function DELETE() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    await withTransaction(async (conn) => {
      await conn.execute(
        `
        DELETE ttl
        FROM task_time_log ttl
        INNER JOIN task t ON ttl.task_id = t.id
        WHERE t.user_id = ?
        `,
        [userId]
      );

      await conn.execute("DELETE FROM task WHERE user_id = ?", [userId]);
      await conn.execute("DELETE FROM user WHERE id = ?", [userId]);
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false, message: "Withdraw failed" }, { status: 500 });
  }
}
