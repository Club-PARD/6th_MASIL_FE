import { HTMLAttributes } from "react";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
    number: number; // 몇 번째 코스인지
    course: string[]; // 가이드 코스
    // 자세한 내용으로 들어올 것들 필요함
}

const Card = ({
    number,
    course,
    ...props
    }: CardProps) => {
    return (
        <div className="w-[1000px] h-24 flex flex-row items-center justify-around bg-neutral-100 rounded-2xl">
            <div className="flex flex-col items-center justify-center">
                <span className="text-3xl text-neutral-900">코스 {number}</span>
            </div>
            <div className="flex flex-row space-x-2">
                {course.map((location, index) => (
                    <div key={index} className="flex flex-row items-center text-2xl space-x-2">
                        <span>{location}</span>
                        {index !== course.length - 1 && <span>→</span>}
                    </div>
                ))}
            </div>
            <div>
                <a href="#" className="underline">자세히 보기</a>
            </div>
        </div>
    );
}

export default Card;