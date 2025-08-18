import { HTMLAttributes, useState } from "react";
import GuideDetailModal from "./GuideDetailModal";

type ItemDto = {
  title: string;
  orderNum: number;
};

type CardProps = {
  planId: number; // 가이드 ID
  order: number; // 몇 번째 코스인지
  itemDtos: ItemDto[]; // 코스
};

const Card = ({ planId, order, itemDtos }: CardProps) => {
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);

  const handleOpen = () => {
    if (!isGuideModalOpen) {
      setIsGuideModalOpen(true);
    }
  };

  return (
    <div
      className="flex flex-row w-[1121px] h-[130px] px-[72px] py-[29px] gap-[60px] bg-white rounded-[20px] cursor-pointer items-center justify-between text-[#282828] hover:text-[#FE7600]"
      onClick={handleOpen}
    >
      <div className="text-3xl text-3xl font-normal font-['Jalnan_2']">
        마실코스 {order}
      </div>
      <div className="flex flex-row space-x-2">
        {itemDtos.map((item, index) => (
          <div key={index} className="text-[#282828] text-2xl space-x-2">
            <span>{item.title}</span>
            {index !== itemDtos.length - 1 && <span>→</span>}
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-[7px]">
        <button
          className="px-[15px] py-2.5 bg-neutral-100 rounded-[5px] gap-2.5 text-[#FE7600] text-xl font-semibold font-['Pretendard'] hover:bg-[#FE7600] hover:text-white"
          onClick={(e) => {
            e.stopPropagation();
            setIsGuideModalOpen(true);
          }}
        >
          상세 보기
        </button>
        <button
          className="px-[15px] py-2.5 bg-neutral-100 rounded-[5px] gap-2.5 text-[#FE7600] text-xl font-semibold font-['Pretendard'] hover:bg-[#FE7600] hover:text-white"
          onClick={(e) => {
            e.stopPropagation();
            console.log("다운로드 실행");
          }}
        >
          다운로드
        </button>
      </div>

      {isGuideModalOpen && (
        <GuideDetailModal
          planId={planId}
          open={isGuideModalOpen}
          onClose={() => setIsGuideModalOpen(false)}
        />
      )}
    </div>
  );
};

export default Card;
