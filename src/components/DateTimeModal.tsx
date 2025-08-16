// app/components/DateTimeModal.tsx
"use client";

import { useMemo, useState } from "react";
import { useTripStore } from "@/stores/useTripStore";

type Props = { onClose: () => void };

const hours = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, "0")}:00`);
const PAGE_SIZE = 6;

export default function DateTimeModal({ onClose }: Props) {
  const {
    date, startTime, endTime, guideType,
    setDate, setStartTime, setEndTime, setGuideType,
  } = useTripStore();

  // ── 달력 뷰 상태 ─────────────────────────────────────────────
  const initial = date ? new Date(date) : new Date();
  const [viewYear, setViewYear] = useState(initial.getFullYear());
  const [viewMonth, setViewMonth] = useState(initial.getMonth()); // 0~11

  // ── 시간대 페이징 상태 (스크롤 없이 6개씩 고정 노출) ────────
  const getIdx = (t?: string | null) => (t ? hours.indexOf(t) : -1);
  const startIdx = Math.max(0, getIdx(startTime));
  const endIdx   = Math.max(0, getIdx(endTime));
  const [startPage, setStartPage] = useState(Math.floor(Math.max(0, startIdx) / PAGE_SIZE));
  const [endPage,   setEndPage]   = useState(Math.floor(Math.max(0, endIdx)   / PAGE_SIZE));
  const maxPage = Math.ceil(hours.length / PAGE_SIZE) - 1;

  const sliceForPage = (page: number) => {
    const s = page * PAGE_SIZE;
    return hours.slice(s, s + PAGE_SIZE);
  };
  const startSlice = useMemo(() => sliceForPage(startPage), [startPage]);
  const endSlice   = useMemo(() => sliceForPage(endPage), [endPage]);

  // ── 유틸 ────────────────────────────────────────────────────
  const fmt = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${dd}`;
  };

  const selectedDateObj = useMemo(() => (date ? new Date(date) : null), [date]);

  // 6주(42칸) 달력
  const calendar = useMemo(() => {
    const first = new Date(viewYear, viewMonth, 1);
    const firstDayIdx = first.getDay(); // 0=일
    const startDate = new Date(viewYear, viewMonth, 1 - firstDayIdx);
    return Array.from({ length: 42 }, (_, i) => {
      const d = new Date(startDate);
      d.setDate(startDate.getDate() + i);
      return { date: d, inMonth: d.getMonth() === viewMonth };
    });
  }, [viewYear, viewMonth]);

  // 헤더 요약
  const headerText = useMemo(() => {
    const d = selectedDateObj ?? new Date();
    const locale = d.toLocaleDateString("ko-KR", {
      year: "numeric", month: "long", day: "numeric", weekday: "short",
    });
    const st = startTime || "—";
    const et = endTime || "—";
    return `${locale}\n${st}${st && et ? " - " : ""}${et}`;
  }, [selectedDateObj, startTime, endTime]);

  const monthLabel = `${viewYear}. ${String(viewMonth + 1).padStart(2, "0")}`;

  // ── 제약: 도착은 출발 이후만(>) / 출발 먼저 선택 ────────────
  const endDisabled = !startTime;
  const canApply = Boolean(startTime && endTime && getIdx(endTime) > getIdx(startTime));

  const handleApply = () => {
    if (!canApply) return;
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center" onClick={onClose}>
      <div
        className="bg-white w-full max-w-[640px] rounded-2xl p-4 shadow-2xl max-h-[520px] overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 상단 */}
        <div className="flex items-start justify-between mb-2">
          <h2 className="text-lg font-semibold">출발일 및 소요시간</h2>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded hover:bg-gray-100 grid place-items-center text-lg"
            aria-label="닫기"
          >
            ✕
          </button>
        </div>

        {/* 요약 */}
        <div className="bg-gray-100 rounded-lg py-2 px-3 text-center mb-2 whitespace-pre-line text-sm">
          <div className="font-medium leading-tight">{headerText}</div>
        </div>

        {/* 달력 */}
        <div className="mb-2">
          <div className="flex items-center justify-between mb-1">
            <button
              onClick={() => setViewMonth(m => (m === 0 ? (setViewYear(y => y - 1), 11) : m - 1))}
              className="px-2 py-1 rounded hover:bg-gray-100"
              aria-label="이전 달"
            >
              ‹
            </button>
            <div className="text-base font-semibold">{monthLabel}</div>
            <button
              onClick={() => setViewMonth(m => (m === 11 ? (setViewYear(y => y + 1), 0) : m + 1))}
              className="px-2 py-1 rounded hover:bg-gray-100"
              aria-label="다음 달"
            >
              ›
            </button>
          </div>

          <div className="grid grid-cols-7 text-center text-[11px] text-gray-500 mb-1">
            {["일","월","화","수","목","금","토"].map((w) => (
              <div key={w} className="py-1">{w}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {calendar.map(({ date: d, inMonth }, idx) => {
              const isSelected = selectedDateObj ? fmt(d) === fmt(selectedDateObj) : false;
              const isToday = fmt(d) === fmt(new Date());
              return (
                <button
                  key={idx}
                  onClick={() => setDate(fmt(d))}
                  className={[
                    "h-10 rounded-md text-sm leading-none border",
                    isSelected
                      ? "bg-black text-white border-black"
                      : inMonth
                        ? "bg-gray-50 hover:bg-gray-100 border-gray-200"
                        : "bg-white text-gray-300 border-gray-200",
                    isToday && !isSelected ? "ring-1 ring-gray-300" : "",
                  ].join(" ")}
                >
                  {d.getDate()}
                </button>
              );
            })}
          </div>
        </div>

        {/* 출발 시간대 (스크롤 없음 · 6개씩 페이징) */}
        <div className="text-center text-xs text-gray-600 mb-2">출발 시간대 선택</div>
        <div className="flex items-center gap-2 mb-3">
          <button
            className="px-2 py-1 hover:bg-gray-50"
            onClick={() => setStartPage(p => Math.max(0, p - 1))}
            aria-label="이전 6개"
            disabled={startPage === 0}
          >
            ‹
          </button>

          <div className="flex-1">
            <div className="flex gap-2 justify-center">
              {startSlice.map((h) => (
                <button
                  key={`s-${h}`}
                  onClick={() => {
                    setStartTime(h);
                    // 출발 변경 시, 도착이 없거나 출발 이하(<=)면 도착 초기화
                    if (!endTime || getIdx(endTime) <= getIdx(h)) setEndTime(null as any);

                    // 출발 선택 페이지로 점프
                    const idx = getIdx(h);
                    const page = Math.floor(idx / PAGE_SIZE);
                    if (page !== startPage) setStartPage(page);

                    // 도착 페이지를 최소 (출발 다음 인덱스) 페이지로 보정
                    const minEndIdx = Math.min(hours.length - 1, idx + 1);
                    const minEndPage = Math.floor(minEndIdx / PAGE_SIZE);
                    if (endPage < minEndPage) setEndPage(minEndPage);
                  }}
                  className={[
                    "px-4 py-2 rounded-full border text-sm",
                    startTime === h
                      ? "bg-black text-white border-black"
                      : "bg-white hover:bg-gray-50 border-gray-300",
                  ].join(" ")}
                >
                  {h.replace(":00", "시")}
                </button>
              ))}
            </div>
          </div>

          <button
            className="px-2 py-1 hover:bg-gray-50"
            onClick={() => setStartPage(p => Math.min(maxPage, p + 1))}
            aria-label="다음 6개"
            disabled={startPage === maxPage}
          >
            ›
          </button>
        </div>

        {/* 도착 시간대 (출발 선택 전 비활성화, 출발보다 큰 값만 허용) */}
        <div className="text-center text-xs text-gray-600 mb-2">
          도착 시간대 선택
        </div>

        <div className="flex items-center gap-2 mb-4">
          <button
            className={`px-2 py-1 hover:bg-gray-50 ${endDisabled ? "opacity-40 cursor-not-allowed" : ""}`}
            onClick={() => !endDisabled && setEndPage(p => Math.max(0, p - 1))}
            aria-label="이전 6개"
            disabled={endDisabled || endPage === 0}
          >
            ‹
          </button>

          <div className="flex-1">
            <div className="flex gap-2 justify-center">
              {endSlice.map((h) => {
                const invalidByOrder = startTime ? getIdx(h) <= getIdx(startTime) + 1 : true; // 출발 이하(<=) 금지
                const disabled = endDisabled || invalidByOrder;

                return (
                  <button
                    key={`e-${h}`}
                    onClick={() => {
                      if (disabled) return;
                      setEndTime(h);

                      // 선택 페이지로 점프
                      const idx = getIdx(h);
                      const page = Math.floor(idx / PAGE_SIZE);
                      if (page !== endPage) setEndPage(page);
                    }}
                    className={[
                      "px-4 py-2 rounded-full border text-sm",
                      disabled
                        ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                        : endTime === h
                          ? "bg-black text-white border-black"
                          : "bg-white hover:bg-gray-50 border-gray-300",
                    ].join(" ")}
                    aria-disabled={disabled}
                    title={invalidByOrder ? "도착은 출발 이후만 선택할 수 있습니다" : ""}
                  >
                    {h.replace(":00", "시")}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            className={`px-2 py-1 hover:bg-gray-50 ${endDisabled ? "opacity-40 cursor-not-allowed" : ""}`}
            onClick={() => !endDisabled && setEndPage(p => Math.min(maxPage, p + 1))}
            aria-label="다음 6개"
            disabled={endDisabled || endPage === maxPage}
          >
            ›
          </button>
        </div>

        {/* 가이드 유형 */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="w-[560px] justify-start text-아웃라인-차콜 text-base font-normal font-['Pretendard']">편도 가이드는 가는 길만, 왕복 가이드는 가는 길·오는 길 모두 포함하여 안내합니다.</div><br></br>
          <button
            onClick={() => setGuideType("편도 가이드")}
            className={[
              "h-10 rounded-md border text-sm",
              guideType === "편도 가이드" ? "bg-black text-white border-black" : "bg-white hover:bg-gray-50 border-gray-300",
            ].join(" ")}
          >
            편도 가이드
          </button>
          <button
            onClick={() => setGuideType("왕복 가이드")}
            className={[
              "h-10 rounded-md border text-sm",
              guideType === "왕복 가이드" ? "bg-black text-white border-black" : "bg-white hover:bg-gray-50 border-gray-300",
            ].join(" ")}
          >
            왕복 가이드
          </button>
        </div>

        {/* 적용 */}
        <button
          onClick={handleApply}
          disabled={!canApply}
          className={`w-full h-11 rounded-md text-base font-semibold hover:brightness-110
            ${canApply ? "bg-gray-700 text-white" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
        >
          적용
        </button>
      </div>
    </div>
  );
}
