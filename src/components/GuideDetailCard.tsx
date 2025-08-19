import Image from "next/image";
import pin_neutral from "@/assets/icons/pin_neutral.svg";

import { GuideDetailItem } from "@/stores/useGuideStore";

type GuideDetailCardProps = {
  item: GuideDetailItem;
};

export default function GuideDetailCard({ item }: GuideDetailCardProps) {
  return (
    <div className="flex flex-row items-center justify-center w-full px-[37px] gap-[80px] text-[30px] text-[#282828] font-semibold">
      {/* 시간대 */}
      {item.start_time && (
        <div className="flex justify-start w-[80px] h-full">
          {item.start_time}
        </div>
      )}

      <div className="flex flex-col w-full h-full border-l-3 border-[#C2C2C2] px-[15px] font-semibold}">
        {/* 장소 */}
        {item.title && (
          <div className={`${item.transport ? "" : "text-[#FE7600]"}`}>{item.title}</div>
        )}

        {/* 소요시간과 가격 */}
        {(item.duration || item.cost) && (
          <div className="flex flex-row w-full justify-start pb-[19px] gap-[10px]">
            {item.duration && (
              <div className="flex items-center justify-center min-w-[80px] px-2.5 py-[8px] rounded-sm bg-neutral-100 text-[#757575] text-base">
                {item.duration}
              </div>
            )}
            {item.cost != null && (
              <div className="flex items-center justify-center min-w-[80px] px-2.5 py-[8px] rounded-sm bg-neutral-100 text-[#757575] text-base">
                {item.cost}원
              </div>
            )}
          </div>
        )}

        {/* 설명과 링크 */}
        {(item.description || item.link_url) && (
          <div className="flex flex-col text-[24px] font-normal gap-[10px]">
            {item.description && <div>{item.description}</div>}
            {item.link_url && (
              <div className="flex flex-row items-center underline">
                <Image src={pin_neutral} alt="pin" width={28} height={28} />
                <a
                  href={item.link_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-2"
                >
                  {item.link_url}
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
