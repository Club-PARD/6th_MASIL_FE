import Card from "@/components/GuideCard";
import Image from "next/image";
import {
  useOriginStore,
  useBudgetStore,
  useMoveStore,
  usePeopleStore,
  useThemeStore,
  useTripStore,
} from "@/stores/useTripStore";

export default function GuidePage() {
  const { origin } = useOriginStore();
  const { date, startTime, endTime, guideType } = useTripStore();
  const { people } = usePeopleStore();
  const { car } = useMoveStore();
  const { budget } = useBudgetStore();
  const { theme } = useThemeStore();

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

      <div className="flex flex-col items-center justify-center w-full gap-[20px]">
        {/* 사용자 정보 카드 */}
        <div className="flex flex-col items-center justify-center w-[1121px] h-[200px] rounded-2xl px-[91px] py-[30px] gap-[40px]">
          <div>
            <div>출발지</div>
            <div>{origin}</div>
          </div>
          <div className="flex flex-row justify-center w-full gap-[50px]">
            <div>
              <div>출발일</div>
              <div>{date}</div>
            </div>
            <div>
              <div>인원수</div>
              <div>{people}</div>
            </div>
            <div>
              <div>이동수단</div>
              <div>{car}</div>
            </div>
            <div>
              <div>예산</div>
              <div>{budget}</div>
            </div>
            <div>
              <div>나들이 테마</div>
              <div>{theme}</div>
            </div>
          </div>
        </div>

        {/* 가이드 카드 */}
        <Card number={1} course={["서울", "부산", "포항"]} />
        <Card number={1} course={["서울", "부산", "포항"]} />
        <Card number={1} course={["서울", "부산", "포항"]} />

        {/* 다시 추천해주세요 버튼 */}
        <button>다시 추천해 주세요</button>
      </div>
    </div>
  );
}
