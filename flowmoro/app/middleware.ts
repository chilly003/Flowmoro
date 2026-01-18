import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function middleware(req: Request) {
  const session = await auth();
  const url = new URL(req.url);

  const isLoggedIn = !!session?.user;
  const isAuthPage = url.pathname.startsWith("/flowmoro");

  // 로그인한 상태에서 로그인 페이지 접근 → /main
  if (isLoggedIn && isAuthPage) {
    return NextResponse.redirect(new URL("/main", url));
  }

  // 로그인 안 한 상태에서 보호된 페이지 접근 → /flowmoro
  if (!isLoggedIn && !isAuthPage) {
    return NextResponse.redirect(new URL("/flowmoro", url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/flowmoro",
    "/main/:path*",
    "/timer/:path*",
    "/time/:path*",
  ],
};
