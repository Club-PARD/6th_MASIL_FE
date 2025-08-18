import { HTMLAttributes, useState } from "react";
import GuideDetailModal from "./GuideDetailModal";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  number: number; // 몇 번째 코스인지
  course: string[]; // 가이드 코스
  // 자세한 내용으로 들어올 것들 필요함
}

const Card = ({ number, course, ...props }: CardProps) => {
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);

  return (
    <div
      className="flex flex-row w-[1121px] h-[130px] px-[72px] py-[29px] gap-[60px] bg-white rounded-[20px] cursor-pointer items-center justify-between text-[#282828] hover:text-[#FE7600]"
      onClick={() => setIsGuideModalOpen(true)}
    >
      <div className="text-3xl text-3xl font-normal font-['Jalnan_2']">
        마실코스 {number}
      </div>
      <div className="flex flex-row space-x-2">
        {course.map((location, index) => (
          <div key={index} className="text-[#282828] text-2xl space-x-2">
            <span>{location}</span>
            {index !== course.length - 1 && <span>→</span>}
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-[7px]">
        <button
          className="px-[15px] py-2.5 bg-neutral-100 rounded-[5px] gap-2.5 text-[#FE7600] text-xl font-semibold font-['Pretendard'] hover:bg-[#FE7600] hover:text-white"
          onClick={() => setIsGuideModalOpen(true)}
        >
          상세 보기
        </button>
        <button
          className="px-[15px] py-2.5 bg-neutral-100 rounded-[5px] gap-2.5 text-[#FE7600] text-xl font-semibold font-['Pretendard'] hover:bg-[#FE7600] hover:text-white"
          onClick={() => {}}
        >
          다운로드
        </button>
      </div>

      {isGuideModalOpen && (
        <GuideDetailModal
          open={isGuideModalOpen}
          onClose={() => setIsGuideModalOpen(false)}
        />
      )}
    </div>
  );
};

export default Card;
