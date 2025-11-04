import html2canvas from "html2canvas";
export async function downloadElementAsImage(
  element: HTMLElement,
  fileName: string
) {

  try {
    const canvas = await html2canvas(element, {
      backgroundColor: "#ffffff", // 흰색 배경 강제 설
      useCORS: true,
      allowTaint: false,
      scale: 1, 
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
        clonedElement.style.backgroundColor = "#ffffff";
        clonedElement.style.color = "#282828";
        
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

    // ... (다운로드 로직)
    const link = document.createElement("a");
    link.href = image;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

  } catch (err) {
    console.error("다운로드 실패:", err);
  }
}