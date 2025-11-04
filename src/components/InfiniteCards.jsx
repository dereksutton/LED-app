import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
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

  // Triple the items for seamless loop
  const scrollItems = [...items, ...items, ...items];

  const getDuration = () => {
    switch (speed) {
      case "fast":
        return "25s";
      case "slow":
        return "60s";
      default:
        return "45s";
    }
  };

  const StarRating = ({ rating }) => {
    return (
      <div className="flex items-center space-x-1">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-4 h-4 ${i < rating ? 'text-[#F5E6D3]' : 'text-slate-600'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
        ))}
      </div>
    );
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
          animationDirection: direction === "left" ? "normal" : "reverse",
          animationDuration: getDuration(),
        }}
      >
        {scrollItems.map((item, idx) => (
          <motion.div
            key={idx}
            className={cn(
              "w-[380px] flex-shrink-0 rounded-2xl border border-slate-600/50",
              "bg-gradient-to-br from-slate-900/90 via-slate-800/95 to-slate-900/90 backdrop-blur-sm shadow-xl shadow-slate-900/50"
            )}
            whileHover={{ 
              scale: 1.02,
              y: -5,
              transition: { duration: 0.3 }
            }}
          >
            <blockquote className="p-8 h-full flex flex-col">
              {/* Quote Icon */}
              <div className="mb-4">
                <svg className="w-8 h-8 text-[#F5E6D3]/60" fill="currentColor" viewBox="0 0 32 32">
                  <path d="M12 8c-4.418 0-8 3.582-8 8 0 4.418 3.582 8 8 8h4v-8c0-4.418-3.582-8-8-8zM28 8c-4.418 0-8 3.582-8 8 0 4.418 3.582 8 8 8h4v-8c0-4.418-3.582-8-8-8z"/>
                </svg>
              </div>

              <p className="font-sans-luxury text-base text-slate-200 mb-6 leading-relaxed italic flex-1">
                "{item.quote}"
              </p>
              
              <footer className="mt-auto border-t border-slate-700/50 pt-6">
                <div className="flex flex-col space-y-3">
                  {/* Star Rating */}
                  <div className="flex justify-center">
                    <StarRating rating={item.rating || 5} />
                  </div>
                  
                  {/* Customer Info */}
                  <div className="text-center">
                    <cite className="font-serif-luxury font-semibold text-[#F5E6D3] not-italic text-lg">
                      {item.name}
                    </cite>
                    <div className="flex items-center justify-center space-x-2 mt-2">
                      <svg className="w-4 h-4 text-[#E8B4A0]" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      <span className="font-sans-luxury text-sm text-[#E8B4A0]">
                        {item.title}
                      </span>
                    </div>
                  </div>
                </div>
              </footer>
            </blockquote>
            
            {/* Hover border glow */}
            <div className="absolute inset-0 rounded-2xl border-2 border-transparent bg-gradient-to-r from-[#F5E6D3]/20 via-transparent to-[#F5E6D3]/20 opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default InfiniteCards;