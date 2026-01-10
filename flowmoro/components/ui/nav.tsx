"use client";

import { useEffect, useRef, useState } from "react";
import { signOut } from "next-auth/react";
import {useAuthMutations} from '@/hooks/useAuthMutations'
import { useDateStore } from "@/hooks/useDateStore";
import { IoLeaf, IoMenu, IoClose } from "react-icons/io5";

export default function NavBar() {
  const resetToday = useDateStore((s) => s.resetToday);
  const [open, setOpen] = useState(false);
  const {withdrawMutation} = useAuthMutations();

  const navRef = useRef<HTMLElement | null>(null);

  const handleGoToday = () => {
    resetToday();
    setOpen(false);
  };

  const handleLogout = async () => {
    setOpen(false);
    await signOut({ callbackUrl: "/flowmoro" });
  };

  const handleWithdraw = async () => {
    const ok = window.confirm(
        "회원탈퇴를 진행하면 계정 및 데이터가 삭제됩니다. 계속하시겠습니까?"
    );
    if (!ok) return;

    setOpen(false);

    try{
        await withdrawMutation.mutateAsync();
    }catch(e){
        console.error(e);
        alert("회원탈퇴에 실패했습니다.");
    }
  };

  // 바깥 클릭 시 닫기 (nav 전체 기준)
  useEffect(() => {
    if (!open) return;

    const onDown = (e: MouseEvent) => {
      if (!navRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    window.addEventListener("mousedown", onDown);
    return () => window.removeEventListener("mousedown", onDown);
  }, [open]);

  return (
    <nav ref={navRef} className="w-full border-b bg-white">
      <div className="w-full max-w-xl mx-auto px-4 py-3">
        {/* 상단 줄: 로고 + 메뉴 버튼 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-blues-100 text-blues-500">
              <IoLeaf size={18} />
            </span>
            <span className="text-sm font-semibold text-zinc-800">Flowmoro</span>
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="
              inline-flex h-10 w-10 items-center justify-center
              rounded-full hover:bg-zinc-100 transition
            "
            aria-label="메뉴"
            aria-expanded={open}
          >
            {open ? <IoClose size={20} /> : <IoMenu size={20} />}
          </button>
        </div>

        {/* ✅ open이면 nav 영역이 아래로 늘어나면서 메뉴가 보임 */}
        {open && (
          <div className="mt-3 flex justify-end">
            <div className="w-40">
              <button
                type="button"
                onClick={handleGoToday}
                className="
                  w-full px-4 py-2 text-sm
                  text-blues-300
                  hover:text-blues-500
                "
              >
                오늘로
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="
                  w-full px-4 py-2 text-sm
                  text-blues-300
                  hover:text-blues-500
                "
              >
                로그아웃
              </button>

              <button
                type="button"
                onClick={handleWithdraw}
                className="
                  w-full px-4 py-2 text-sm
                  text-blues-300
                  hover:text-blues-500
                "
              >
                회원탈퇴
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
