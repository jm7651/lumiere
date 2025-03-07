// useHorizontalScroll.js - 스크롤 영역 벗어나도 가로 스크롤 위치 유지
import { useState, useRef, useEffect } from "react";

const useHorizontalScroll = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const stickyRef = useRef(null);
  const stickyParentRef = useRef(null);
  const requestIdRef = useRef(null);
  const lastScrollYRef = useRef(0);
  const isScrollingDownRef = useRef(false);
  const reachedEndRef = useRef(false);

  useEffect(() => {
    // 이전 애니메이션 프레임 취소 함수
    const cancelAnimationFrame = () => {
      if (requestIdRef.current !== null) {
        window.cancelAnimationFrame(requestIdRef.current);
        requestIdRef.current = null;
      }
    };

    const handleScroll = () => {
      // 모바일 환경에서만 작동
      if (window.innerWidth > 768) return;
      if (!stickyRef.current || !stickyParentRef.current) return;

      const sticky = stickyRef.current;
      const stickyParent = stickyParentRef.current;
      const parentRect = stickyParent.getBoundingClientRect();

      // 현재 세로 스크롤 위치
      const currentScrollY = window.scrollY;

      // 스크롤 방향 감지 (위/아래)
      const previousScrollY = lastScrollYRef.current;
      isScrollingDownRef.current = currentScrollY > previousScrollY;
      lastScrollYRef.current = currentScrollY;

      // 가시성 임계값 개선 - 화면 상단에 더 가깝게 설정
      const visibilityThreshold = window.innerHeight * 0.4;
      const shouldBeVisible =
        parentRect.top <= visibilityThreshold && parentRect.bottom >= 0;

      // 가시성 상태 업데이트
      setIsVisible(shouldBeVisible);

      // 가시성 조건을 만족하지 않아도 스크롤 위치 유지 (초기화하지 않음)
      if (!shouldBeVisible) {
        cancelAnimationFrame();
        return;
      }

      const scrollWidth = sticky.scrollWidth - sticky.clientWidth;
      const parentHeight = parentRect.height;
      const stickyHeight = sticky.getBoundingClientRect().height;

      // 수직 스크롤 범위 개선
      const verticalScrollHeight = Math.max(parentHeight - stickyHeight, 1);

      // 스크롤 진행률 계산 - 더 부드러운 시작과 끝을 위한 계산 방식 개선
      const scrollProgress = Math.max(
        0,
        Math.min(
          1,
          (-parentRect.top + visibilityThreshold) / verticalScrollHeight
        )
      );

      // 이징 함수 - 더 부드러운 곡선으로 변경
      const easeInOutCubic = (t) => {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      };

      // 목표 스크롤 위치 계산
      const calculatedTargetScroll = Math.round(
        easeInOutCubic(scrollProgress) * scrollWidth
      );

      // 이미 끝에 도달했는지 확인 (스크롤 위치가 95% 이상)
      const isNearEnd = calculatedTargetScroll >= scrollWidth * 0.95;

      // 끝에 도달했으면 플래그 설정
      if (isNearEnd) {
        reachedEndRef.current = true;
      }

      // 목표 스크롤 위치 결정 로직
      let targetScroll;

      if (reachedEndRef.current) {
        // 이미 끝에 도달했다면 항상 최대 위치 사용
        targetScroll = scrollWidth;
      } else {
        // 아직 끝에 도달하지 않았다면 계산된 위치 사용
        targetScroll = calculatedTargetScroll;
      }

      // 현재 위치와 목표 위치 차이가 충분히 클 때만 애니메이션 실행
      if (Math.abs(targetScroll - sticky.scrollLeft) > 3) {
        animateToTarget(sticky, targetScroll);
      }
    };

    // 목표 위치로 부드럽게 스크롤하는 함수
    const animateToTarget = (element, targetScroll) => {
      // 이미 애니메이션이 진행 중이면 취소
      cancelAnimationFrame();

      // 부드러운 스크롤을 위한 애니메이션 프레임 사용
      const animateScroll = () => {
        // 부드러운 이동을 위한 감속 계수 조정
        const smoothFactor = 0.12;
        const currentPosition = element.scrollLeft;
        const diff = targetScroll - currentPosition;

        // 스크롤 위치가 목표에 충분히 가깝다면 애니메이션 종료
        if (Math.abs(diff) < 0.5) {
          element.scrollLeft = targetScroll;
          setScrollPosition(targetScroll);
          requestIdRef.current = null;
          return;
        }

        // 다음 위치 계산
        const nextPosition = currentPosition + diff * smoothFactor;

        // 스크롤 위치 업데이트
        element.scrollLeft = nextPosition;
        setScrollPosition(nextPosition);

        // 다음 프레임 요청
        requestIdRef.current = window.requestAnimationFrame(animateScroll);
      };

      // 애니메이션 시작
      requestIdRef.current = window.requestAnimationFrame(animateScroll);
    };

    window.addEventListener("scroll", handleScroll);

    // 초기 렌더링 시 상태 확인을 위한 호출
    handleScroll();

    // 컴포넌트 언마운트 시 이벤트 리스너와 애니메이션 정리
    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame();
    };
  }, []);

  // 가로 스크롤 방지를 위한 CSS 및 이벤트 처리
  useEffect(() => {
    if (!stickyRef.current) return;

    const element = stickyRef.current;

    // 원래 스타일 저장
    const originalTouchAction = element.style.touchAction;

    // 가로 터치 입력 비활성화 (세로 터치는 허용)
    element.style.touchAction = "pan-y";

    // 터치 시작 시 현재 스크롤 위치 기억
    let startX = 0;
    let startY = 0;
    let startScrollLeft = 0;
    let isTouchActive = false;

    const handleTouchStart = (e) => {
      if (e.touches.length !== 1) return;

      isTouchActive = true;
      startX = e.touches[0].pageX;
      startY = e.touches[0].pageY;
      startScrollLeft = element.scrollLeft;

      // 터치 시작시 자동 스크롤 비활성화
      if (requestIdRef.current) {
        window.cancelAnimationFrame(requestIdRef.current);
        requestIdRef.current = null;
      }
    };

    const handleTouchMove = (e) => {
      if (!isTouchActive || e.touches.length !== 1) return;

      const x = e.touches[0].pageX;
      const y = e.touches[0].pageY;

      // 세로 vs 가로 움직임 감지
      const deltaX = Math.abs(x - startX);
      const deltaY = Math.abs(y - startY);

      // 가로 움직임이 더 크다면, 가로 터치 무시
      if (deltaX > deltaY) {
        // 가로 스크롤 위치 유지
        if (reachedEndRef.current) {
          // 끝에 도달했다면 끝에 위치 유지
          const scrollWidth = element.scrollWidth - element.clientWidth;
          element.scrollLeft = scrollWidth;
        } else {
          // 그렇지 않으면 시작 위치 유지
          element.scrollLeft = startScrollLeft;
        }
      }
    };

    const handleTouchEnd = () => {
      isTouchActive = false;
    };

    // 이벤트 리스너 등록
    element.addEventListener("touchstart", handleTouchStart, { passive: true });
    element.addEventListener("touchmove", handleTouchMove, { passive: true });
    element.addEventListener("touchend", handleTouchEnd, { passive: true });

    // 정리 함수
    return () => {
      // 원래 스타일 복원
      element.style.touchAction = originalTouchAction;

      // 이벤트 리스너 제거
      element.removeEventListener("touchstart", handleTouchStart);
      element.removeEventListener("touchmove", handleTouchMove);
      element.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  // 다른 섹션과의 충돌 방지를 위한 IntersectionObserver 추가
  useEffect(() => {
    if (!stickyParentRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // 요소가 뷰포트에서 사라져도 가로 스크롤 위치 유지
          // 재진입 시 가시성만 업데이트
          if (!entry.isIntersecting) {
            setIsVisible(false);
          }
        });
      },
      { threshold: 0.1 } // 10% 만 보여도 감지
    );

    observer.observe(stickyParentRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  return {
    stickyRef,
    stickyParentRef,
    isVisible,
  };
};

export default useHorizontalScroll;
