// app/components/TripFilter.tsx
"use client";

import { useState } from "react";
import Script from "next/script";

// ✅ Swiper 컴포넌트/모듈 임포트
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

// ✅ Swiper 스타일
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

//전역 변수
import {
  useTripStore,
  useMoveState,
  useThemeState,
} from "@/stores/useTripStore";

//모달 불러오기
import DateTimeModal from "@/components/DateTimeModal";
import MoveModal from "@/components/MoveModal";
import ThemeModal from "@/components/ThemeModal";

//hook
export default function TripFilter() {
  const [origin, setOrigin] = useState("");
  const [people, setPeople] = useState(1);

  //zustand
  const { date, startTime, endTime, guideType } = useTripStore();
  const { car } = useMoveState();
  const { theme } = useThemeState();

  //모달 관리
  const [isModalOpen, setIsModalOpen] = useState(false); //1번모달
  const [isMoveOpen, setIsMoveOpen] = useState<boolean>(false); //이동모달
  const [isBudgetOpen, setIsBudgetOpen] = useState<boolean>(false); //예산 모달
  const [isThemeOpen, setIsThemeOpen] = useState<boolean>(false); //테마 모달

  // 지도 api
  const openPostcode = () => {
    new (window as any).daum.Postcode({
      oncomplete: function (data: any) {
        setOrigin(data.address); // ✅ 주소를 상태에 저장
      },
    }).open();
  };

  return (
    <>
      {/* 캐러셀 */}
      <div className="w-full">
        <div className="w-full max-w-[1120px] mx-auto mb-6">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 3000 }}
            loop
            className="rounded-2xl overflow-hidden"
          >
            <SwiperSlide>
              <img
                src="/banner1.jpg"
                alt="배너1"
                className="w-full h-64 object-cover"
              />
            </SwiperSlide>
            <SwiperSlide>
              <img
                src="/banner2.jpg"
                alt="배너2"
                className="w-full h-64 object-cover"
              />
            </SwiperSlide>
            <SwiperSlide>
              <img
                src="/banner3.jpg"
                alt="배너3"
                className="w-full h-64 object-cover"
              />
            </SwiperSlide>
            <SwiperSlide>
              <img
                src="/banner3.jpg"
                alt="배너3"
                className="w-full h-64 object-cover"
              />
            </SwiperSlide>
            <SwiperSlide>
              <img
                src="/banner3.jpg"
                alt="배너3"
                className="w-full h-64 object-cover"
              />
            </SwiperSlide>
          </Swiper>
        </div>

        {/* 본문 */}
        <section className="w-[1120px] h-96 bg-neutral-100 rounded-2xl p-8 mx-auto">
          {/* 다음 우편번호 API 스크립트 */}
          <Script
            src="https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"
            strategy="afterInteractive"
          />

          {/* 상단: 출발지 */}
          <div className="text-center text-black text-xl">출발지</div>
          <div className="cursor-pointer select-none" onClick={openPostcode}>
            <div className="mt-1 text-center text-3xl font-semibold underline">
              {origin || "검색"}
            </div>
          </div>

          {/* 그리드 */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-5 gap-y-8 gap-x-6 text-center">
            {/* 출발일 및 소요시간 */}
            <div className="cursor-pointer select-none">
              <div className="text-black text-xl">출발일 및 소요시간</div>

              {/* 이 영역을 클릭하면 모달 오픈 */}
              <div
                className="mt-1 text-3xl font-semibold underline"
                onClick={() => setIsModalOpen(true)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) =>
                  (e.key === "Enter" || e.key === " ") && setIsModalOpen(true)
                }
              >
                <div>
                  {date || "미정"}
                  <br />
                  {startTime || ""}
                  {endTime || ""}
                  {guideType || ""}
                </div>
              </div>
            </div>

            {/* 모달 열림 조건 */}
            {isModalOpen && (
              <DateTimeModal onClose={() => setIsModalOpen(false)} />
            )}

            {/* 인원수 */}
            <div className="select-none">
              <p className="text-sm text-gray-500">인원수</p>
              <div className="mt-1 flex items-center justify-center gap-3">
                <button
                  onClick={() => setPeople((n) => Math.max(0, n - 1))}
                  disabled={people === 0}
                  className={`w-7 h-7 rounded-full active:scale-95 ${
                    people === 0 ? "text-gray-300" : "hover:bg-gray-50 "
                  }`}
                  aria-label="감소"
                >
                  –
                </button>
                <span className="text-2xl font-extrabold">{people}</span>
                <button
                  onClick={() => setPeople((n) => Math.min(9, n + 1))}
                  disabled={people === 9}
                  className={`w-7 h-7 rounded-full active:scale-95 ${
                    people === 9 ? "text-gray-300" : "hover:bg-gray-50 "
                  }`}
                  aria-label="증가"
                >
                  +
                </button>
              </div>
            </div>

            {/* 이동수단 */}
            <div className="cursor-pointer select-none">
              <div className="text-black text-xl">이동수단</div>
              <div
                className="mt-1 text-3xl font-semibold underline"
                onClick={() => setIsMoveOpen(true)} // ✅ 이동수단 모달 열기
                role="button"
                tabIndex={0}
                onKeyDown={(e) =>
                  (e.key === "Enter" || e.key === " ") && setIsMoveOpen(true)
                }
              >
                <div>{car || "선택"}</div>
              </div>
            </div>

            {/* 이동수단 모달 */}
            {isMoveOpen && (
              <MoveModal
                open={isMoveOpen}
                onClose={() => setIsMoveOpen(false)}
              />
            )}

            {/* 예산 */}
            <div className="cursor-pointer select-none">
              <div className="text-black text-xl">예산</div>
              <div className="mt-1 text-3xl font-semibold">미정</div>
            </div>

            {/* 나들이 테마 */}
            <div className="cursor-pointer select-none">
              <div className="text-black text-xl">나들이 테마</div>
              <div
                className="mt-1 text-3xl font-semibold underline"
                onClick={() => setIsThemeOpen(true)} // 나들이 테마 모달 열림
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

          {/* 나들이 테마 모달 */}
          {isThemeOpen && (
            <ThemeModal
              open={isThemeOpen}
              onClose={() => setIsThemeOpen(false)}
            />
          )}

          {/* 버튼 */}
          <div className="flex justify-center mt-8">
            <div className="px-7 py-4 bg-neutral-200 rounded-[5px] inline-flex justify-center items-center gap-2.5">
              <div className="text-center text-white text-3xl font-semibold font-['Pretendard']">
                마실 가이드 보기
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
