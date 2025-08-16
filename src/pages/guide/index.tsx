import Card from "@/components/GuideCard";

export default function GuidePage() {
    return(
        <div className="flex flex-col items-center justify-center min-h-lvh bg-[#F6F6F6]">
            {/* main page에 구현된 거 가져올 예정 */}

            {/* 아직 API 명세서 못 받아서 어떤 데이터 들어올지 모름
            map 함수로 반복시킬 예정 */}
            <Card number={1} course={['서울', '부산', '포항']}/>
        </div>
    );
}