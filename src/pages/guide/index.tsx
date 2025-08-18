import Card from "@/components/GuideCard";

export default function GuidePage() {
  return (
    <div className="flex flex-col items-center min-h-lvh bg-[#F6F6F6] p-[41px] gap-[35px]">
      <div className="flex items-center justify-center w-full text-[#fe7600] text-[40px] font-normal font-['Jalnan_2']">
        마실
      </div>

      <div className="flex flex-col items-center justify-center w-full gap-[20px]">
        {/* 사용자 정보 카드 */}
        <div className="flex flex-col items-center justify-center w-[1121px] h-[200px] rounded-2xl px-[91px] py-[30px] gap-[40px]">
          <div>
            <div>출발지</div>
            <div>{}</div>
          </div>
          <div className="flex flex-row justify-center w-full gap-[50px]">
            <div>출발일</div>
            <div>인원수</div>
            <div>이동수단</div>
            <div>예산</div>
            <div>나들이 테마</div>
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
