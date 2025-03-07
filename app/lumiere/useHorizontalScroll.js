// useHorizontalScroll.js - 커스텀 훅 개선 (세로 스크롤 허용)
import { useState, useRef, useEffect } from "react";

const useHorizontalScroll = () => {
  const stickyRef = useRef(null);
  const stickyParentRef = useRef(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const requestIdRef = useRef(null);

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

    // 터치 이벤트 관련 코드 제거 - 세로 스크롤 방해하지 않도록

    // 초기 렌더링 시 상태 확인을 위한 호출
    handleScroll();

    // 컴포넌트 언마운트 시 이벤트 리스너와 애니메이션 정리
    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame();
    };
  }, [scrollPosition]);

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
