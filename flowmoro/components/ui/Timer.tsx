"use client";

import { useMemo } from "react";

function formatMMSS(totalSeconds: number) {
  const s = Math.max(0, Math.floor(totalSeconds));
  const mm = String(Math.floor(s / 60)).padStart(2, "0");
  const ss = String(s % 60).padStart(2, "0");
  return `${mm}:${ss}`;
}

export default function TimerCircle({
  remaining,
  totalSeconds,
}: {
  remaining: number;
  totalSeconds: number;
}) {
  const progress = useMemo(() => {
    if (!Number.isFinite(totalSeconds) || totalSeconds <= 0) return 0;
    const ratio = remaining / totalSeconds;
    return Math.max(0, Math.min(1, ratio));
  }, [remaining, totalSeconds]);

  const size = 260;
  const stroke = 14;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const dashOffset = c * (1 - progress);

  return (
    <section className="mt-6 flex justify-center">
      <div className="relative" style={{ width: size, height: size }}>
        <div className="absolute inset-0 rounded-full bg-blues-100/60" />

        <svg width={size} height={size} className="relative" aria-label="타이머 진행률">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            strokeWidth={stroke}
            className="stroke-zinc-200"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            strokeWidth={stroke}
            strokeLinecap="round"
            className="stroke-blues-500"
            strokeDasharray={c}
            strokeDashoffset={dashOffset}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-4xl font-bold tracking-tight text-zinc-800">
            {formatMMSS(remaining)}
          </div>
        </div>
      </div>
    </section>
  );
}
