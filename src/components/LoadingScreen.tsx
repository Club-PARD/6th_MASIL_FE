"use client";

import Image from "next/image";

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-50">
      {/* ✅ fill 쓸 때 부모는 relative + 확실한 크기 */}
      <div className="relative w-screen h-screen">
        <Image
          src="/stop.svg"
          alt="로딩 중"
          fill
          priority
          className="object-cover object-top bg-white" 
          // object-top: 로고가 위에 있을 때 잘 안잘리게
        />
      </div>

      {/* 중앙 로딩 점 */}
      <div className="absolute inset-0 flex items-center justify-center gap-5 z-[60]">
        <span className="dot dot1" />
        <span className="dot dot2" />
        <span className="dot dot3" />
      </div>

      <style jsx>{`
        .dot {
          width: 24px; height: 24px;
          border-radius: 50%;
          background: #555;
          animation: bounceY 1s infinite ease-in-out;
        }
        .dot1 { animation-delay: 0s; }
        .dot2 { animation-delay: 0.2s; }
        .dot3 { animation-delay: 0.4s; }

        @keyframes bounceY {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
}
