"use client";

type LoadingScreenProps = {
    title?: string;
    description?: string;
};

export default function LoadingScreen({
    title = "로딩 중입니다",
    description = "잠시만 기다려 주세요.",
}: LoadingScreenProps) {
    return (
        <div className="flex min-h-[80vh] items-center justify-center ">
            <div className="w-full max-w-sm p-6 ">
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="absolute bottom-3/4 left-1/4 h-120 w-120 -translate-x-1/2 rounded-full bg-blue-200/40 blur-3xl" />
                    <div className="absolute top-3/4 left-3/5 h-130 w-140 rounded-full bg-blues-500/30 blur-3xl" />
                </div>
                <div className="space-y-2">
                    <p className="text-lg text-zinc-500">{title}</p>
                    <p className="text-sm text-zinc-500">{description}</p>
                </div>
            </div>
        </div>
    );
}
