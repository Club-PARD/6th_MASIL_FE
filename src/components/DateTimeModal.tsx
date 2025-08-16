"use client";

import { useMemo, useState } from "react";
import { useTripStore } from "@/stores/useTripStore";

type Props = { onClose: () => void };

const HOURS = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, "0")}:00`);
const PAGE_SIZE = 6;

export default function DateTimeModal({ onClose }: Props) {
  const {
    date, startTime, endTime, guideType,
    setDate, setStartTime, setEndTime, setGuideType,
  } = useTripStore();

  // ── helpers ────────────────────────────────────────────────
  const fmt = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${dd}`;
  };
  const getIdx = (t?: string | null) => (t ? HOURS.indexOf(t) : -1);

  // 오늘 0시
  const today = useMemo(() => {
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    return t;
  }, []);

  // ── 달력 상태 ───────────────────────────────────────────────
  const base = date ? new Date(date) : new Date();
  const [viewYear, setViewYear] = useState(base.getFullYear());
  const [viewMonth, setViewMonth] = useState(base.getMonth()); // 0~11

  // 해당 월만(1일~마지막날). 월요일 시작 정렬
  const { calendarCells, prevDisabled } = useMemo(() => {
    const firstOfMonth = new Date(viewYear, viewMonth, 1);
    const lastDay = new Date(viewYear, viewMonth + 1, 0).getDate();

    // 월요일=0, ..., 일요일=6 로 보정
    const firstDayMonStart = (firstOfMonth.getDay() + 6) % 7;

    // 앞쪽 빈칸
    const leading = Array.from({ length: firstDayMonStart }, () => null as Date | null);
    // 실제 날짜들
    const days = Array.from({ length: lastDay }, (_, i) => new Date(viewYear, viewMonth, i + 1) as Date);
    const cells = [...leading, ...days];

    // 이전 달 이동 비활성화 (뷰의 1일이 오늘이 속한 달의 1일보다 과거면 막기)
    const prevMonthFirst = new Date(viewYear, viewMonth, 1, 0, 0, 0, 0);
    const curMonthFirst = new Date(today.getFullYear(), today.getMonth(), 1, 0, 0, 0, 0);
    const disablePrev = prevMonthFirst <= curMonthFirst;

    return { calendarCells: cells, prevDisabled: disablePrev };
  }, [viewYear, viewMonth, today]);

  const selectedDateObj = useMemo(() => (date ? new Date(date) : null), [date]);

  // ── 시간대 페이징 ───────────────────────────────────────────
  const startIdx = Math.max(0, getIdx(startTime));
  const endIdx = Math.max(0, getIdx(endTime));
  const [startPage, setStartPage] = useState(Math.floor(startIdx / PAGE_SIZE));
  const [endPage, setEndPage] = useState(Math.floor(endIdx / PAGE_SIZE));
  const maxPage = Math.ceil(HOURS.length / PAGE_SIZE) - 1;

  const sliceForPage = (page: number) => {
    const s = page * PAGE_SIZE;
    return HOURS.slice(s, s + PAGE_SIZE);
  };
  const startSlice = useMemo(() => sliceForPage(startPage), [startPage]);
  const endSlice = useMemo(() => sliceForPage(endPage), [endPage]);

  // ── 헤더 요약 (요일 포함) ───────────────────────────────────
  const headerText = useMemo(() => {
    const d = selectedDateObj ?? new Date();
    const locale = d.toLocaleDateString("ko-KR", {
      year: "numeric", month: "long", day: "numeric", weekday: "long",
    });
    const st = startTime || "—";
    const et = endTime || "—";
    const gt = guideType || "";
    return `${locale}\n${st}${st && et ? " - " : ""}${et}${gt ? ` · ${gt}` : ""}`;
  }, [selectedDateObj, startTime, endTime, guideType]);

  const monthLabel = `${viewYear}. ${String(viewMonth + 1).padStart(2, "0")}`;

  // ── 제약: 도착은 출발+2시간 이상 ────────────────────────────
  const endDisabled = !startTime;
  const canApply =
    !!startTime &&
    !!endTime &&
    getIdx(endTime) > getIdx(startTime) + 1;

  const handleApply = () => {
    if (!canApply) return;
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center" onClick={onClose}>
      <div
        className="bg-white w-full max-w-[640px] rounded-2xl p-4 shadow-2xl max-h-[560px] overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 상단 */}
        <div className="flex items-start justify-between mb-3">
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
        <div className="bg-gray-100 rounded-lg py-2 px-3 text-center mb-3 whitespace-pre-line text-sm">
          <div className="font-medium leading-tight">{headerText}</div>
        </div>

        {/* 달력 (해당 월만, 월요일 시작) */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={() =>
                setViewMonth((m) => (m === 0 ? (setViewYear((y) => y - 1), 11) : m - 1))
              }
              className="px-2 py-1 rounded hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="이전 달"
              disabled={prevDisabled}
            >
              ‹
            </button>
            <div className="text-base font-semibold">{monthLabel}</div>
            <button
              onClick={() =>
                setViewMonth((m) => (m === 11 ? (setViewYear((y) => y + 1), 0) : m + 1))
              }
              className="px-2 py-1 rounded hover:bg-gray-100"
              aria-label="다음 달"
            >
              ›
            </button>
          </div>

          {/* 요일 헤더: 월~일 */}
          <div className="grid grid-cols-7 text-center text-[11px] text-gray-500 mb-1">
            {["월", "화", "수", "목", "금", "토", "일"].map((w) => (
              <div key={w} className="py-1">
                {w}
              </div>
            ))}
          </div>

          {/* 그 월만 + 앞쪽 빈칸 포함 */}
          <div className="grid grid-cols-7 gap-1">
            {calendarCells.map((d, idx) => {
              if (!d) {
                // 앞쪽 빈칸
                return <div key={`empty-${idx}`} />;
              }

              const isSelected = selectedDateObj ? fmt(d) === fmt(selectedDateObj) : false;
              const isToday = fmt(d) === fmt(new Date());
              const isPast = d < today;

              return (
                <button
                  key={fmt(d)}
                  onClick={() => {
                    if (isPast) return;
                    setDate(fmt(d));
                  }}
                  disabled={isPast}
                  aria-disabled={isPast}
                  title={isPast ? "오늘 이전 날짜는 선택할 수 없습니다" : ""}
                  className={[
                    "h-10 text-sm leading-none",
                    isSelected
                      ? "bg-black text-white border-black"
                      : isPast
                        ? "bg-white text-gray-300 border-gray-200 cursor-not-allowed"
                        : " hover:bg-gray-100 border-gray-200",
                    isToday && !isSelected ? "ring-1 ring-gray-300" : "",
                  ].join(" ")}
                >
                  {d.getDate()}
                </button>
              );
            })}
          </div>
        </div>

        {/* 출발 시간대 (6개 페이징) */}
        <div className="text-center text-xs text-gray-600 mb-2">출발 시간대 선택</div>
        <div className="flex items-center gap-2 mb-4">
          <button
            className="px-2 py-1 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            onClick={() => setStartPage((p) => Math.max(0, p - 1))}
            aria-label="이전 6개"
            disabled={startPage === 0}
          >
            ‹
          </button>

          <div className="flex-1">
            <div className="flex flex-wrap gap-2 justify-center">
              {startSlice.map((h) => (
                <button
                  key={`s-${h}`}
                  onClick={() => {
                    setStartTime(h);
                    // 도착이 없거나 +2 미만이면 초기화
                    if (!endTime || getIdx(endTime) <= getIdx(h) + 1) setEndTime("");

                    // 출발 선택 위치 페이지로 점프
                    const idx = getIdx(h);
                    const page = Math.floor(idx / PAGE_SIZE);
                    if (page !== startPage) setStartPage(page);

                    // 도착 최소 페이지 보정 (출발+2)
                    const minEndIdx = Math.min(HOURS.length - 1, idx + 2);
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
            className="px-2 py-1 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            onClick={() => setStartPage((p) => Math.min(maxPage, p + 1))}
            aria-label="다음 6개"
            disabled={startPage === maxPage}
          >
            ›
          </button>
        </div>

        {/* 도착 시간대 (출발+2 이상만) */}
        <div className="text-center text-xs text-gray-600 mb-2">도착 시간대 선택</div>
        <div className="flex items-center gap-2 mb-4">
          <button
            className={`px-2 py-1 hover:bg-gray-50 ${!startTime ? "opacity-40 cursor-not-allowed" : ""}`}
            onClick={() => startTime && setEndPage((p) => Math.max(0, p - 1))}
            aria-label="이전 6개"
            disabled={!startTime || endPage === 0}
          >
            ‹
          </button>

          <div className="flex-1">
            <div className="flex flex-wrap gap-2 justify-center">
              {endSlice.map((h) => {
                const invalid = startTime ? getIdx(h) <= getIdx(startTime) + 1 : true;
                const disabled = !startTime || invalid;

                return (
                  <button
                    key={`e-${h}`}
                    onClick={() => {
                      if (disabled) return;
                      setEndTime(h);

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
                    title={invalid ? "도착은 출발보다 최소 2시간 이후부터 선택할 수 있습니다" : ""}
                  >
                    {h.replace(":00", "시")}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            className={`px-2 py-1 hover:bg-gray-50 ${!startTime ? "opacity-40 cursor-not-allowed" : ""}`}
            onClick={() => startTime && setEndPage((p) => Math.min(maxPage, p + 1))}
            aria-label="다음 6개"
            disabled={!startTime || endPage === maxPage}
          >
            ›
          </button>
        </div>

        {/* 가이드 유형 */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="col-span-2 text-sm text-gray-600">
            편도 가이드는 가는 길만, 왕복 가이드는 가는 길·오는 길 모두 포함하여 안내합니다.
          </div>

          <button
            onClick={() => setGuideType("편도")}
            className={[
              "h-10 rounded-md border text-sm",
              guideType === "편도" ? "bg-black text-white border-black" : "bg-white hover:bg-gray-50 border-gray-300",
            ].join(" ")}
          >
            편도 가이드
          </button>

          <button
            onClick={() => setGuideType("왕복")}
            className={[
              "h-10 rounded-md border text-sm",
              guideType === "왕복" ? "bg-black text-white border-black" : "bg-white hover:bg-gray-50 border-gray-300",
            ].join(" ")}
          >
            왕복 가이드
          </button>
        </div>

        {/* 적용 */}
        <button
          onClick={handleApply}
          disabled={!canApply}
          className={`w-full h-11 rounded-md text-base font-semibold hover:brightness-110 ${
            canApply ? "bg-gray-700 text-white" : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          적용
        </button>
      </div>
    </div>
  );
}
