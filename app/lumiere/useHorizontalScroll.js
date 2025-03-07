// useHorizontalScroll.js - 세로, 가로 스크롤 모두 활성화
import { useState, useRef, useEffect } from "react";

const useHorizontalScroll = () => {
  const stickyRef = useRef(null);
  const stickyParentRef = useRef(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const requestIdRef = useRef(null);
  const isManualScrolling = useRef(false);

  useEffect(() => {
    // 이전 애니메이션 프레임 취소 함수
    const cancelAnimationFrame = () => {
      if (requestIdRef.current !== null) {
        window.cancelAnimationFrame(requestIdRef.current);
        requestIdRef.current = null;
      }
    };

    const handleScroll = () => {
      // 수동 스크롤 중에는 자동 스크롤 비활성화
      if (isManualScrolling.current) return;

      // 모바일 환경에서만 작동
      if (window.innerWidth > 768) return;
      if (!stickyRef.current || !stickyParentRef.current) return;

      const sticky = stickyRef.current;
      const stickyParent = stickyParentRef.current;
      const parentRect = stickyParent.getBoundingClientRect();

      // 가시성 임계값 개선 - 화면 상단에 더 가깝게 설정
      const visibilityThreshold = window.innerHeight * 0.4;
      const shouldBeVisible =
        parentRect.top <= visibilityThreshold && parentRect.bottom >= 0;

      // 가시성 상태 업데이트
      setIsVisible(shouldBeVisible);

      // 가시성 조건을 만족하지 않으면 스크롤 초기화
      if (!shouldBeVisible) {
        cancelAnimationFrame();
        sticky.scrollLeft = 0;
        setScrollPosition(0);
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
      const targetScroll = easeInOutCubic(scrollProgress) * scrollWidth;

      // 부드러운 스크롤을 위한 애니메이션 프레임 사용
      const animateScroll = () => {
        // 수동 스크롤 중에는 애니메이션 중단
        if (isManualScrolling.current) {
          requestIdRef.current = null;
          return;
        }

        const smoothFactor = 0.12;
        const nextPosition =
          scrollPosition + (targetScroll - scrollPosition) * smoothFactor;

        // 작은 변화는 무시하여 안정성 개선
        if (Math.abs(nextPosition - scrollPosition) < 0.1) {
          sticky.scrollLeft = targetScroll;
          setScrollPosition(targetScroll);
          requestIdRef.current = null;
          return;
        }

        sticky.scrollLeft = nextPosition;
        setScrollPosition(nextPosition);
        requestIdRef.current = window.requestAnimationFrame(animateScroll);
      };

      // 기존 애니메이션 취소 후 새로운 애니메이션 시작
      cancelAnimationFrame();
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
  }, [scrollPosition]);

  // 가로 스크롤 허용을 위한 터치 이벤트 처리
  useEffect(() => {
    if (!stickyRef.current) return;

    const element = stickyRef.current;
    let startX, startScrollLeft;

    // 마우스 이벤트 (데스크톱용)
    const handleMouseDown = (e) => {
      isManualScrolling.current = true;
      startX = e.pageX - element.offsetLeft;
      startScrollLeft = element.scrollLeft;

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    };

    const handleMouseMove = (e) => {
      if (!isManualScrolling.current) return;

      const x = e.pageX - element.offsetLeft;
      const walk = (x - startX) * 2; // 스크롤 속도 조정
      element.scrollLeft = startScrollLeft - walk;
      setScrollPosition(element.scrollLeft);
    };

    const handleMouseUp = () => {
      isManualScrolling.current = false;
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);

      // 일정 시간 후 자동 스크롤 활성화
      setTimeout(() => {
        isManualScrolling.current = false;
      }, 300);
    };

    // 터치 이벤트 (모바일용)
    let isTouchScrollingHorizontally = false;
    let initialTouchY = 0;
    let initialTouchX = 0;

    const handleTouchStart = (e) => {
      if (e.touches.length > 1) return; // 멀티 터치 무시

      initialTouchX = e.touches[0].clientX;
      initialTouchY = e.touches[0].clientY;
      startX = initialTouchX;
      startScrollLeft = element.scrollLeft;

      // 터치 시작시에는 수평 스크롤 여부 결정하지 않음
      isTouchScrollingHorizontally = false;
    };

    const handleTouchMove = (e) => {
      if (e.touches.length > 1) return; // 멀티 터치 무시

      const touchX = e.touches[0].clientX;
      const touchY = e.touches[0].clientY;

      // 터치 이동 거리 계산
      const deltaX = Math.abs(touchX - initialTouchX);
      const deltaY = Math.abs(touchY - initialTouchY);

      // 처음 이동 방향에 따라 수평/수직 스크롤 여부 결정
      if (!isTouchScrollingHorizontally && (deltaX > 10 || deltaY > 10)) {
        // 수평 이동이 수직 이동보다 크면 수평 스크롤로 결정
        if (deltaX > deltaY) {
          isTouchScrollingHorizontally = true;
          isManualScrolling.current = true;
          // 기본 세로 스크롤 방지는 여기서는 하지 않음 (호환성 문제로)
        } else {
          // 수직 스크롤이므로 자동 스크롤 계속 진행
          isTouchScrollingHorizontally = false;
          isManualScrolling.current = false;
          return;
        }
      }

      // 수평 스크롤로 결정된 경우에만 가로 스크롤 처리
      if (isTouchScrollingHorizontally) {
        const x = touchX;
        const walk = (startX - x) * 1.5; // 스크롤 속도 조정
        element.scrollLeft = startScrollLeft + walk;
        setScrollPosition(element.scrollLeft);

        // 이벤트 기본 동작 방지는 여기서는 생략 (호환성 문제)
      }
    };

    const handleTouchEnd = () => {
      if (isTouchScrollingHorizontally) {
        // 수평 스크롤 종료 후 일정 시간 뒤 자동 스크롤 재개
        setTimeout(() => {
          isManualScrolling.current = false;
          isTouchScrollingHorizontally = false;
        }, 300);
      }
    };

    // 이벤트 리스너 등록
    element.addEventListener("mousedown", handleMouseDown);
    element.addEventListener("touchstart", handleTouchStart, { passive: true });
    element.addEventListener("touchmove", handleTouchMove, { passive: true });
    element.addEventListener("touchend", handleTouchEnd, { passive: true });

    // 이벤트 리스너 정리
    return () => {
      element.removeEventListener("mousedown", handleMouseDown);
      element.removeEventListener("touchstart", handleTouchStart);
      element.removeEventListener("touchmove", handleTouchMove);
      element.removeEventListener("touchend", handleTouchEnd);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  // 다른 섹션과의 충돌 방지를 위한 IntersectionObserver 추가
  useEffect(() => {
    if (!stickyParentRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // 요소가 뷰포트에서 사라지면 스크롤 위치 초기화
          if (!entry.isIntersecting && stickyRef.current) {
            stickyRef.current.scrollLeft = 0;
            setScrollPosition(0);
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
