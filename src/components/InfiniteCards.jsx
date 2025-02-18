import React, { useState, useEffect } from "react";
import { cn } from "../utils/cn";

const InfiniteCards = ({
  items,
  direction = "left",
  speed = "normal",
  pauseOnHover = true,
  className,
  contentType = "text"
}) => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
  }, []);

  // Double the items for seamless loop
  const scrollItems = [...items, ...items, ...items]; // Triple the items for longer scroll

  const getDuration = () => {
    switch (speed) {
      case "fast":
        return "20s";
      case "slow":
        return "60s";
      default:
        return "40s";
    }
  };

  return (
    <div className={cn(
      "relative z-20 w-full overflow-hidden",
      className
    )}>
      <div
        className={cn(
          "flex gap-6 w-max",
          isReady && "animate-scroll-infinite",
          pauseOnHover && "hover:[animation-play-state:paused]"
        )}
        style={{
          animationDirection: direction === "left" ? "slow" : "reverse",
          animationDuration: getDuration(),
        }}
      >
        {scrollItems.map((item, idx) => (
          <div
            key={idx}
            className={cn(
              "w-[350px] flex-shrink-0 rounded-2xl border border-slate-700",
              "bg-gradient-to-b from-slate-800 to-slate-900 shadow-xl"
            )}
          >
            <blockquote className="p-6 h-full flex flex-col">
              <p className="text-lg text-left italic text-white mb-4">
                "{item.quote}"
              </p>
              <footer className="mt-auto">
                <div className="flex flex-col items-end">
                  <span>
                    {item.rating}
                  </span>
                  <cite className="font-semibold text-white not-italic">
                    {item.name}
                  </cite>
                  <span className="text-sm text-slate-400">
                    {item.title}
                  </span>
                </div>
              </footer>
            </blockquote>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InfiniteCards;