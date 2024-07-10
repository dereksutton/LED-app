import React from 'react';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';

const ImageModal = ({ imageSrc, isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
      onClick={handleOverlayClick}
    >
      <div className="relative max-w-full max-h-full">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-white text-2xl bg-black rounded-full p-2"
        >
          &times;
        </button>
        <Zoom>
          <img src={imageSrc} alt="Zoomed" className="w-full h-full object-contain" />
        </Zoom>
      </div>
    </div>
  );
};

export default ImageModal;
