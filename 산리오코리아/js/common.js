// =====================================================
// common.js: 공통 메뉴 및 공통 인터랙션 기능
// 헤더 햄버거 메뉴 열기/닫기 토글 기능
// =====================================================

window.addEventListener("DOMContentLoaded", () => {
  // 1. 공통 메뉴 관련 요소 선택
  const menuBtn = document.querySelector(".menu-btn");
  const topArea = document.querySelector(".top-area");

  // 페이지에 메뉴 관련 요소가 없는 경우 실행하지 않도록 방어 코드 작성
  if (!menuBtn || !topArea) return;

  // 2. 햄버거 버튼 클릭 이벤트 바인딩
  menuBtn.addEventListener("click", () => {
    // 상단 영역에 on 클래스를 토글하여 메뉴 열림/닫힘 제어
    topArea.classList.toggle("on");
  });
});
