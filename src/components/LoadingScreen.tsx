"use client";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

export default function LoadingScreen() {
  const INTERVAL_MS = 200; // 빠르게

  const images = useMemo(
    () => Array.from({ length: 7 }, (_, i) => `/stbg${i + 1}.svg`),
    []
  );

  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (images.length === 0) return;
    const t = setInterval(() => {
      setIdx((p) => (p + 1) % images.length);
    }, INTERVAL_MS);
    return () => clearInterval(t);
  }, [images.length, INTERVAL_MS]);

  if (images.length === 0) return null;

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
        {/* ✅ 여기 크기를 키움 */}
        <div className="relative w-[min(95vw,1000px)] aspect-[16/9]">
          {images.map((src, i) => (
            <div
              key={src}
              className="absolute inset-0"
              style={{ opacity: i === idx ? 1 : 0 }}
              aria-hidden={i === idx ? "false" : "true"}
            >
              <Image
                src={src}
                alt={`로딩 이미지 ${i + 1}`}
                fill
                className="object-contain"
                priority={i === idx}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
