import React from 'react';

const ImageModal = ({ imageSrc, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-white text-2xl"
        >
          &times;
        </button>
        <img src={imageSrc} alt="Zoomed" className="max-w-full max-h-full" />
      </div>
    </div>
  );
};

export default ImageModal;

