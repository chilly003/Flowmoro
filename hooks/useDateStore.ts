//hooks/useDateStore.ts
import { create } from "zustand";

function startOfDay(date: Date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function toYYYYMMDD(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

type DateState = {
  selectedDate: Date;        // UI 표시용 (Date)
  selectedDateKey: string;   // API 쿼리용 ("YYYY-MM-DD")
  setSelectedDate: (date: Date) => void;
  prevDay: () => void;
  nextDay: () => void;
  resetToday: () => void;
};

export const useDateStore = create<DateState>((set, get) => ({
  selectedDate: startOfDay(new Date()),
  selectedDateKey: toYYYYMMDD(startOfDay(new Date())),

  setSelectedDate: (date) => {
    const day = startOfDay(date);
    set({ selectedDate: day, selectedDateKey: toYYYYMMDD(day) });
  },

  prevDay: () => {
    const cur = get().selectedDate;
    const d = new Date(cur);
    d.setDate(d.getDate() - 1);
    const day = startOfDay(d);
    set({ selectedDate: day, selectedDateKey: toYYYYMMDD(day) });
  },

  nextDay: () => {
    const cur = get().selectedDate;
    const d = new Date(cur);
    d.setDate(d.getDate() + 1);
    const day = startOfDay(d);
    set({ selectedDate: day, selectedDateKey: toYYYYMMDD(day) });
  },

  resetToday: () => {
    const day = startOfDay(new Date());
    set({ selectedDate: day, selectedDateKey: toYYYYMMDD(day) });
  },
}));
