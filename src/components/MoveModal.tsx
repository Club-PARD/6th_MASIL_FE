"use client";

import { useEffect } from "react";
import { useMoveState } from "@/stores/useTripStore";

type Props = {
  open: boolean;
  onClose: () => void;
};

const OPTIONS: Array<"" | "자차" | "대중교통" | "도보"> = ["자차", "대중교통", "도보"];

export default function MoveModal({ open, onClose }: Props) {
  const { car, setCar } =  useMoveState();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="w-[340px] rounded-2xl bg-white p-4 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <div className="text-lg font-semibold">이동수단</div>
          <button
            aria-label="닫기"
            className="rounded-full p-1 hover:bg-black/5"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {/* 안내 배너 */}
        <div className="mt-3 rounded-xl bg-green-50 py-2 text-center text-xs text-green-700">
          나들이 갈 때 이용할 이동수단을 선택해 주세요
        </div>

        {/* 옵션 그리드 */}
        <div className="mt-4 grid grid-cols-3 gap-3">
          {OPTIONS.map((opt) => {
            const selected = car === opt;
            return (
              <button
                key={opt}
                onClick={() => setCar(opt)}
                className={[
                  "h-24 rounded-xl border text-sm font-medium transition",
                  selected
                    ? "border-green-600 bg-green-100"
                    : "border-black/10 hover:bg-black/5",
                ].join(" ")}
              >
                <div className="mt-6">{opt}</div>
              </button>
            );
          })}
        </div>

        {/* 하단 버튼 */}
        <div className="mt-5 flex justify-end gap-2">
          <button
            className="rounded-lg border border-black/10 px-4 py-2 text-sm hover:bg-black/5"
            onClick={() => { setCar(""); onClose(); }}
          >
            초기화
          </button>
          <button
            className="rounded-lg bg-black px-4 py-2 text-sm text-white hover:opacity-90"
            onClick={onClose}
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}
