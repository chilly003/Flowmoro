export { auth as middleware } from "@/lib/auth"

export const config = {
    matcher: [
        "/main/:path*",
        "/timer/:path*",
        "/time/:path*",
    ],
}
