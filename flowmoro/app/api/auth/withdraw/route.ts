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
        FROM TASKTIMELOG ttl
        INNER JOIN TASK t ON ttl.taskId = t.id
        WHERE t.userId = ?
        `,
        [userId]
      );

      await conn.execute("DELETE FROM TASK WHERE userId = ?", [userId]);
      await conn.execute("DELETE FROM USER WHERE id = ?", [userId]);
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[WITHDRAW ERROR]", e);
    return NextResponse.json({ ok: false, message: "Withdraw failed" }, { status: 500 });
  }
}
