import React, { useEffect, useState } from "react";
import { cn } from "../utils/cn";

const InfiniteCards = ({
  items,
  direction = "left",
  speed = "normal",
  pauseOnHover = true,
  className,
  onImageClick,
  contentType = "image" // Add a new prop to differentiate between image and text content
}) => {
  const containerRef = React.useRef(null);
  const scrollerRef = React.useRef(null);

  useEffect(() => {
    addAnimation();
  }, []);

  const [start, setStart] = useState(false);

  const addAnimation = () => {
    if (containerRef.current && scrollerRef.current) {
      const scrollerContent = Array.from(scrollerRef.current.children);

      scrollerContent.forEach((item) => {
        const duplicatedItem = item.cloneNode(true);
        if (scrollerRef.current) {
          scrollerRef.current.appendChild(duplicatedItem);
        }
      });

      setDirection();
      setSpeed();
      setStart(true);
    }
  };

  const setDirection = () => {
    if (containerRef.current) {
      if (direction === "left") {
        containerRef.current.style.setProperty("--animation-direction", "forwards");
      } else {
        containerRef.current.style.setProperty("--animation-direction", "reverse");
      }
    }
  };

  const setSpeed = () => {
    if (containerRef.current) {
      let duration;
      switch (speed) {
        case "fast":
          duration = "20s";
          break;
        case "slow":
          duration = "100s";
          break;
        default:
          duration = "40s";
      }
      containerRef.current.style.setProperty("--animation-duration", duration);
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "scroller relative z-20 max-w-7xl mx-auto overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_40%,white_60%,transparent)]",
        className
      )}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          "flex min-w-full shrink-0 gap-4 py-4 w-max flex-nowrap items-center",
          start && "animate-scroll",
          pauseOnHover && "hover:[animation-play-state:paused]"
        )}
      >
        {items.map((item, idx) => (
          <li
            key={idx}
            onClick={() => {
              if (contentType === "image") {
                console.log('Image clicked'); // Debug log
                if (onImageClick) {
                  onImageClick(item.imageUrl);
                }
              }
            }}
            className="w-[300px] h-[200px] relative rounded-2xl border border-b-0 flex-shrink-0 border-slate-700 overflow-hidden cursor-pointer"
            style={{
              background: "linear-gradient(180deg, var(--slate-800), var(--slate-900))",
            }}
          >
            {contentType === "image" ? (
              <img src={item.imageUrl} alt={`Portfolio ${idx + 1}`} className="w-full h-full object-cover rounded-2xl" />
            ) : (
              <blockquote className="p-4 text-white">
                <p className="text-lg italic mb-4">&ldquo;{item.quote}&rdquo;</p>
                <div className="flex justify-end">
                  <span className="font-bold">{item.name}</span>
                  <span className="ml-2 text-sm text-gray-400">{item.title}</span>
                </div>
              </blockquote>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default InfiniteCards;
