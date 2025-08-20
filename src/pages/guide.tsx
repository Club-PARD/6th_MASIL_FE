import Card from "@/components/GuideCard";
import Image from "next/image";
// import reset_orange from "@/assets/icons/reset_orange.svg";

import {
  useOriginStore,
  useBudgetStore,
  useMoveStore,
  usePeopleStore,
  useThemeStore,
  useTripStore,
} from "@/stores/useTripStore";
import { useGuideStore } from "@/stores/useGuideStore";

import { useEffect } from "react";
import { useRouter } from "next/router";

export default function GuidePage() {
  const router = useRouter();

  const { origin } = useOriginStore();
  const { date, startTime, endTime, guideType } = useTripStore();
  const { people } = usePeopleStore();
  const { car } = useMoveStore();
  const { budget } = useBudgetStore();
  const { theme } = useThemeStore();
  const { guideResults } = useGuideStore();

  // test
  const { setGuideResults } = useGuideStore();

  useEffect(() => {
    const res = {
      responsePlanDtos: [
        {
          order: 1,
          planId: 1,
          itemDtos: [
            {
              title: "이동",
              order_num: 1,
            },
            {
              title: "본태박물관에서 전시 관람",
              order_num: 2,
            },
            {
              title: "아침식사",
              order_num: 3,
            },
            {
              title: "초콜릿랜드에서 전시 관람",
              order_num: 4,
            },
            {
              title: "점심식사",
              order_num: 5,
            },
            {
              title: "무민랜드제주에서 전시 관람",
              order_num: 6,
            },
            {
              title: "제주유리박물관 방문",
              order_num: 7,
            },
            {
              title: "이동",
              order_num: 8,
            },
          ],
        },
        {
          order: 2,
          planId: 2,
          itemDtos: [
            { title: "Plan2-Item1", order_num: 0 },
            { title: "Plan2-Item2", order_num: 1 },
            { title: "Plan2-Item3", order_num: 2 },
            { title: "Plan2-Item1", order_num: 0 },
            { title: "Plan2-Item2", order_num: 1 },
            { title: "Plan2-Item3", order_num: 2 },
            { title: "Plan2-Item1", order_num: 0 },
            { title: "Plan2-Item2", order_num: 1 },
            { title: "Plan2-Item3", order_num: 2 },
            { title: "Plan2-Item1", order_num: 0 },
            { title: "Plan2-Item2", order_num: 1 },
            { title: "Plan2-Item3", order_num: 2 },
            { title: "Plan2-Item1", order_num: 0 },
            { title: "Plan2-Item2", order_num: 1 },
            { title: "Plan2-Item3", order_num: 2 },
          ],
        },
      ],
    };
    setGuideResults(res.responsePlanDtos);
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
                <p className="text-3xl font-semibold">총 {budget * people}만원</p>
              </div>
              <div className="flex flex-col items-center justify-start h-[80px] gap-[8px]">
                <p>나들이 테마</p>
                <p className="text-3xl font-semibold">{theme}</p>
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
          // onClick={}
        >
          <Image src={reset_orange} alt="reset" width={21} height={21} />
          다시 추천해 주세요
        </button> */}
        </div>
      </div>
    </div>
  );
}
