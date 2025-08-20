import { useState } from "react";
import GuideDetailModal from "./GuideDetailModal";

// download image from div
import { downloadElementAsImage } from "@/utils/downloadImage";
import { useRef } from "react";

type ItemDto = {
  title: string;
  order_num: number;
};

type CardProps = {
  planId: number | null; // 가이드 ID
  order: number | null; // 몇 번째 코스인지
  itemDtos: ItemDto[] | null; // 코스
};

const Card = ({ planId, order, itemDtos }: CardProps) => {
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);
  const [isHiddenModalOpen, setIsHiddenModalOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  

  const handleOpen = () => {
    if (!isGuideModalOpen) {
      setIsGuideModalOpen(true);
    }
  };

  // download
  const exportRef = useRef<HTMLDivElement>(null);

  const handleDownload = () => {
    if (exportRef.current) {
      downloadElementAsImage(exportRef.current, `마실코스${order}.png`);
    }
  };

  return (
    <div
      className="flex flex-row w-[1121px] px-[40px] py-[20px] gap-[60px] bg-white rounded-[20px] cursor-pointer items-center justify-center text-[#282828] hover:text-[#FE7600] shadow-lg"
      onClick={handleOpen}
      ref={exportRef}
    >
      <div className="flex-shrink-0 min-w-[180px]">
        <div className="text-3xl font-normal" style={{ fontFamily: 'yg-jalnan, sans-serif' }}>
          마실코스 {order}
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 font-semibold">
          {itemDtos?.map((item, index) => (
            <div
              key={index}
              className="flex items-center text-[#282828] text-2xl space-x-2"
            >
              <span className="truncate max-w-[150px]" title={item.title}>
                {item.title}
              </span>
              {index !== itemDtos.length - 1 && (
                <span className="ml-2 flex-shrink-0">→</span>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-[7px] flex-shrink-0">
        <button
          className="px-[15px] py-2.5 bg-[#f5f5f5] rounded-[5px] gap-2.5 text-[#FE7600] text-xl font-semibold font-['Pretendard'] hover:bg-[#FE7600] hover:text-white"
          onClick={(e) => {
            e.stopPropagation();
            setIsGuideModalOpen(true);
          }}
        >
          상세 보기
        </button>
        <button
          className="px-[15px] py-2.5 bg-[#f5f5f5] rounded-[5px] gap-2.5 text-[#FE7600] text-xl font-semibold font-['Pretendard'] hover:bg-[#FE7600] hover:text-white"
          onClick={(e) => {
            e.stopPropagation();
            handleDownload();
          }}
        >
          다운로드
        </button>
      </div>

      {isGuideModalOpen && (
        <GuideDetailModal
          planId={planId}
          order={order}
          open={isGuideModalOpen}
          onClose={() => setIsGuideModalOpen(false)}
        />
      )}
    </div>
  );
};

export default Card;
