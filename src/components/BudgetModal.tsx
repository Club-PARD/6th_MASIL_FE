"use client";

import { useEffect } from "react";
import { useBudgetState, usePeopleState } from "@/stores/useTripStore";

type Props = {
  open: boolean;
  onClose: () => void;
};
export default function BudgetModal({ open, onClose }: Props) {
  const { people } = usePeopleState();
  const { budget, setBudget } = useBudgetState();

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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="flex flex-col justify-center items-center rounded-2xl bg-neutral-100 w-[632px] p-10 gap-[15px] shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col justify-center items-center w-full">
          {/* 헤더 */}
          <div className="flex items-center justify-between w-full text-2xl">
            <div className="text-[#282828] text-2xl font-semibold font-['Pretendard']">예산</div>
            <button
              aria-label="닫기"
              className="rounded size-8 hover:bg-black/5"
              onClick={onClose}
            >
              ✕
            </button>
          </div>

          {/* 안내 배너 */}
          <div className="mt-3 rounded-xl py-2 text-center text-base text-[#FE7600] font-semibold font-['Pretendard']">
            나들이 갈 때 인당 예산을 입력해 주세요
          </div>

          {/* 예산 입력칸 */}
          

          {/* 인당 예산 */}
          <div className="flex justify-between items-center w-full px-16 py-5 rounded-[5px] bg-white">
            <div className="flex flex-col justify-center items-end w-28">
              <div className="text-[#282828] text-base font-normal font-['Pretendard'] gap-2.5">
                인당 예산
              </div>
              <span className="text-[#282828] text-xl font-semibold font-['Pretendard']">
                {budget}만원
              </span>
            </div>

            <hr className="w-px h-10 bg-[#7F7F7F] border border-1 border-[#7f7f7f]" />

            {/* 전체 예산 */}
            <div className="flex flex-col justify-center items-start w-28">
              <div className="text-[#282828] text-base font-normal font-['Pretendard'] gap-2.5">
                전체 예산
              </div>
              <span className="text-[#282828] text-xl font-semibold font-['Pretendard']">
                {budget * people}만원
              </span>
            </div>
          </div>
        </div>

        {/* 적용 버튼 */}
        <button className="w-full p-4 bg-white text-xl text-[#FE7600] font-semibold font-['Pretendard'] rounded-[5px] shadow-lg hover:bg-[#FE7600] hover:text-white">
            적용
        </button>
      </div>
    </div>
  );
}
