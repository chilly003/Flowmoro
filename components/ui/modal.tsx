"use client";

type ModalProps = {
  open: boolean;
  title: string;
  description: string;
  onClose: () => void;

  // ✅ 옵션: 확인 버튼
  confirmText?: string;
  onConfirm?: () => void | Promise<void>;
  confirmVariant?: "default" | "danger";
  loading?: boolean;
};

export default function Modal({
  open,
  title,
  description,
  onClose,
  confirmText,
  onConfirm,
  confirmVariant = "default",
  loading = false,
}: ModalProps) {
  if (!open) return null;

  const confirmClass =
    confirmVariant === "danger"
      ? "bg-red-500 hover:bg-red-600"
      : "bg-blues-400 hover:bg-blues-500";

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 px-4"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onMouseDown={onClose}
    >
      <div
        className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold text-zinc-900">{title}</h2>
        <p className="mt-2 text-sm text-zinc-600 whitespace-pre-line">
          {description}
        </p>

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md px-4 py-2 text-sm border border-zinc-200 text-zinc-700 hover:bg-zinc-50"
            disabled={loading}
          >
            닫기
          </button>

          {confirmText && onConfirm && (
            <button
              type="button"
              onClick={onConfirm}
              className={`rounded-md px-4 py-2 text-sm text-white disabled:opacity-60 ${confirmClass}`}
              disabled={loading}
            >
              {loading ? "처리 중..." : confirmText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
