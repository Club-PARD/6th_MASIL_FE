import html2canvas from "html2canvas";

export async function downloadElementAsImage(
  element: HTMLElement,
  fileName: string
) {
  // 원본 스타일 백업
  const originalStyle = {
    position: element.style.position,
    top: element.style.top,
    left: element.style.left,
    transform: element.style.transform,
    zIndex: element.style.zIndex,
    maxHeight: element.style.maxHeight,
    overflow: element.style.overflow,
  };


  try {
    // fixed 요소를 임시로 static으로 변경
    element.style.position = 'static';
    element.style.top = 'auto';
    element.style.left = 'auto';
    element.style.transform = 'none';
    element.style.zIndex = 'auto';
    element.style.maxHeight = 'none';
    element.style.overflow = 'visible';

    const canvas = await html2canvas(element, {
      backgroundColor: "#ffffff", // 흰색 배경 강제 설정
      useCORS: true,
      allowTaint: false,
      scale: 1, // scale을 1로 낮춤
      scrollX: 0,
      scrollY: 0,
      x: 0,
      y: 0,
      width: element.scrollWidth,
      height: element.scrollHeight,
      ignoreElements: (element) => {
        // 불필요한 요소들 무시
        return element.tagName === 'SCRIPT' || 
               element.classList.contains('ignore-screenshot');
      },
      onclone: (clonedDoc, clonedElement) => {
        // 클론된 요소의 배경색을 명시적으로 설정
        clonedElement.style.backgroundColor = "#ffffff";
        clonedElement.style.color = "#282828";
        
        // 모든 자식 요소들의 배경색도 확인
        const allElements = clonedElement.querySelectorAll('*');
        allElements.forEach((el) => {
          if (el instanceof HTMLElement) {
            const computedStyle = window.getComputedStyle(el);
            if (computedStyle.backgroundColor === 'rgba(0, 0, 0, 0)' || 
                computedStyle.backgroundColor === 'transparent') {
              el.style.backgroundColor = 'transparent';
            }
          }
        });
      }
    });

    const image = canvas.toDataURL("image/png", 1.0);

    const link = document.createElement("a");
    link.href = image;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (err) {
    console.error("다운로드 실패:", err);
  } finally {
    // 원본 스타일 복원
    Object.keys(originalStyle).forEach(key => {
      element.style[key as any] = originalStyle[key as keyof typeof originalStyle];
    });
  }
}