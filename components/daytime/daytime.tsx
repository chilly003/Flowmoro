"use client";

import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { useDateStore } from "@/hooks/useDateStore";

function startOfDay(date: Date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function addDays(date: Date, diff: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + diff);
  return startOfDay(d);
}

function formatKoreanDate(date: Date) {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
  }).format(date);
}

export default function Daytime() {
  const selectedDate = useDateStore((s) => s.selectedDate);
  const prevDay = useDateStore((s) => s.prevDay);
  const nextDay = useDateStore((s) => s.nextDay);
  // const resetToday = useDateStore((s) => s.resetToday);

  const displayLabel = formatKoreanDate(selectedDate);

  return (
    <section className="w-full max-w-xl mx-auto py-6 px-6">
      {/* 날짜 선택 바 */}
      <div
        className="
          flex items-center justify-between gap-3
          bg-blues-100 px-4 py-3
        "
      >
        {/* 이전 날짜 버튼 */}
        <button
          type="button"
          onClick={useDateStore().prevDay}
          className="
            flex items-center justify-center
            h-10 w-10
            rounded-full
            bg-white
            text-blues-500
            hover:bg-blues-200
            transition
          "
          aria-label="이전 날"
        >
          <IoChevronBack size={20} />
        </button>

        {/* 가운데 날짜/리셋 영역 */}
        <div className="flex flex-col items-center gap-1">
          <div
            className="
              px-5 py-3
              rounded-full
              bg-white
              text-lg font-semibold
              text-blues-500
              border border-blues-400
            "
          >
            {displayLabel}
          </div>

          {/* <button
            type="button"
            onClick={handleResetToday}
            className="
              mt-1 inline-flex items-center gap-1
              px-2.5 py-1
              rounded-full
              bg-blues-200/70
              text-[11px] font-medium
              text-blues-500
              hover:bg-blues-200
              transition
            "
          >
            오늘로
          </button> */}
        </div>

        {/* 다음 날짜 버튼 */}
        <button
          type="button"
          onClick={nextDay}
          className="
            flex items-center justify-center
            h-10 w-10
            rounded-full
            bg-white
            text-blues-500
            hover:bg-blues-200
            transition
          "
          aria-label="다음 날"
        >
          <IoChevronForward size={20} />
        </button>
      </div>
    </section>
  );
}
