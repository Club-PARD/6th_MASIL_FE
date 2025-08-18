// app/components/DateTimeModal.tsx
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

  // ✅ 어떤 형식("08시", "08:00", "08:00일")이 와도 "08:00"으로 정규화 후 인덱스 검색
  const getIdx = (t?: string | null) => {
    if (!t) return -1;
    const s = String(t);
    const m = s.match(/(\d{1,2})/); // 시만 추출
    if (!m) return -1;
    const hh = m[1].padStart(2, "0");
    return HOURS.indexOf(`${hh}:00`);
  };

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

  // 해당 월만(1일~마지막날). **일요일 시작 정렬**
  const { calendarCells, prevDisabled } = useMemo(() => {
    const firstOfMonth = new Date(viewYear, viewMonth, 1);
    const lastDay = new Date(viewYear, viewMonth + 1, 0).getDate();

    // 일요일=0 ... 토요일=6
    const firstDaySunStart = firstOfMonth.getDay();

    // 앞쪽 빈칸
    const leading = Array.from({ length: firstDaySunStart }, () => null as Date | null);
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
    if (!selectedDateObj) {
      return "아래 달력에서 출발일을 선택해 주세요";
    }
    const d = selectedDateObj;
    const locale = d.toLocaleDateString("ko-KR", {
      year: "numeric", month: "long", day: "numeric", weekday: "long",
    });
    const st = startTime || "—";
    const et = endTime || "—";
    const gt = guideType || " ";
    return `${locale}\n${st}${et}${gt ? `${gt} ` : ""}`;
  }, [selectedDateObj, startTime, endTime, guideType]);

  const monthLabel = `${viewYear}. ${String(viewMonth + 1).padStart(2, "0")}`;

  // ── 제약: 도착은 출발+2시간 이상 (출발+1은 선택 불가) ────
  const canApply =
    !!startTime &&
    !!endTime &&
    getIdx(endTime) > getIdx(startTime) + 1;
    !!guideType;

  const handleApply = () => {
    if (!canApply) return;
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center" onClick={onClose}>
      <div
        className="bg-gray-100 w-full max-w-[640px] rounded-2xl p-4 shadow-2xl max-h-[560px] overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 상단 */}
        <div className="flex items-start justify-between mb-3 mt-10 ml-11 mr-11">
          <div className="justify-start text-검정 text-2xl font-semibold font-['Pretendard'] leading-loose">출발일 및 소요시간</div>
          <button
            onClick={onClose}
            className="w-8 h-8 relative overflow-hidden rounded hover:bg-orange-300 transition-colors"
            aria-label="닫기"
          >
            ✕
          </button>
        </div>

        {/* 요약 */}
        <div className="rounded-lg bg-white py-2 px-3 text-center mb-3 whitespace-pre-line text-sm ml-11 mr-11">
          <div
            className={[
              "font-medium leading-tight",
              !selectedDateObj
                ? "text-orange-500 text-xl font-semibold font-['Pretendard'] leading-7"
                : "",
            ].join(" ")}
          >
            {headerText}
          </div>
        </div>

        {/* 달력 (해당 월만, **일요일 시작**) */}
        <div className="mb-3">
          <div className="flex items-center justify-center gap-8 bg-white ml-11 mr-11">
            <button
              onClick={() =>
                setViewMonth((m) =>
                  m === 0 ? (setViewYear((y) => y - 1), 11) : m - 1
                )
              }
              className="px-1 py-1 disabled:opacity-40 hover:scale-110 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-colors text-lg font-extrabold"
              aria-label="이전 달"
              disabled={prevDisabled}
            >
              ‹
            </button>

            {/* 월 텍스트 */}
            <div className="text-xl font-semibold text-center">
              {monthLabel}
            </div>

            <button
              onClick={() =>
                setViewMonth((m) =>
                  m === 11 ? (setViewYear((y) => y + 1), 0) : m + 1
                )
              }
              className="px-1 py-1 transition-color hover:scale-110 text-lg font-extrabold"
              aria-label="다음 달"
            >
              ›
            </button>
          </div>

          {/* 요일 헤더: **일~토**, 일=빨강, 토=파랑 */}
          <div className="grid grid-cols-7 text-center text-[11px] ml-11 mr-11 bg-white">
            {["일","월","화","수","목","금","토"].map((w, i) => (
              <div
                key={w}
                className={[
                  "py-1",
                  i === 0 ? "text-red-600" : i === 6 ? "text-blue-600" : "text-gray-500",
                ].join(" ")}
              >
                {w}
              </div>
            ))}
          </div>

          {/* 해당 월 + 앞쪽 빈칸 포함 (정사각형 + 출발일/오늘 라벨) */}
          <div className="grid grid-cols-7 gap-1 ml-11 mr-11 bg-white overflow-visible">
            {calendarCells.map((d, idx) => {
              if (!d) return <div key={`empty-${idx}`} />;

              const isSelected = selectedDateObj ? fmt(d) === fmt(selectedDateObj) : false;
              const isToday = fmt(d) === fmt(new Date());
              const isPast = d < today;
              const dow = d.getDay(); // 0=일, 6=토

              return (
                <div key={fmt(d)} className="relative flex items-start justify-center pb-4">
                  <button
                    onClick={() => {
                      if (isPast) return;
                      setDate(fmt(d));
                    }}
                    disabled={isPast}
                    aria-disabled={isPast}
                    title={isPast ? "오늘 이전 날짜는 선택할 수 없습니다" : ""}
                    className={[
                      // 정사각형 셀
                      "w-10 h-10 flex items-center justify-center text-sm leading-none",
                      "rounded-md transition-colors",
                      isSelected
                        ? "bg-orange-500 text-white border-orange-500"
                        : isPast
                          ? "bg-white text-gray-300 border-gray-200 cursor-not-allowed disabled:hover:bg-transparent"
                          : [
                              "bg-white hover:bg-orange-300 border-gray-200",
                              dow === 0 ? "text-red-600"
                                : dow === 6 ? "text-blue-600"
                                : "text-gray-900",
                            ].join(" "),
                      isToday && !isSelected ? "ring-1 ring-gray-300" : "",
                    ].join(" ")}
                  >
                      <span className="relative -top-0.5 leading-none">{d.getDate()}</span>
                  </button>

                  {/* 오늘 라벨 or 출발일 라벨 */}
                  {isToday && !isSelected && (
                    <span className="absolute bottom-1/4  left-50/100 -translate-x-1/2 py-0.5 text-xs font-semibold  text-gray-500 ">
                      오늘
                    </span>
                  )}
                  {isSelected && (
                    <span className="absolute bottom-1/4 left-1/2 -translate-x-1/2  py-0.5 text-xs font-semibold rounded text-white ">
                      출발일
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 출발 시간대 (6개 페이징) */}
        <div className="text-left justify-start text-검정 text-xl ml-11 mt-5 pl-3 bg-white mr-11 font-semibold font-['Pretendard'] leading-7">출발 시간대 선택</div>

        <div className="flex items-center gap-2 pt-3 pb-5 ml-11 mr-11 bg-white">
          <button
            className="px-2 py-1 rounded hover:scale-110 disabled:opacity-40 disabled:cursor-not-allowed font-extrabold disabled:hover:bg-transparent shrink-0 transition-colors"
            onClick={() => setStartPage((p) => Math.max(0, p - 1))}
            aria-label="이전 6개"
            disabled={startPage === 0}
          >
            ‹
          </button>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap gap-2 justify-center">
              {startSlice.map((h) => (
                <button
                  key={`s-${h}`}
                  onClick={() => {
                    setStartTime(h);
                    if (!endTime || getIdx(endTime) <= getIdx(h) + 1) setEndTime("");

                    const idx = getIdx(h);
                    const page = Math.floor(idx / PAGE_SIZE);
                    if (page !== startPage) setStartPage(page);

                    const minEndIdx = Math.min(HOURS.length - 1, idx + 2);
                    const minEndPage = Math.floor(minEndIdx / PAGE_SIZE);
                    if (endPage < minEndPage) setEndPage(minEndPage);
                  }}
                  className={[
                    "px-4 py-2 rounded-full border text-sm transition-colors font-bold",
                    startTime && getIdx(startTime) === getIdx(h)
                      ? "bg-orange-500 text-white border-orange-500"
                      : "bg-white hover:bg-orange-300 border-gray-300",
                  ].join(" ")}
                >
                  {h.replace(":00", "시")}
                </button>
              ))}
            </div>
          </div>

          <button
            className="px-2 py-1 rounded hover:scale-110 font-extrabold disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent shrink-0 transition-colors"
            onClick={() => setStartPage((p) => Math.min(maxPage, p + 1))}
            aria-label="다음 6개"
            disabled={startPage === maxPage}
          >
            ›
          </button>
        </div>

        {/* 도착 시간대 (출발+2 이상만) */}
        <div className="text-left justify-start text-검정 text-xl ml-11 mt-5 pl-3 bg-white mr-11 font-semibold font-['Pretendard'] leading-7">도착 시간대 선택</div>
        <div className="flex items-center gap-2 mb-4 ml-11 mr-11 pb-3 pt-3 bg-white">
          <button
            className={`px-2 py-1 rounded hover:scale-110 font-extrabold ${!startTime ? "opacity-40 cursor-not-allowed" : ""} disabled:hover:bg-transparent transition-colors shrink-0`}
            onClick={() => startTime && setEndPage((p) => Math.max(0, p - 1))}
            aria-label="이전 6개"
            disabled={!startTime || endPage === 0}
          >
            ‹
          </button>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap gap-2 justify-center">
              {endSlice.map((h) => {
                const invalid = startTime ? getIdx(h) <= getIdx(startTime) + 1 : true; // 출발+1까지 금지
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
                      "px-4 py-2 rounded-full border text-sm transition-colors font-bold",
                      disabled
                        ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed disabled:hover:bg-transparent"
                        : endTime && getIdx(endTime) === getIdx(h)
                          ? "bg-orange-500 text-white border-orange-500"
                          : "bg-white hover:bg-orange-300 border-gray-300",
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
            className={`px-2 py-1 rounded hover:scale-110 font-extrabold ${!startTime ? "opacity-40 cursor-not-allowed" : ""} disabled:hover:bg-transparent transition-colors shrink-0`}
            onClick={() => startTime && setEndPage((p) => Math.min(maxPage, p + 1))}
            aria-label="다음 6개"
            disabled={!startTime || endPage === maxPage}
          >
            ›
          </button>
        </div>

        {/* 가이드 유형 */}

        <section className="bg-white mx-11 mt-5">
          <div className="text-left text-gray-900 text-xl pl-3 font-semibold leading-7">
            가이드 방식 선택
          </div>

          <div className="grid grid-cols-2 gap-2 mb-4">
            {/* 안내 문구: 2칸 모두 사용 */}
            <div className="col-span-2 flex items-start gap-2 text-[13px] text-gray-600 bg-white pl-3 pr-2">
              <img src="/!.svg" alt="안내" className="w-4 h-4 mt-0.5" />
              <span>
                편도 가이드는 가는 길, 왕복 가이드는 가는 길·오는 길 모두 포함하여 안내합니다.
              </span>
            </div>

            {/* 버튼 영역: 2칸 모두 사용 */}
            <div className="col-span-2 flex justify-center gap-6 pt-1 pb-4 bg-white">
              <button
                onClick={() => setGuideType("편도")}
                aria-pressed={guideType === "편도"}
                className={`h-10 px-15 rounded-md border text-sm transition-colors ${
                  guideType === "편도"
                    ? "bg-orange-500 text-white border-orange-500"
                    : "bg-white hover:bg-orange-300 border-gray-300"
                }`}
              >
                편도 가이드
              </button>

              <button
                onClick={() => setGuideType("왕복")}
                aria-pressed={guideType === "왕복"}
                className={`h-10 px-15 rounded-md border text-sm transition-colors ${
                  guideType === "왕복"
                    ? "bg-orange-500 text-white border-orange-500"
                    : "bg-white hover:bg-orange-300 border-gray-300"
                }`}
              >
                왕복 가이드
              </button>
            </div>
          </div>
      </section>

      {/* 적용 */}
        <button
          onClick={handleApply}
          disabled={!canApply}
          className={`w-127 h-11 rounded-md text-base font-semibold transition-colors ${
            canApply
              ? "bg-gray-700 text-white hover:bg-orange-300 hover:text-black"
              : "bg-gray-300 text-gray-500 cursor-not-allowed disabled:hover:bg-transparent"
          }`}
        >
          적용
        </button>
      </div>
    </div>
  );
}
