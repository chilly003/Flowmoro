export { auth as middleware } from "@/lib/auth"

export const config = {
    matcher: [
        "/app/main/:path*",
        "/app/timer/:path*",
        "/app/time/:path*",
    ],
}
