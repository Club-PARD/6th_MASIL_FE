// app/components/TripFilter.tsx
"use client";

import { useState } from "react";
import Script from "next/script";

export default function TripFilter() {
{/* 상태관리 */}
  const [origin, setOrigin] = useState("");
  const [dateTime, setDateTime] = useState<"" | "미정" | "지정">("미정");
  const [people, setPeople] = useState(1);
  const [transport, setTransport] = useState("");
  const [budget, setBudget] = useState<"" | "미정" | "절약" | "보통" | "프리미엄">("미정");
  const [theme, setTheme] = useState("");

  const canSubmit = origin && transport && theme;

{/* 지도 api */}
  const openPostcode = () => {
    new (window as any).daum.Postcode({
      oncomplete: function (data: any) {
        setOrigin(data.address); // ✅ 주소를 상태에 저장
      },
    }).open();
  };

  return (
    <section className="w-[1120px] h-96 bg-neutral-100 rounded-2xl p-8 mx-auto">

        {/* 상단: 출발지 */}
        <div className="text-center text-black text-xl">출발지</div>
        
        <Script
            src="https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"
            strategy="afterInteractive"
        />
            <div className="cursor-pointer select-none" onClick={openPostcode}>
                <div className="mt-1 text-center text-3xl font-semibold underline">
                {origin || "검색"}
                </div>
            </div>
        
        
        {/* 그리드 */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-5 gap-y-8 gap-x-6 text-center">
            {/* 출발일 및 소요시간 */}
            <div
            className="cursor-pointer select-none"
            onClick={() => console.log("출발일 모달 오픈")}
            >
            <div className="text-black text-xl">출발일 및 소요시간</div>
            <div className="mt-1 text-3xl font-semibold underline">
                {dateTime || "미정"}
            </div>
            </div>

            {/* 인원수 */}
            <div className="select-none">
            <p className="text-sm text-gray-500">인원수</p>
            <div className="mt-1 flex items-center justify-center gap-3">
                    <button
                    onClick={() => setPeople((n) => Math.max(0, n - 1))}
                    disabled={people === 0}
                    className={`w-7 h-7 rounded-full active:scale-95
                        ${people === 0 
                        ? "text-gray-300" 
                        : "hover:bg-gray-50"}`}
                    aria-label="감소"
                    >
                –
                </button>
                <span className="text-2xl font-extrabold">{people}</span>
                    <button
                        onClick={() => setPeople((n) => Math.min(9, n + 1))}
                        disabled={people === 9}
                        className={`w-7 h-7 rounded-full active:scale-95
                            ${people === 9
                            ? "text-gray-300 cursor-not-allowed"
                            : "hover:bg-gray-50 "}`}
                        aria-label="증가"
                        >
                        +
                </button>
            </div>
            </div>

            {/* 이동수단 */}
            <div
            className="cursor-pointer select-none"
            onClick={() => console.log("이동수단 모달 오픈")}
            >
            <div className="text-black text-xl">이동수단</div>
            <div className="mt-1 text-3xl font-semibold">
                {transport || "선택"}
            </div>
            </div>

            {/* 예산 및 식사 */}
            <div
            className="cursor-pointer select-none"
            onClick={() => console.log("예산 모달 오픈")}
            >
            <div className="text-black text-xl">예산 및 식사</div>
            <div className="mt-1 text-3xl font-semibold underline">
                {budget}
            </div>
            </div>

            {/* 나들이 테마 */}
        <div
            className=" cursor-pointer select-none"
            onClick={() => console.log("테마 모달 오픈")}
            >
            <div className="text-black text-xl">나들이 테마</div>
            <div className="mt-1 text-3xl font-semibold">
                {theme || "선택"}
            </div>
            </div>
        </div>

        {/* 버튼 */}
            <div className="flex justify-center mt-8">
                <div className="px-7 py-4 bg-neutral-200 rounded-[5px] inline-flex justify-center items-center gap-2.5">
                    <div className="text-center text-white text-3xl font-semibold font-['Pretendard']">
                        마실 가이드 보기
                    </div>
                </div>
            </div>
    </section>
  );
}
