// =====================================================
// main.js: 메인 페이지 전용 기능
// 메인 배너 비주얼 클릭 시 상단 영역 배경 변경 및 로고 회전 애니메이션
// =====================================================

window.addEventListener("DOMContentLoaded", () => {
  // 1. 메인 배너 이벤트 대상 및 변경 대상 선택
  const bannerImg = document.querySelector(".main-visual-img");
  const topArea = document.querySelector(".top-area");

  // 페이지 전용 요소가 없는 페이지에서는 스크립트를 실행하지 않도록 확인
  if (!bannerImg || !topArea) return;

  // 2. 상단 스타일 변경 및 로고 회전 함수 정의
  const changeHeaderStyle = (color) => {
    // 상단 헤더 배경색 변경 및 2초 트랜지션
    topArea.style.backgroundColor = color;
    topArea.style.transition = "2s ease-in-out";

    // 상단 로고 박스 360도 회전 애니메이션 (2초 지연 후 1초 동안 회전)
    const logoBox = topArea.querySelector(".logo-box");
    if (logoBox) {
      logoBox.style.rotate = "360deg";
      logoBox.style.transition = "1s ease-in-out 2s";
    }
  };

  // 3. 메인 비주얼 이미지 클릭 이벤트 등록
  bannerImg.addEventListener("click", () => {
    changeHeaderStyle("orange");
  });
});
