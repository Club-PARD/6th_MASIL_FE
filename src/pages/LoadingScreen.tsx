"use client";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

export default function LoadingScreen() {
  const INTERVAL_MS = 1200;

  // 여기에 실제 파일명 배열을 넣으세요
  const images = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => `/stopbgg${i + 1}.svg`),
    []
  );

  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setIdx((p) => (p + 1) % images.length);
    }, INTERVAL_MS);
    return () => clearInterval(t);
  }, [images.length]);

  return (
    <div className="fixed inset-0 z-50 bg-white">
      {/* 상단 중앙 로고 */}
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

      {/* 중앙 영역 */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-[min(90vw,800px)] aspect-[3/2]">
          {/* 겹쳐놓고 opacity로 페이드 */}
          {images.map((src, i) => (
            <div
              key={src}
              className={`absolute inset-0 transition-opacity duration-700`}
              style={{ opacity: i === idx ? 1 : 0 }}
              aria-hidden={i === idx ? "false" : "true"}
            >
              <Image
                src={src}
                alt={`로딩 이미지 ${i + 1}`}
                fill
                className="object-contain"
                // 현재 것만 priority 주기 (첫 진입시 빠른 로드)
                priority={i === idx}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
