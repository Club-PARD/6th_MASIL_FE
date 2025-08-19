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

// test
// import { useEffect } from "react";

export default function GuidePage() {
  const { origin } = useOriginStore();
  const { date, startTime, endTime, guideType } = useTripStore();
  const { people } = usePeopleStore();
  const { car } = useMoveStore();
  const { budget } = useBudgetStore();
  const { theme } = useThemeStore();
  const { guideResults } = useGuideStore();

  // test
  // const { setGuideResults } = useGuideStore();

  // useEffect(() => {
  //   const res = {
  //     responsePlanDtos: [
  //       {
  //         order: 0,
  //         planId: 1,
  //         itemDtos: [
  //           { title: "Plan1-Item1", orderNum: 0 },
  //           { title: "Plan1-Item2", orderNum: 1 },
  //           { title: "Plan1-Item3", orderNum: 2 },
  //         ],
  //       },
  //       {
  //         order: 1,
  //         planId: 2,
  //         itemDtos: [
  //           { title: "Plan2-Item1", orderNum: 0 },
  //           { title: "Plan2-Item2", orderNum: 1 },
  //           { title: "Plan2-Item3", orderNum: 2 },
  //         ],
  //       },
  //     ],
  //   };
  //   setGuideResults(res.responsePlanDtos);
  // }, []);

  return (
    <div className="flex flex-col items-center w-full min-h-lvh bg-[#F6F6F6] gap-[35px]">
      <div className="relative w-full h-[40px]">
        {/* 로고 영역 */}
        <Image
          src="/logo.svg"
          alt="마실"
          className="absolute top-[75px] left-1/2 -translate-x-1/2 -translate-y-full z-10"
          width={100}
          height={100}
        />
      </div>

      <div className="flex flex-col items-center justify-center w-full py-[30px] gap-[30px]">
        {/* 사용자 정보 카드 */}
        <div className="flex flex-col items-center justify-center w-[1083px] rounded-2xl bg-white px-4 md:px-[91px] py-[30px] gap-[10px] text-[#282828] text-lg md:text-xl font-normal font-['Pretendard'] flex-shrink-0">
          <div className="flex flex-col items-center justify-center gap-[8px]">
            <p>출발지</p>
            <p className="text-3xl font-semibold">{origin}</p>
          </div>
          <div className="flex flex-row justify-center w-full min-h-[80px] gap-[50px]">
            <div className="flex flex-col items-center justify-start gap-[8px]">
              <p>출발일</p>
              <div className="flex flex-col items-center justify-center font-semibold">
                <div className="text-2xl">{date}</div>
                <div className="text-xl">
                  {startTime}
                  {endTime}
                  {guideType}
                </div>
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

        {/* 가이드 카드 */}
        {guideResults.map((plan, index) => (
          <Card
            planId={plan.planId}
            order={plan.order}
            itemDtos={plan.itemDtos}
          />
        ))}

        {/* 다시 추천해주세요 버튼 */}
        <button
          className="flex items-center justify-center h-14 px-[25px] py-5 bg-white rounded-[5px] shadow-sm text-[#282828] text-xl font-semibold font-['Pretendard'] gap-[8px] hover:bg-neutral-100"
          // onClick={}
        >
          <Image src={reset_orange} alt="reset" width={21} height={21} />
          다시 추천해 주세요
        </button>
      </div>
    </div>
  );
}
