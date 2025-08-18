"use client";

import { useEffect } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
};
export default function GuideDetailModal({ open, onClose }: Props) {
  //   ESC 키로 모달 닫기
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  //   모달 닫혀 있을 시 렌더링 X
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/40 gap-[22px]"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="flex flex-col justify-center items-center rounded-2xl bg-neutral-100 w-[632px] p-10 gap-[15px] shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-row items-center justify-center">
          <button className="" onClick={onClose}>
            닫기
          </button>
          <button>다운로드</button>
        </div>
      </div>
    </div>
  );
}
