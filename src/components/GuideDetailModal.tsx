"use client";

import { useEffect, useState } from "react";
import {
  useOriginStore,
  useBudgetStore,
  useMoveStore,
  usePeopleStore,
  useThemeStore,
  useTripStore,
} from "@/stores/useTripStore";
import { useGuideStore } from "@/stores/useGuideStore";
import { guideApi } from "@/lib/guideApi";

// download image from div
import { useRef } from "react";
import html2canvas from "html2canvas";
import { downloadElementAsImage } from "@/utils/downloadImage";

// icons
import Image from "next/image";
import cancel_neutral from "@/assets/icons/cancel_neutral.svg";
import cancel_black from "@/assets/icons/cancel_black.svg";
import download_white from "@/assets/icons/download_white.svg";
import download_orange from "@/assets/icons/download_orange.svg";
import GuideDetailCard from "./GuideDetailCard";

// 상위 컴포넌트에서 넘겨 받을 props 타입 지정
type GuideDetailProps = {
  planId: number | null;
  order: number | null;
  open: boolean | null;
  onClose: () => void;
};

export default function GuideDetailModal({
  planId,
  order,
  open,
  onClose,
}: GuideDetailProps) {
  const { origin } = useOriginStore();
  const { date, startTime, endTime, guideType } = useTripStore();
  const { people } = usePeopleStore();
  const { car } = useMoveStore();
  const { budget } = useBudgetStore();
  const { theme } = useThemeStore();
  const { guideDetail, setGuideDetail, setLoading, setError } = useGuideStore();

  const [isCancelHover, setIsCancelHover] = useState(false);
  const [isDownloadHover, setIsDownloadHover] = useState(false);

  // 다운로드 영역 ref
  const exportRef = useRef<HTMLDivElement>(null);

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

  const handleDownload = () => {
    if (exportRef.current) {
      downloadElementAsImage(exportRef.current, `마실코스${order}.png`);
      onClose();
    }
  };

  //   Detail GET API 호출
  const getGuideDetail = async () => {
    setLoading(true);
    try {
      // 찐 API 호출
      const data = await guideApi.getGuideDetail(planId);

      setGuideDetail(data.itemDetailsDtos); // 전역 상태 관리 GuideStore에 저장
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!open) return;

    getGuideDetail();
  }, [open, planId, setGuideDetail, setLoading, setError]);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center cursor-default bg-black/40 gap-[22px]"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="flex flex-col justify-center items-center gap-[22px]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 모달 내부 */}
        <div
          ref={exportRef}
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "center",
            width: "1083px",
            maxHeight: "85vh",
            padding: "50px",
            borderRadius: "16px", // rounded-2xl
            color: "#282828",
            gap: "15px",
            boxShadow:
              "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)",
            overflowY: "scroll",
            backgroundColor: "#ffffff",
            position: "relative", // position 추가
          }}
        >
          {/* 헤더 */}
          <div className="flex flex-row items-center justify-center w-full gap-[56px]">
            <hr className="w-[40%] h-4 bg-[#FE7600] border-0 rounded-l-full" />
            <div
              className="flex items-center justify-center w-[20%] text-3xl font-bold"
              style={{ fontFamily: "yg-jalnan, sans-serif" }}
            >
              마실 코스 {order}
            </div>
            <hr className="w-[40%] h-4 bg-[#FE7600] border-0 rounded-r-full" />
          </div>

          {/* 사용자 정보 카드 */}
          <div className="flex flex-col items-center justify-center w-full rounded-2xl bg-[#f5f5f5] px-4 md:px-[91px] py-[40px] gap-[10px] text-[#282828] text-lg md:text-xl font-normal font-['Pretendard'] flex-shrink-0">
            <div className="flex flex-col items-center justify-center gap-[8px]">
              <p>출발지</p>
              <p className="text-3xl font-semibold">{origin}</p>
            </div>
            <div className="flex flex-row justify-center w-full gap-[50px]">
              <div className="flex flex-col items-center justify-start h-[80px] gap-[8px]">
                <p>출발일</p>
                <div className="flex flex-col items-center justify-center font-semibold">
                  <div className="text-2xl">{date}</div>
                  <div className="flex items-center justify-center w-[180px] text-xl">
                    {startTime}
                    {endTime}
                    {guideType}
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-center justify-start h-[80px] gap-[8px]">
                <p>인원수</p>
                <p className="text-3xl font-semibold whitespace-nowrap">
                  {people}명
                </p>
              </div>
              <div className="flex flex-col items-center justify-start h-[80px] gap-[8px]">
                <p>이동수단</p>
                <p className="text-3xl font-semibold whitespace-nowrap">
                  {car}
                </p>
              </div>
              <div className="flex flex-col items-center justify-start h-[80px] gap-[8px]">
                <p>예산</p>
                <p className="text-3xl font-semibold whitespace-nowrap">
                  총 {budget * people}만원
                </p>
              </div>
              <div className="flex flex-col items-center justify-start h-[80px] gap-[8px]">
                <p>나들이 테마</p>
                <p className="text-3xl font-semibold whitespace-nowrap">
                  {theme}
                </p>
              </div>
            </div>
          </div>

          {/* 상세 가이드 */}
          <div className="flex flex-col items-center justify-center bg-pink w-full my-[50px] gap-[30px]">
            {guideDetail?.map((place, index) => (
              <GuideDetailCard key={index} item={place} />
            ))}
          </div>
        </div>

        {/* 모달 밖 버튼 영역 */}
        <div className="flex flex-row items-center justify-center gap-[10px] text-xl font-semibold font-['Pretendard'] ignore-screenshot">
          <button
            className="flex items-center justify-center w-40 h-15 rounded-[5px] bg-[#ECECEC] text-[#757575] gap-[10px] cursor-pointer hover:bg-[#f5f5f5] hover:text-[#282828]"
            onClick={onClose}
            onMouseEnter={() => setIsCancelHover(true)}
            onMouseLeave={() => setIsCancelHover(false)}
          >
            <Image
              src={isCancelHover ? cancel_black : cancel_neutral}
              alt="x"
              width={24}
              height={24}
            />
            닫기
          </button>
          <button
            className="flex items-center justify-center w-40 h-15 rounded-[5px] bg-[#FE7600] text-white gap-[10px] cursor-pointer hover:bg-[#f5f5f5] hover:text-[#FE7600]"
            onClick={handleDownload}
            onMouseEnter={() => setIsDownloadHover(true)}
            onMouseLeave={() => setIsDownloadHover(false)}
          >
            <Image
              src={isDownloadHover ? download_orange : download_white}
              alt="download"
              width={24}
              height={24}
            />
            다운로드
          </button>
        </div>
      </div>
    </div>
  );
}
