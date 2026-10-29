"use client";

import { useState } from 'react';

// Drag (or arrow-key) comparison: the after photo is revealed over the before
// photo up to the handle. The range input carries the keyboard and screen
// reader behaviour; it sits invisibly on top of the whole image.
const BeforeAfterCard = ({ beforeImg, afterImg, label }) => {
  const [position, setPosition] = useState(50);

  return (
    <figure className="m-0">
      <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden shadow-2xl bg-slate-200 select-none">
        <img
          src={beforeImg}
          alt={`${label}, before`}
          width="1200"
          height="900"
          loading="lazy"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover"
          draggable="false"
        />
        <img
          src={afterImg}
          alt={`${label}, after`}
          width="1200"
          height="900"
          loading="lazy"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ clipPath: `inset(0 0 0 ${position}%)` }}
          draggable="false"
        />

        <span className="pointer-events-none absolute top-3 left-3 rounded-full bg-slate-900/70 px-3 py-1 text-xs font-sans-luxury font-semibold uppercase tracking-wider text-white">
          Before
        </span>
        <span className="pointer-events-none absolute top-3 right-3 rounded-full bg-[#F5E6D3] px-3 py-1 text-xs font-sans-luxury font-semibold uppercase tracking-wider text-slate-900">
          After
        </span>

        <div
          className="pointer-events-none absolute inset-y-0 w-0.5 bg-white shadow-[0_0_8px_rgba(0,0,0,0.5)]"
          style={{ left: `${position}%` }}
          aria-hidden="true"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-white text-slate-800 shadow-lg">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7l-5 5 5 5M16 7l5 5-5 5" />
            </svg>
          </div>
        </div>

        <input
          type="range"
          min="0"
          max="100"
          value={position}
          onChange={(e) => setPosition(Number(e.target.value))}
          aria-label={`${label}: drag to compare before and after`}
          className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0 touch-pan-y"
        />
      </div>
    </figure>
  );
};

const BeforeAfterSlider = ({ imagePairs }) => {
  if (!imagePairs || imagePairs.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
      {imagePairs.map((pair, index) => (
        <BeforeAfterCard
          key={pair.before}
          beforeImg={pair.before}
          afterImg={pair.after}
          label={pair.label || `Project ${index + 1}`}
        />
      ))}
    </div>
  );
};

export default BeforeAfterSlider;
