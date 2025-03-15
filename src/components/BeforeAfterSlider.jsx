import React, { useState } from 'react';

const BeforeAfterCard = ({ beforeImg, afterImg }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="relative w-full aspect-[3/2] perspective-1000">
      <div 
        className={`relative w-full h-full transform-style-3d transition-all duration-700 ease-in-out ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
      >
        {/* Before Image (Front) */}
        <div className="absolute inset-0 w-full h-full backface-hidden">
          <div className="relative w-full h-full rounded-xl overflow-hidden shadow-2xl bg-gray-100">
            <div className="absolute inset-0 flex items-center justify-center">
              <img
                src={beforeImg}
                alt="Before"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* After Image (Back) */}
        <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
          <div className="relative w-full h-full rounded-xl overflow-hidden shadow-2xl bg-gray-100">
            <div className="absolute inset-0 flex items-center justify-center">
              <img
                src={afterImg}
                alt="After"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Button Container */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10 transform-style-3d">
          <button
            onClick={() => setIsFlipped(!isFlipped)}
            className="inline-flex h-12 lg:h-14 animate-shimmer items-center justify-center rounded-md border border-yellow-400
                        bg-[linear-gradient(110deg,#FFD700,45%,#FFA500,55%,#FFD700)] bg-[length:200%_100%] poppins-bold text-slate-700 text-xl
                        transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105
                        shadow-lg hover:shadow-2xl hover:no-underline hover:text-slate-700 active:scale-95 hover:-translate-y-0.5
                        backdrop-blur-sm bg-opacity-90"
            >
            <span className={`inline-block transition-transform duration-700 ${isFlipped ? 'rotate-y-180' : ''}`}>
              {!isFlipped ? 'Show After' : 'Show Before'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

const BeforeAfterSlider = ({ imagePairs }) => {
  if (!imagePairs || imagePairs.length === 0) {
    return <div className="text-red-600">No images available</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
      {imagePairs.map((pair, index) => (
        <BeforeAfterCard
          key={index}
          beforeImg={pair.before}
          afterImg={pair.after}
        />
      ))}
    </div>
  );
};

export default BeforeAfterSlider;