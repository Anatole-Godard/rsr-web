import { classes } from "@utils/classes";
import { CSSProperties, useEffect, useState } from "react";

const DEFAULT_INTERVAL_TIME = 5000;

export function useCarousel<T = any>(
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
    flex: items.length,
  };

  const itemStyle: CSSProperties = {
    position: "absolute",
    flex: 1,
  };

  const IndicatorsComponent = () => {
    return (
      <div className="absolute top-0 inline-flex gap-2 w-full p-2 z-[8]">
        {items.map((_: any, index: number) => (
          <span
            key={index}
            onClick={() => jumpTo(index)}
            style={{ width: `${100 / items.length}%` }}
            className="pb-16 cursor-pointer"
          >
            <div
              key={index}
              className="w-full h-1 bg-gray-400 bg-opacity-50 rounded"
            >
              <div
                className={classes(
                  "h-1 rounded cursor-pointer",
                  currentIndex === index ? "bg-white animate-stories" : ""
                )}
              />
            </div>
          </span>
        ))}
      </div>
    );
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

    IndicatorsComponent,
  };
}
