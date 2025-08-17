"use client";

import { useEffect } from "react";
import { useThemeState } from "@/stores/useTripStore";

type Props = {
  open: boolean;
  onClose: () => void;
};

const THEME_OPTIONS: Array<
  "" | "축제·문화 탐방" | "원데이 클래스 체험" | "자연 경관 감상" | "쇼핑"
> = ["축제·문화 탐방", "원데이 클래스 체험", "자연 경관 감상", "쇼핑"];

export default function ThemeModal({ open, onClose }: Props) {
  const { theme, setTheme } = useThemeState();

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
        className="w-[340px] rounded-2xl bg-white p-4 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        
      </div>
    </div>
  );
}
