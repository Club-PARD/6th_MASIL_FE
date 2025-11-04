import Card from "@/components/GuideCard";
import Image from "next/image";
import reset_orange from "@/assets/icons/reset_orange.svg";

import {
  useOriginStore,
  useBudgetStore,
  useMoveStore,
  usePeopleStore,
  useThemeStore,
  useTripStore,
} from "@/stores/useTripStore";
import { useGuideStore } from "@/stores/useGuideStore";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { guideApi } from "@/lib/guideApi";

export default function GuidePage() {
  const router = useRouter();

  const { origin } = useOriginStore();
  const { date, startTime, endTime, guideType } = useTripStore();
  const { people } = usePeopleStore();
  const { car } = useMoveStore();
  const { budget } = useBudgetStore();
  const { theme } = useThemeStore();
  const { plansId, guideResults, setPlansId, setGuideResults } = useGuideStore();

    // 요청 상태
    const [submitting, setSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleRefresh = async () => {
    try {
      const res = await guideApi.getNewGuide(plansId);
      
      setGuideResults(res.responsePlanDtos);
      setPlansId(res.plansId);
    } catch (err: any) {
      console.error("❌ handleSubmit error:", err);

      const msg = err?.message || "요청 중 오류가 발생했습니다.";
      setErrorMsg(msg);
      alert(msg);
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {

  }, []);

  return (
    <div className="relative w-full min-h-screen">
      {/* 배경 이미지 */}
      <Image
        src="/guide_bg.svg"
        alt="가이드 배경"
        fill
        className="object-cover"
        priority
      />
      <div className="relative flex flex-col items-center w-full min-h-screen gap-[35px]">
        <div className="relative w-full h-[40px]">
          {/* 로고 영역 */}
          <Image
            src="/logo.svg"
            alt="마실"
            className="absolute top-[75px] left-1/2 -translate-x-1/2 -translate-y-full cursor-pointer"
            width={100}
            height={100}
            onClick={() => {
              router.push("/");
            }}
          />
        </div>

        <div className="flex flex-col items-center justify-center w-full py-[30px] gap-[30px]">
          {/* 사용자 정보 카드 */}
          <div className="flex flex-col items-center justify-center w-[1121px] rounded-2xl bg-white px-4 md:px-[91px] py-[40px] gap-[10px] text-[#282828] text-lg md:text-xl font-normal font-['Pretendard'] flex-shrink-0">
            <div className="flex flex-col items-center justify-center gap-[8px]">
              <p>출발지</p>
              <p className="text-3xl font-semibold">{origin}</p>
            </div>
            <div className="flex flex-row justify-center w-full min-h-[80px] gap-[50px]">
              <div className="flex flex-col items-center justify-start gap-[8px]">
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

          {/* 가이드 카드 */}
          {guideResults?.map((plan, index) => (
            <Card
              key={index}
              planId={plan.planId}
              order={plan.order}
              itemDtos={plan.itemDtos}
            />
          ))}

          {/* 다시 추천해주세요 버튼 */}
          {/* <button
            className="flex items-center justify-center h-14 px-[25px] py-5 bg-white rounded-[5px] shadow-sm text-[#282828] text-xl font-semibold font-['Pretendard'] gap-[8px] hover:bg-[#f5f5f5]"
            onClick={handleRefresh}
          >
            <Image src={reset_orange} alt="reset" width={21} height={21} />
            다시 추천해 주세요
          </button> */}
        </div>
      </div>
    </div>
  );
}
