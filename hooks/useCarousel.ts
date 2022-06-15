import { CSSProperties, useEffect, useState } from "react";

const DEFAULT_TRANSITION_TIME = 400;
const DEFAULT_INTERVAL_TIME = 5000;
const TRANSITION_ELASTIC = `transform ${DEFAULT_TRANSITION_TIME}ms cubic-bezier(0.68, -0.55, 0.265, 1.55)`;
const TRANSITION_SMOOTH = `transform ${DEFAULT_TRANSITION_TIME}ms ease`;

export function useCarousel<T = object>(
  items: T[],
  interval: number = DEFAULT_INTERVAL_TIME
) {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const previous = () => {
    setCurrentIndex((currentIndex) => {
      if (currentIndex === 0) {
        return items.length - 1;
      }
      return currentIndex - 1;
    });
  };

  const next = () => {
    setCurrentIndex((currentIndex) => {
      if (currentIndex === items.length - 1) {
        return 0;
      }
      return currentIndex + 1;
    });
  };

  const jumpTo = (index: number) => {
    setCurrentIndex(index % items.length);
  };

  const wrapperStyle: CSSProperties = {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    overflowX: "hidden",
    width: "100%",
    height: "100%",
    position: "relative",
    transition: TRANSITION_ELASTIC,
    flex: items.length,
  };

  const itemStyle: CSSProperties = {
    position: "absolute",
    flex: 1,
  };

  

  useEffect(() => {
    const _interval = setInterval(() => {
      setCurrentIndex((currentIndex) => (currentIndex + 1) % items.length);
    }, interval);

    return () => clearInterval(_interval);
  }, [interval, items.length]);

  return {
    activeIndex: currentIndex,
    active: items[currentIndex],
    previous,
    next,
    jumpTo,

    wrapperStyle,
    itemStyle,
  };
}
