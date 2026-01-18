"use client";

type ErrorScreenProps = {
  title?: string;
  description?: string;
  onRetry?: () => void;
  showReload?: boolean;
};

export default function ErrorScreen({
  title = "에러가 발생했습니다.",
  description = "재로그인 혹은 새로고침을 해주세요.",
  onRetry,
  showReload = true,
}: ErrorScreenProps) {
  return (
    <div className="flex min-h-[80vh] items-center justify-center">
      <div className="w-full max-w-sm p-6">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute bottom-3/4 left-1/4 h-120 w-120 -translate-x-1/2 rounded-full bg-blue-200/40 blur-3xl" />
          <div className="absolute top-3/4 left-3/5 h-130 w-140 rounded-full bg-blues-500/30 blur-3xl" />
        </div>

        <div className="relative space-y-2">
          <p className="text-lg text-zinc-500">{title}</p>
          <p className="text-sm text-zinc-500">{description}</p>

          <div className="mt-6 flex flex-wrap gap-2">
            {onRetry && (
              <button
                type="button"
                onClick={onRetry}
                className="rounded-md border border-zinc-200 bg-white/60 px-4 py-2 text-sm font-medium text-zinc-700 backdrop-blur"
              >
                다시 시도
              </button>
            )}

            {showReload && (
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="rounded-md border border-zinc-200 bg-white/60 
                px-4 py-2 text-sm font-medium text-zinc-700 backdrop-blur
                hover:border-blues-500/80
                "
              >
                새로고침
              </button>
            )}
          </div>

          <p className="mt-4 text-xs text-zinc-400">
            문제가 계속되면 로그아웃 후 다시 로그인해 주세요.
          </p>
        </div>
      </div>
    </div>
  );
}