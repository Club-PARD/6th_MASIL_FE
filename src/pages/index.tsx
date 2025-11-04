"use client";

import { useState } from "react";
import Script from "next/script";

import { useRouter } from "next/router";
("next/router");

// Swiper 컴포넌트/모듈 임포트
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

// Swiper 스타일
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import styles from "../styles/index.module.css";

// 전역 상태(Zustand)
import {
  useOriginStore,
  useTripStore,
  useMoveStore,
  useBudgetStore,
  useThemeStore,
  usePeopleStore,
} from "@/stores/useTripStore";
import { useGuideStore } from "@/stores/useGuideStore";

// 모달
import DateTimeModal from "@/components/DateTimeModal";
import MoveModal from "@/components/MoveModal";
import ThemeModal from "@/components/ThemeModal";
import BudgetModal from "@/components/BudgetModal";
import LoadingScreen from "@/components/LoadingScreen";

import Image from "next/image";
import { GuideRequestPayload, GuideResultResponse } from "@/types/guide";
import { guideApi } from "@/lib/guideApi";

// ---------- 유틸 함수 ----------
const toHM = (t?: string) => {
  if (!t) return "";
  // "09:00:00" 같이 초가 있으면 앞 5자리만
  if (t.length >= 5) return t.slice(0, 5);
  return t;
};

// "HH:mm~HH:mm" 생성 + 검증
const buildTimeTable = (start?: string, end?: string) => {
  const s = toHM(start);
  const e = toHM(end);
  if (!s || !e) return "";
  if (s >= e) throw new Error("도착 시간은 출발 시간보다 늦어야 합니다.");
  return `${s}~${e}`; // 예: "09:00~18:00"
};

export default function TripFilter() {
  const router = useRouter();

  // zustand 값
  const { origin, setOrigin } = useOriginStore();
  const { date, startTime, endTime, guideType } = useTripStore();
  const { people, setPeople } = usePeopleStore();
  const { car } = useMoveStore();
  const { budget } = useBudgetStore();
  const { theme } = useThemeStore();
  const { setGuideResults, setPlansId } = useGuideStore();

  // 모달 관리
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMoveOpen, setIsMoveOpen] = useState(false);
  const [isBudgetOpen, setIsBudgetOpen] = useState(false);
  const [isThemeOpen, setIsThemeOpen] = useState(false);

  // 요청 상태
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // 지도 api
  const openPostcode = () => {
    new (window as any).daum.Postcode({
      oncomplete: function (data: any) {
        setOrigin(data.address);
      },
    }).open();
  };

  // 요일
  const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
  const weekday = date ? weekdays[new Date(date).getDay()] : "";

  // 출발일/시간 값 존재 여부 플래그
  const hasSchedule = !!date && !!startTime && !!endTime;

  // 서버 전송
  const handleSubmit = async () => {
    try {
      setErrorMsg(null);
      setSubmitting(true);

      if (!origin) throw new Error("출발지를 선택해 주세요.");
      if (!date) throw new Error("출발일을 선택해 주세요.");
      if (!startTime || !endTime)
        throw new Error("출발/도착 시간을 선택해 주세요.");
      if (!car) throw new Error("이동수단을 선택해 주세요.");
      if (!theme) throw new Error("나들이 테마를 선택해 주세요.");

      // 인원수별 금액
      const perPersonBudget = Number(budget ?? 0) * 10000;

      // isOneWay: "편도"면 true, "왕복"이면 false
      const oneWay =
        typeof guideType === "string" ? /편도/.test(guideType) : !!guideType;

      const payload: GuideRequestPayload = {
        origin, // String
        budget: perPersonBudget, // int (1인 금액)
        headcount: Number(people ?? 0), // int
        transportation: String(car), // String
        date, // "yyyy-MM-dd"
        timeTable: buildTimeTable(startTime, endTime), // "HH:mm~HH:mm"
        theme: String(theme), // String
        oneWay, // boolean (true=편도, false=왕복)
      };

      const res = await guideApi.requestGuide(payload);
      // const res = {responsePlanDtos: [
      //   {order: 1,
      //     planId: 1,
      //     itemDtos: [
      //       {title: "가이드 1",
      //       order_num: 1,},
      //       {title: "가이드 1",
      //       order_num: 2,},
      //       {title: "가이드 1",
      //       order_num: 3,},
      //       {title: "가이드 1",
      //       order_num: 4,},
      //       {title: "가이드 1",
      //       order_num: 5,},
      //     ]
      //   },
      //   {order: 2,
      //     planId: 2,
      //     itemDtos: [
      //       {title: "가이드 1",
      //       order_num: 1,},
      //       {title: "가이드 1",
      //       order_num: 2,},
      //       {title: "가이드 1",
      //       order_num: 3,},
      //       {title: "가이드 1",
      //       order_num: 4,},
      //       {title: "가이드 1",
      //       order_num: 5,},
      //     ]
      //   },
      //   {order: 3,
      //     planId: 3,
      //     itemDtos: [
      //       {title: "가이드 1",
      //       order_num: 1,},
      //       {title: "가이드 1",
      //       order_num: 2,},
      //       {title: "가이드 1",
      //       order_num: 3,},
      //       {title: "가이드 1",
      //       order_num: 4,},
      //       {title: "가이드 1",
      //       order_num: 5,},
      //     ]
      //   },
      // ]};

      // 전역 상태 관리에 저장
      setGuideResults(res.responsePlanDtos);
      setPlansId(res.plansId);

      //alert밑에
      router.push("/guide");
      console.log("✅ 응답:", res);
    } catch (err: any) {
      console.error("❌ handleSubmit error:", err);

      const msg = err?.message || "요청 중 오류가 발생했습니다.";
      setErrorMsg(msg);
      alert(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // 마지막 마실 validator
  const isFormValid =
    !!origin &&
    !!date &&
    !!startTime &&
    !!endTime &&
    !!car &&
    !!theme &&
    (people ?? 0) > 0 &&
    (budget ?? 0) > 0;

  return (
    <div className="w-full min-h-lvh bg-[#f5f5f5]">
      {/* 캐러셀 */}
      <div className="w-full">
        <div className="w-full mx-auto relative">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 3000 }}
            loop
            className={`${styles.swiper} overflow-hidden`}
          >
            <SwiperSlide>
              <img
                src="/banner/1.svg"
                alt="배너1"
                className="w-full h-auto object-cover"
              />
            </SwiperSlide>
            <SwiperSlide>
              <img
                src="/banner/2.svg"
                alt="배너2"
                className="w-full h-auto object-cover"
              />
            </SwiperSlide>
            <SwiperSlide>
              <img
                src="/banner/3.svg"
                alt="배너3"
                className="w-full h-auto object-cover"
              />
            </SwiperSlide>
            <SwiperSlide>
              <img
                src="/banner/4.svg"
                alt="배너3"
                className="w-full h-auto object-cover"
              />
            </SwiperSlide>
            <SwiperSlide>
              <img
                src="/banner/5.svg"
                alt="배너3"
                className="w-full h-auto object-cover"
              />
            </SwiperSlide>
          </Swiper>
          <Image
            src="/logo.svg"
            alt="로고"
            className="absolute top-[75px] left-1/2 -translate-x-1/2 -translate-y-full z-10"
            width={100}
            height={100}
          />
        </div>
        {/* 본문 */}
        <section className="flex flex-col items-center justify-center w-full max-w-[1120px] bg-white rounded-2xl px-12 py-10 mx-auto -mt-30 relative z-10 shadow-2xl">
          {" "}
          {/* 다음 우편번호 API */}
          <Script
            src="https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"
            strategy="afterInteractive"
          />
          {/* 출발지 */}
          <div className="text-center text-black text-xl">출발지</div>
          <div className="cursor-pointer select-none" onClick={openPostcode}>
            <div
              className={`mt-1 text-center text-3xl font-semibold ${
                origin ? "" : "underline"
              }`}
            >
              {origin || "검색"}
            </div>
          </div>
          {/* 그리드 */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-5 gap-y-8 gap-x-6 text-center">
            {/* 출발일 및 소요시간 */}
            <div className="cursor-pointer select-none">
              <div className="text-black text-xl">출발일 및 소요시간</div>
              <div
                className={`mt-1 text-3xl font-semibold ${
                  hasSchedule ? "" : "underline"
                }`}
                onClick={() => setIsModalOpen(true)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) =>
                  (e.key === "Enter" || e.key === " ") && setIsModalOpen(true)
                }
              >
                <div className="text-center justify-start">
                  <span className="text-검정 text-2xl font-semibold font-['Pretendard']">
                    {date ? `${date} (${weekday})` : "미정"}
                    <br />
                  </span>
                  <span className="text-검정 text-xl font-semibold font-['Pretendard']">
                    {startTime || ""}
                    {endTime || ""}
                    {guideType || ""}
                  </span>
                </div>
              </div>
            </div>
            {isModalOpen && (
              <DateTimeModal onClose={() => setIsModalOpen(false)} />
            )}

            {/* 인원수 */}
            <div className="select-none">
              <p className="text-center text-검정 text-xl font-normal font-['Pretendard'] leading-7">
                인원수
              </p>
              <div className="mt-1 flex items-center justify-center gap-3">
                <button
                  onClick={() => setPeople(Math.max(0, people - 1))}
                  disabled={people === 1}
                  className={`size-8 rounded-full text-lg font-bold transition-colors duration-200 ${
                    people === 1
                      ? "bg-[#C2C2C2] text-white cursor-not-allowed"
                      : "bg-[#282828] text-white hover:bg-[#FE7600] active:scale-95"
                  }`}
                >
                  −
                </button>
                <span className="text-2xl font-extrabold px-1">{people}</span>
                <button
                  onClick={() => setPeople(Math.min(10, people + 1))}
                  disabled={people === 10}
                  className={`size-8 rounded-full text-lg font-bold transition-colors duration-200 ${
                    people === 10
                      ? "bg-[#C2C2C2] text-white cursor-not-allowed"
                      : "bg-[#282828] text-white hover:bg-[#FE7600] active:scale-95"
                  }`}
                >
                  +
                </button>
              </div>
            </div>

            {/* 이동수단 */}
            <div className="cursor-pointer select-none">
              <div className="text-black text-xl">이동수단</div>
              <div
                className={`mt-1 text-3xl font-semibold ${
                  car ? "" : "underline"
                }`}
                onClick={() => setIsMoveOpen(true)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) =>
                  (e.key === "Enter" || e.key === " ") && setIsMoveOpen(true)
                }
              >
                <div>{car || "선택"}</div>
              </div>
            </div>
            {isMoveOpen && (
              <MoveModal
                open={isMoveOpen}
                onClose={() => setIsMoveOpen(false)}
              />
            )}

            {/* 예산 */}
            <div className="cursor-pointer select-none">
              <div className="text-black text-xl">예산</div>
              <div
                className={`mt-1 text-3xl font-semibold ${
                  budget != null && budget * people > 0 ? "" : "underline"
                }`}
                onClick={() => setIsBudgetOpen(true)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) =>
                  (e.key === "Enter" || e.key === " ") && setIsBudgetOpen(true)
                }
              >
                {budget != null && budget * people > 0
                  ? `총 ${budget * people}만원`
                  : "미정"}
              </div>
            </div>
            {isBudgetOpen && (
              <BudgetModal
                open={isBudgetOpen}
                onClose={() => setIsBudgetOpen(false)}
              />
            )}

            {/* 테마 */}
            <div className="cursor-pointer select-none">
              <div className="text-black text-xl">나들이 테마</div>
              <div
                className={`mt-1 text-3xl font-semibold ${
                  theme ? "" : "underline"
                }`}
                onClick={() => setIsThemeOpen(true)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) =>
                  (e.key === "Enter" || e.key === " ") && setIsThemeOpen(true)
                }
              >
                <div>{theme || "선택"}</div>
              </div>
            </div>
          </div>
          {isThemeOpen && (
            <ThemeModal
              open={isThemeOpen}
              onClose={() => setIsThemeOpen(false)}
            />
          )}
          {/* 버튼 */}
          <div className="flex justify-center w-full mt-8">
            <button
              onClick={handleSubmit}
              disabled={!isFormValid || submitting}
              className={`w-full px-7 py-4 rounded-[10px] inline-flex justify-center items-center gap-2.5 transition
                ${
                  !isFormValid || submitting
                    ? "bg-[#C2C2C2] cursor-not-allowed"
                    : "bg-orange-500 hover:bg-orange-600"
                }
              `}
            >
              <span className="text-center text-white text-3xl font-semibold font-['Pretendard']">
                {submitting ? "전송 중..." : "마실 가이드 보기"}
              </span>
            </button>
          </div>
          {errorMsg && (
            <p className="mt-3 text-center text-red-600 text-sm">{errorMsg}</p>
          )}
          {/* ✅ 전송 중일 때 풀화면 로딩 화면 */}
          {submitting && <LoadingScreen />}
        </section>
      </div>
    </div>
  );
}
