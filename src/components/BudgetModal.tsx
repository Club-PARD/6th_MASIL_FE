"use client";

import { useEffect, useState } from "react";
import { useBudgetState, usePeopleState } from "@/stores/useTripStore";

type Props = {
  open: boolean;
  onClose: () => void;
};
export default function BudgetModal({ open, onClose }: Props) {
  const { people } = usePeopleState();
  const { budget, setBudget } = useBudgetState();
  const [tempBudget, setTempBudget] = useState(0);

  //   모달이 열릴 때 예산 상태를 임시로 설정
  useEffect(() => {
    if (open) {
      setTempBudget(budget);
    }
  }, [open, budget]);

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

  // 적용 버튼 핸들러
  const handleApply = () => {
    setBudget(tempBudget);
    onClose();
  };

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
        <div className="flex flex-col justify-center items-center w-full gap-6">
          {/* 헤더 */}
          <div className="flex items-center justify-between w-full text-2xl">
            <div className="text-[#282828] text-2xl font-semibold font-['Pretendard']">
              예산
            </div>
            <button
              aria-label="닫기"
              className="rounded size-8 hover:bg-black/5"
              onClick={onClose}
            >
              ✕
            </button>
          </div>

          {/* 안내 배너 및 예산 입력란 */}
          <div>
            <div className="mt-3 rounded-xl py-2 text-center text-base text-[#FE7600] font-semibold font-['Pretendard']">
              나들이 갈 때 인당 예산을 입력해 주세요
            </div>

            <div className="select-none">
              <div className="mt-1 flex items-center justify-center gap-3">
                <button
                  onClick={() => setTempBudget(Math.max(0, tempBudget - 1))}
                  disabled={tempBudget === 0}
                  className={`size-8 rounded-full text-lg font-bold transition-colors duration-200 ${
                    tempBudget === 0 
                      ? "bg-[#C2C2C2] text-white cursor-not-allowed" 
                      : "bg-[#282828] text-white hover:bg-[#FE7600] active:scale-95"
                  }`}
                  aria-label="감소"
                >
                  −
                </button>
                <span className="w-22 text-[#282828] text-3xl font-semibold font-['Pretendard']">
                  {tempBudget}만원
                </span>
                <button
                  onClick={() => setTempBudget(Math.min(10, tempBudget + 1))}
                  disabled={tempBudget === 10}
                  className={`size-8 rounded-full text-lg font-bold transition-colors duration-200 ${
                    tempBudget === 10 
                      ? "bg-[#C2C2C2] text-white cursor-not-allowed" 
                      : "bg-[#282828] text-white hover:bg-[#FE7600] active:scale-95"
                  }`}
                  aria-label="증가"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* 인당 예산 */}
          <div className="flex justify-between items-center w-full px-16 py-5 mt-6 rounded-[5px] bg-white">
            <div className="flex flex-col justify-center items-end w-28">
              <div className="text-[#282828] text-base font-normal font-['Pretendard'] gap-2.5">
                인당 예산
              </div>
              <span className="text-[#282828] text-xl font-semibold font-['Pretendard']">
                {tempBudget}만원
              </span>
            </div>

            <hr className="w-px h-10 bg-[#7F7F7F] border border-1 border-[#7f7f7f]" />

            {/* 전체 예산 */}
            <div className="flex flex-col justify-center items-start w-28">
              <div className="text-[#282828] text-base font-normal font-['Pretendard'] gap-2.5">
                전체 예산
              </div>
              <span className="text-[#282828] text-xl font-semibold font-['Pretendard']">
                {tempBudget * people}만원
              </span>
            </div>
          </div>
        </div>

        {/* 적용 버튼 */}
        <button
          className="w-full p-4 bg-white text-xl text-[#FE7600] font-semibold font-['Pretendard'] rounded-[5px] shadow-lg hover:bg-[#FE7600] hover:text-white"
          onClick={handleApply}
        >
          적용
        </button>
      </div>
    </div>
  );
}
