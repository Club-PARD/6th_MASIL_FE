"use client";
import Image from "next/image";

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 bg-white">
      {/* ⬆️ 상단 중앙 로고 */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-[70] pointer-events-none">
        <Image
          src="/logo.svg"
          alt="로고"
          width={96}
          height={96}
          className="object-contain"
          priority
        />
      </div>

      <div className="absolute inset-0 flex items-center justify-center">
        {/* ⬇️ 이미지 원본 비율에 맞게 조정 (필요시 aspect 비율 변경) */}
        <div className="relative w-[min(90vw,800px)] aspect-[3/2]">
          <Image
            src="/stopbgg.svg"
            alt="로딩 중"
            fill
            priority
            className="object-contain"
          />
        </div>
      </div>

      {/* 로딩 점 
      
      <div className="absolute inset-0 flex items-center justify-center gap-5">
        <span className="dot dot1" />
        <span className="dot dot2" />
        <span className="dot dot3" />
      </div>

      <style jsx>{`
        .dot { width:24px; height:24px; border-radius:50%; background:#555; animation:bounceY 1s infinite ease-in-out; }
        .dot1 { animation-delay: 0s; }
        .dot2 { animation-delay: 0.2s; }
        .dot3 { animation-delay: 0.4s; }
        @keyframes bounceY { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-10px)} }
      `}</style>
    </div>
  */}
</div>
  )
};
