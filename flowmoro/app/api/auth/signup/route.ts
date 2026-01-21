import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { execute, query } from "@/lib/db";
import { v4 as uuidv4 } from 'uuid';

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
    const userId = uuidv4();

    await execute(
        "INSERT INTO user (id, email, password_hash) VALUES (?, ?, ?)",
        [userId, normalizedEmail, passwordHash],
    )

    return NextResponse.json({ success: true, data: { id: userId, email: normalizedEmail } });
}