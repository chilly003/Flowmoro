import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { execute, query } from "@/lib/db";

type Existing = { id: string }

export async function POST(req: Request) {
    const { email, password } = (await req.json()) as {
        email?: string,
        password?: string
    }

    const normalizedEmail = email?.trim().toLowerCase();
    if (!normalizedEmail || !password || password.length < 8) {
        return NextResponse.json({ success: false, message: "잘못된 이메일 형식입니다, 비번" }, { status: 400 })
    }

    const exists = await query<Existing>(
        "SELECT id FROM user WHERE email = ? LIMIT 1",
        [normalizedEmail],
    )
    if (exists.length > 0) {
        return NextResponse.json({ success: false, message: "이미 존재하는 이메일입니다" }, { status: 400 })
    }

    const passwordHash = await bcrypt.hash(password, 12)

    const result = await execute(
        "INSERT INTO user (email, passwordHash) VALUES (?, ?)",
        [normalizedEmail, passwordHash],
    )

    // insertId를 가져오기 위해 result를 타입 단언하거나 확인해야 함
    const insertId = (result as any).insertId;

    return NextResponse.json({ success: true, data: { id: insertId, email: normalizedEmail } });
}