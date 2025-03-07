// useHorizontalScroll.js - 스크롤 방향에 따른 가로 스크롤 개선
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
  const maxReachedScrollLeftRef = useRef(0);
  const targetScrollRef = useRef(0);
  const lastScrollTimeRef = useRef(0);

  useEffect(() => {
    // 이전 애니메이션 프레임 취소 함수
    const cancelAnimationFrame = () => {
      if (requestIdRef.current !== null) {
        window.cancelAnimationFrame(requestIdRef.current);
        requestIdRef.current = null;
      }
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

      // 가시성 조건을 만족하지 않으면 스크롤 초기화
      if (!shouldBeVisible) {
        cancelAnimationFrame();
        sticky.scrollLeft = 0;
        setScrollPosition(0);
        maxReachedScrollLeftRef.current = 0;
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

      // 스크롤 방향에 따른 처리
      let targetScroll;

      if (isScrollingDownRef.current) {
        // 아래로 스크롤 중일 때
        // 계산된 목표 위치가 지금까지의 최대값보다 크면 업데이트
        if (calculatedTargetScroll > maxReachedScrollLeftRef.current) {
          maxReachedScrollLeftRef.current = calculatedTargetScroll;
        }
        // 아래로 스크롤 중일 때는 항상 최대 도달 위치를 목표로 사용
        targetScroll = maxReachedScrollLeftRef.current;
      } else {
        // 위로 스크롤 중일 때는 계산된 현재 위치를 사용
        targetScroll = calculatedTargetScroll;
        // 위로 스크롤 할 때 현재 계산된 위치가 최대 도달 위치보다 작으면 최대값도 함께 줄임
        if (calculatedTargetScroll < maxReachedScrollLeftRef.current) {
          maxReachedScrollLeftRef.current = calculatedTargetScroll;
        }
      }

      targetScrollRef.current = targetScroll;

      // 현재 시간과 마지막 스크롤 시간 사이의 간격이 충분한지 확인 (스로틀링)
      const now = Date.now();
      const timeSinceLastScroll = now - lastScrollTimeRef.current;

      // 너무 빈번한 업데이트 방지 (50ms 간격)
      if (timeSinceLastScroll < 50) {
        return;
      }

      // 목표 위치와 현재 위치의 차이가 충분히 큰 경우에만 애니메이션 실행
      if (Math.abs(targetScroll - sticky.scrollLeft) > 3) {
        lastScrollTimeRef.current = now;
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
        const smoothFactor = 0.1;
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let startX, startY, startScrollLeft;
    let isTouchActive = false;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleTouchMove = (e) => {
      if (!isTouchActive || e.touches.length !== 1) return;

      const x = e.touches[0].pageX;
      const y = e.touches[0].pageY;

      // 세로 vs 가로 움직임 감지
      const deltaX = Math.abs(x - startX);
      const deltaY = Math.abs(y - startY);

      // 가로 움직임이 더 크다면 터치 이벤트 차단 (세로 스크롤 허용)
      if (deltaX > deltaY) {
        // 가로 스크롤 시도를 감지하면 스크롤 위치 고정
        element.scrollLeft = targetScrollRef.current;
      }
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleTouchEnd = () => {
      isTouchActive = false;

      // 터치가 끝나면 자동 스크롤 재개를 위해 상태 업데이트
      if (element.scrollLeft !== targetScrollRef.current) {
        element.scrollLeft = targetScrollRef.current;
      }
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (entries) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        entries.forEach((entry) => {
          // 요소가 뷰포트에서 사라지면 스크롤 위치 초기화
          if (!entry.isIntersecting && stickyRef.current) {
            stickyRef.current.scrollLeft = 0;
            setScrollPosition(0);
            maxReachedScrollLeftRef.current = 0;
            targetScrollRef.current = 0;
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
