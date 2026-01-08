import { auth } from "@/lib/auth";
import { fail } from "@/lib/api-utils";

export async function requireUserId(): Promise<string> {
    const session = await auth();

    if (!session?.user?.id) {
        throw fail("UNAUTHENTICATED", "로그인이 필요합니다.", 401);
    }

    return session.user.id;
}