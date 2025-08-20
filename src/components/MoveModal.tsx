/**
 * MoveModal.tsx
 * --------------------------------------------------------------------
 * - 이미지 경로(왼→오): /public/bus.svg, /public/bus2.svg, /public/run.svg
 * - 카드 색: "호버 시에만" 오렌지 반전(배경/테두리/텍스트)
 * - 배너 문구: 선택되면 고른 이동수단(자차/대중교통/도보)로 표시,
 *              선택 전에는 안내 문구 노출
 * - 클릭 시 선택 저장 후 모달 닫힘 (배너 변화 즉시 보고 싶으면 onClose() 주석 처리)
 * --------------------------------------------------------------------
 */

"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useMoveStore } from "@/stores/useTripStore";

type Props = {
  open: boolean;
  onClose: () => void;
};

const CARDS: { value: "자차" | "대중교통" | "도보"; label: string; img: string }[] = [
  { value: "자차",     label: "자차",     img: "/bus.svg"  }, // 왼쪽
  { value: "대중교통", label: "대중교통", img: "/bus2.svg" }, // 가운데
  { value: "도보",     label: "도보",     img: "/run.svg"  }, // 오른쪽
];

export default function MoveModal({ open, onClose }: Props) {
  const { car, setCar } = useMoveStore();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
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
        className="flex flex-col items-center justify-center w-[720px] max-w-[90vw] rounded-[22px] bg-[#f5f5f5] p-6 p-10 gap-2.5 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between w-full text-2xl">
          <div className="text-[#282828] text-2xl font-semibold font-['Pretendard']">
            이동수단
          </div>
          <button
            aria-label="닫기"
            className="rounded size-8 hover:bg-black/5"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {/* 안내 배너 (선택값 반영) */}
        <div className="className={`flex items-center justify-center w-full h-[50px] py-3 bg-white rounded-[10px] text-base font-semibold font-['Pretendard']">
          {car ? (
            <span className="text-[#282828]">{car}</span>
          ) : (
          <span className="text-[#FE7600]">나들이 갈 때 이용할 이동수단을 선택해 주세요</span>          )}
        </div>

        {/* 옵션 그리드 */}
        <div className="flex flex-row items-center justify-center w-full grid grid-cols-3 gap-6">
          {CARDS.map(({ value, label, img }) => {
            const selected = car === value;

            // 공통 클래스
            const base =
              "group h-56 rounded-2xl transition-colors flex items-center justify-center";
            // 호버 반전(선택 여부와 무관)
            const hoverCls =
              "bg-white border-gray-200 hover:bg-orange-500 hover:border-orange-500 hover:text-white hover:shadow-lg";

            return (
              <button
                key={value}
                onClick={() => {
                  setCar(value);
                  onClose(); // 배너 변화 즉시 확인하려면 이 줄을 주석 처리
                }}
                className={[base, hoverCls].join(" ")}
              >
                <div className="flex flex-col items-center">
                  <Image
                    src={img}
                    alt={label}
                    width={96}
                    height={96}
                    priority
                  />
                  <div
                    className={[
                      "mt-4 text-lg font-semibold",
                      selected ? "text-black" : "text-black group-hover:text-white",
                    ].join(" ")}
                  >
                    {label}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
