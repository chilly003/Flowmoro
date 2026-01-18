"use client";

import { useEffect, useRef, useState } from "react";
import { signOut } from "next-auth/react";
import { useAuthMutations } from "@/hooks/useAuthMutations";
import { useDateStore } from "@/hooks/useDateStore";
import { IoCloud, IoMenu, IoClose, IoTodayOutline, IoLogOutOutline, IoTrashOutline } from "react-icons/io5";
import Modal from "./modal";

export default function NavBar() {
  const resetToday = useDateStore((s) => s.resetToday);
  const { withdrawMutation } = useAuthMutations();

  const [open, setOpen] = useState(false);

  const [openModal, setOpenModal] = useState(false);

  const navRef = useRef<HTMLElement | null>(null);

  const handleGoToday = () => {
    resetToday();
    setOpen(false);
  };

  const handleLogout = async () => {
    setOpen(false);
    await signOut({ callbackUrl: "/flowmoro" });
  };
  const handleWithdrawClick = () => {
    setOpen(false);
    setOpenModal(true);
  };

  const handleConfirmWithdraw = async () => {
    try {
      await withdrawMutation.mutateAsync();
      setOpenModal(false);
    } catch (e) {
      console.error(e);
      alert("회원탈퇴에 실패했습니다.");
    }
  };

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
    <>
      <nav ref={navRef} className="w-full bg-white">
        <div className="w-full max-w-xl mx-auto px-4 py-3 relative">
          {/* 상단 줄: 로고 + 메뉴 버튼 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-blues-100 text-blues-500">
                <IoCloud size={18} />
              </span>
              <span className="text-sm font-semibold text-zinc-800">Flowmoro</span>
            </div>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-zinc-100 transition"
              aria-label="메뉴"
              aria-expanded={open}
            >
              {open ? <IoClose size={20} /> : <IoMenu size={20} />}
            </button>
          </div>

          {/* ✅ 드롭다운: 레이아웃 밖으로 띄우기 */}
          {open && (
            <div className="absolute right-4 top-full mt-2 z-50">
              <div className="w-52 rounded-xl border border-zinc-200 bg-white shadow-md overflow-hidden">
                <button
                  type="button"
                  onClick={handleGoToday}
                  className="w-full px-4 py-3 text-sm text-zinc-700 hover:bg-zinc-50 active:bg-zinc-100 flex items-center gap-2"
                >
                  <IoTodayOutline size={18} className="text-zinc-500" />
                  <span>오늘로</span>
                </button>

                <div className="h-px bg-zinc-100" />

                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full px-4 py-3 text-sm text-zinc-700 hover:bg-zinc-50 active:bg-zinc-100 flex items-center gap-2"
                >
                  <IoLogOutOutline size={18} className="text-zinc-500" />
                  <span>로그아웃</span>
                </button>

                <div className="h-px bg-zinc-100" />

                <button
                  type="button"
                  onClick={handleWithdrawClick}
                  className="w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 active:bg-red-100 flex items-center gap-2"
                >
                  <IoTrashOutline size={18} className="text-red-500" />
                  <span>회원탈퇴</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* ✅ 회원탈퇴 확인 모달 */}
      <Modal
        open={openModal}
        title="회원탈퇴"
        description={
          "탈퇴 시 계정과 데이터가 삭제될 수 있습니다.\n정말로 회원탈퇴를 진행하시겠습니까?"
        }
        onClose={() => setOpenModal(false)}
        confirmText="탈퇴하기"
        confirmVariant="danger"
        onConfirm={handleConfirmWithdraw}
        loading={withdrawMutation.isPending}
      />
    </>
  );
}
