import { useCallback } from "react";

export const useSmoothScroll = () => {
  const scrollToElement = useCallback((elementId: string, offset = 0) => {
    const element = document.getElementById(elementId);
    if (element) {
      const y = element.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({
        top: y,
        behavior: "smooth",
      });
    }
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  const scrollToPosition = useCallback((y: number) => {
    window.scrollTo({
      top: y,
      behavior: "smooth",
    });
  }, []);

  return {
    scrollToElement,
    scrollToTop,
    scrollToPosition,
  };
};

export default useSmoothScroll;
