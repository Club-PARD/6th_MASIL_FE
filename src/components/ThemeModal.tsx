"use client";

import { useEffect, useState } from "react";
import { useThemeStore } from "@/stores/useTripStore";

type Props = {
  open: boolean;
  onClose: () => void;
};

const THEME_OPTIONS = [
  {
    title: "축제·문화 탐방",
    subtitle: "축제, 박물관 관람",
    icon: "🎠",
  },
  {
    title: "원데이 클래스 체험",
    subtitle: "베이킹, 공방 체험",
    icon: "🎨",
  },
  {
    title: "자연 경관 감상",
    subtitle: "공원, 산, 산책로 걷기",
    icon: "🏔️",
  },
  {
    title: "쇼핑",
    subtitle: "쇼핑 거리, 시장 구경",
    icon: "🛍️",
  },
];

export default function ThemeModal({ open, onClose }: Props) {
  const { theme, setTheme } = useThemeStore();
  const [headerText, setHeaderText] = useState<string>(
    theme || "원하시는 나들이 테마를 선택해 주세요"
  );

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
        className="flex flex-col justify-center items-center rounded-2xl bg-[#f5f5f5] w-[550px] p-10 gap-[15px] shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between w-full text-2xl">
          <div className="text-[#282828] text-2xl font-semibold font-['Pretendard']">
            나들이 테마
          </div>
          <button
            aria-label="닫기"
            className="rounded size-8 hover:bg-black/5"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {/* 컨텐츠 */}
        <div className="flex flex-col w-full items-center justify-center gap-5">
          <div
            className={`flex items-center justify-center w-full h-[50px] py-3 bg-white rounded-[10px] text-base font-semibold font-['Pretendard'] ${
              theme === "" ? "text-[#fe7600]" : "text-[#282828]"
            }`}
          >
            {headerText}
          </div>

          <div className="flex flex-wrap w-full justify-center gap-2.5">
            {THEME_OPTIONS.map((option) => (
              <button
                key={option.title}
                className={`flex flex-col items-center justify-center w-[230px] h-[175px] rounded-[10px] font-['Pretendard'] ${
                  theme === option.title
                    ? "bg-[#FE7600] text-white"
                    : "bg-white text-[#282828] hover:bg-[#FE7600] hover:text-white"
                }`}
                onClick={() => {
                  if (theme === option.title) {
                    setTheme("");
                    setHeaderText("원하시는 나들이 테마를 선택해 주세요");
                  } else {
                    setTheme(option.title);
                    setHeaderText(option.title);
                    onClose();
                  }
                }}
              >
                <div className="flex items-center justify-center w-full text-[50px]">
                  {option.icon}
                </div>
                <p className="text-xl font-semibold">{option.title}</p>
                <p className="text-base font-normal">{option.subtitle}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}