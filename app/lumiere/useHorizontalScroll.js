// useHorizontalScroll.js - 세로 스크롤만 허용하고 자동 가로 스크롤 구현
import { useState, useRef, useEffect } from "react";

const useHorizontalScroll = () => {
  const stickyRef = useRef(null);
  const stickyParentRef = useRef(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const requestIdRef = useRef(null);

  useEffect(() => {
    const cancelAnimationFrame = () => {
      if (requestIdRef.current !== null) {
        window.cancelAnimationFrame(requestIdRef.current);
        requestIdRef.current = null;
      }
    };

    const handleScroll = () => {
      if (window.innerWidth > 768) return;
      if (!stickyRef.current || !stickyParentRef.current) return;

      const sticky = stickyRef.current;
      const stickyParent = stickyParentRef.current;
      const parentRect = stickyParent.getBoundingClientRect();

      const visibilityThreshold = window.innerHeight * 0.4;
      const shouldBeVisible =
        parentRect.top <= visibilityThreshold && parentRect.bottom >= 0;

      setIsVisible(shouldBeVisible);

      if (!shouldBeVisible) {
        cancelAnimationFrame();
        sticky.scrollLeft = 0;
        setScrollPosition(0);
        return;
      }

      const scrollWidth = sticky.scrollWidth - sticky.clientWidth;
      const parentHeight = parentRect.height;
      const stickyHeight = sticky.getBoundingClientRect().height;
      const verticalScrollHeight = Math.max(parentHeight - stickyHeight, 1);

      const scrollProgress = Math.max(
        0,
        Math.min(
          1,
          (-parentRect.top + visibilityThreshold) / verticalScrollHeight
        )
      );

      const easeInOutCubic = (t) => {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      };

      const targetScroll = easeInOutCubic(scrollProgress) * scrollWidth;

      const animateScroll = () => {
        const smoothFactor = 0.12;
        const nextPosition =
          scrollPosition + (targetScroll - scrollPosition) * smoothFactor;

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

      cancelAnimationFrame();
      requestIdRef.current = window.requestAnimationFrame(animateScroll);
    };

    window.addEventListener("scroll", handleScroll);

    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame();
    };
  }, [scrollPosition]);

  useEffect(() => {
    if (!stickyRef.current) return;

    const element = stickyRef.current;

    const originalOverflowX = element.style.overflowX;
    const originalWebkitOverflowScrolling =
      element.style.webkitOverflowScrolling;
    const originalScrollSnapType = element.style.scrollSnapType;
    const originalTouchAction = element.style.touchAction;

    element.style.overflowX = "hidden";
    element.style.webkitOverflowScrolling = "touch";
    element.style.scrollSnapType = "none";
    element.style.touchAction = "pan-y";

    const enforceScrollPosition = () => {
      element.scrollLeft = 0;
    };

    element.addEventListener("scroll", enforceScrollPosition);

    return () => {
      element.style.overflowX = originalOverflowX;
      element.style.webkitOverflowScrolling = originalWebkitOverflowScrolling;
      element.style.scrollSnapType = originalScrollSnapType;
      element.style.touchAction = originalTouchAction;

      element.removeEventListener("scroll", enforceScrollPosition);
    };
  }, []);

  useEffect(() => {
    if (!stickyParentRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting && stickyRef.current) {
            stickyRef.current.scrollLeft = 0;
            setScrollPosition(0);
          }
        });
      },
      { threshold: 0.1 }
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
