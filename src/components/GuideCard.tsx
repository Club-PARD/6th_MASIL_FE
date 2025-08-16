import { HTMLAttributes, useState } from "react";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  number: number; // 몇 번째 코스인지
  course: string[]; // 가이드 코스
  // 자세한 내용으로 들어올 것들 필요함
}

const Card = ({ number, course, ...props }: CardProps) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-row w-[1121px] h-[130px] m-[] px-[72px] py-[29px] bg-white rounded-[20px] items-center justify-between">
      <div className="text-3xl text-[#282828] text-3xl font-normal font-['Jalnan_2']">
        마실코스 {number}
      </div>
      <div className="flex flex-row space-x-2">
        {course.map((location, index) => (
          <div key={index} className="text-2xl space-x-2">
            <span>{location}</span>
            {index !== course.length - 1 && <span>→</span>}
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-[7px]">
        <div
          className="px-[15px] py-2.5 bg-neutral-100 rounded-[5px] gap-2.5 cursor-pointe text-xl text-[#5DA613] font-semibold"
          onClick={() => setOpen(!open)}
        >
          상세 보기
        </div>
        <div className="px-[15px] py-2.5 bg-[#DBF3C3] rounded-[5px] gap-2.5 cursor-pointe text-xl text-[#5DA613] font-semibold">
          다운로드
        </div>
      </div>
    </div>
  );
};

export default Card;
