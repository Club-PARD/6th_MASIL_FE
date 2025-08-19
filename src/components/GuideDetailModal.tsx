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

import Image from "next/image";
import cancel_neutral from "@/assets/icons/cancel_neutral.svg";
import cancel_black from "@/assets/icons/cancel_black.svg";
import download_white from "@/assets/icons/download_white.svg";
import download_orange from "@/assets/icons/download_orange.svg";
import pin_neutral from "@/assets/icons/pin_neutral.svg";

type GuideDetailProps = {
  planId: number;
  open: boolean;
  onClose: () => void;
};

type ItemDto = {
  title: string;
  orderNum: number;
  duration: string;
  startTime: string;
  endTime: string;
  isTransport: boolean;
};

export default function GuideDetailModal({
  planId,
  open,
  onClose,
}: GuideDetailProps) {
  const { origin } = useOriginStore();
  const { date, startTime, endTime, guideType } = useTripStore();
  const { people } = usePeopleStore();
  const { car } = useMoveStore();
  const { budget } = useBudgetStore();
  const { theme } = useThemeStore();

  const [isCancelHover, setIsCancelHover] = useState(false);
  const [isDownloadHover, setIsDownloadHover] = useState(false);

  const [items, setItems] = useState<ItemDto[]>([]);
  const [loading, setLoading] = useState(false);

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
        <div className="flex flex-col justify-start items-center w-[1083px] h-[700px] p-[50px] rounded-2xl bg-white text-[#282828] gap-[15px] shadow-xl">
          {/* 헤더 */}
          <div className="flex flex-row items-center justify-center w-full gap-[56px]">
            <hr className="w-[40%] h-4 bg-[#FE7600] border-0 rounded-l-full" />
            <div className="flex items-center justify-center w-[20%] text-3xl font-bold font-['Jalnan_2']">
              마실코스 1
            </div>
            <hr className="w-[40%] h-4 bg-[#FE7600] border-0 rounded-r-full" />
          </div>

          {/* 사용자 정보 카드 */}
          <div className="flex flex-col items-center justify-center w-full h-[200px] rounded-2xl bg-neutral-100 px-[91px] py-[30px] gap-[40px] text-[#282828] text-xl font-normal font-['Pretendard']">
            <div className="flex flex-col items-center justify-center gap-[8px]">
              <p>출발지</p>
              <p className="text-3xl font-semibold">{origin}</p>
            </div>
            <div className="flex flex-row justify-center w-full gap-[50px]">
              <div className="flex flex-col items-center justify-start h-[80px] gap-[8px]">
                <p>출발일</p>
                <div className="flex flex-col items-center justify-center font-semibold">
                  <p className="text-2xl">{date}</p>
                  <p className="text-xl">
                    {startTime}-{endTime} / {guideType}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center justify-start h-[80px] gap-[8px]">
                <p>인원수</p>
                <p className="text-3xl font-semibold">{people}명</p>
              </div>
              <div className="flex flex-col items-center justify-start h-[80px] gap-[8px]">
                <p>이동수단</p>
                <p className="text-3xl font-semibold">{car}</p>
              </div>
              <div className="flex flex-col items-center justify-start h-[80px] gap-[8px]">
                <p>예산</p>
                <p className="text-3xl font-semibold">{budget}만원</p>
              </div>
              <div className="flex flex-col items-center justify-start h-[80px] gap-[8px]">
                <p>나들이 테마</p>
                <p className="text-3xl font-semibold">{theme}</p>
              </div>
            </div>
          </div>

          {/* 상세 가이드 */}
          <div className="flex flex-col items-center justify-center w-full">
            <div className="flex flex-row items-center justify-center w-full p-[37px] gap-[80px] text-[30px] text-[#282828] font-semibold">
              {/* 시간대 */}
              <div className="flex justify-start w-[80px] h-full">time</div>
              <div className="flex flex-col w-full h-full border-l-3 border-[#C2C2C2] px-[15px]">
                {/* 장소 */}
                <div className={`${"text-[#FE7600]"}`}>
                  title 장소면 오렌지 아니면 검정
                </div>
                {/* 소요시간과 가격 */}
                <div className="flex flex-row w-full justify-start pb-[19px] gap-[10px]">
                  <div className="flex items-center justify-center min-w-[80px] px-2.5 py-[8px] rounded-sm bg-neutral-100 text-[#757575] text-base">
                    소요 시간 null 이면 X
                  </div>
                  <div className="flex items-center justify-center min-w-[80px] px-2.5 py-[8px] rounded-sm bg-neutral-100 text-[#757575] text-base">
                    가격 null 이면 X
                  </div>
                </div>
                {/* 설명과 링크 */}
                <div className="flex flex-col text-[24px] font-normal gap-[10px]">
                  <div>설명</div>
                  <div className="flex flex-row items-center underline">
                    <Image src={pin_neutral} alt="pin" width={28} height={28} /> 링크</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 모달 밖 버튼 영역 */}
        <div className="flex flex-row items-center justify-center gap-[10px] text-xl font-semibold font-['Pretendard']">
          <button
            className="flex items-center justify-center w-40 h-15 rounded-[5px] bg-[#ECECEC] text-[#757575] gap-[10px] cursor-pointer hover:bg-neutral-300 hover:text-[#282828]"
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
            className="flex items-center justify-center w-40 h-15 rounded-[5px] bg-[#FE7600] text-white gap-[10px] cursor-pointer hover:bg-neutral-100 hover:text-[#FE7600]"
            // onClick={}
            onMouseEnter={() => setIsDownloadHover(true)}
            onMouseLeave={() => setIsDownloadHover(false)}
          >
            <Image
              src={isDownloadHover ? download_orange : download_white}
              alt="x"
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
