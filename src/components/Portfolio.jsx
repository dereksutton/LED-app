import React, { useState } from 'react';
import InfiniteCards from './InfiniteCards'; // Ensure the path is correct
import ImageModal from './ImageModal';

// Import images from the src/assets folder
import image1 from '../assets/LED-WorkImg-1.jpg';
import image2 from '../assets/LED-WorkImg-2.jpg';
import image3 from '../assets/LED-WorkImg-3.jpg';
import image4 from '../assets/LED-WorkImg-4.jpg';
import image5 from '../assets/LED-WorkImg-5.jpg';
import image6 from '../assets/LED-WorkImg-6.jpg';
import image7 from '../assets/LED-WorkImg-7.jpg';
import image8 from '../assets/LED-WorkImg-8.jpg';
import image9 from '../assets/LED-WorkImg-9.jpg';
import image10 from '../assets/LED-WorkImg-10.jpg';
import image11 from '../assets/LED-WorkImg-11.jpg';
import image12 from '../assets/LED-WorkImg-12.jpg';
import image13 from '../assets/LED-WorkImg-13.jpg';
import image14 from '../assets/LED-WorkImg-14.jpg';
import image15 from '../assets/LED-WorkImg-15.jpg';
import image16 from '../assets/LED-WorkImg-16.jpg';
import image17 from '../assets/LED-WorkImg-17.jpg';
import image18 from '../assets/LED-WorkImg-18.jpg';
import image19 from '../assets/LED-WorkImg-19.jpg';
import image20 from '../assets/LED-WorkImg-20.jpg';
import image21 from '../assets/LED-WorkImg-21.jpg';

const portfolioImages = [
  { imageUrl: image1 },
  { imageUrl: image2 },
  { imageUrl: image3 },
  { imageUrl: image4 },
  { imageUrl: image5 },
  { imageUrl: image6 },
  { imageUrl: image7 },
  { imageUrl: image8 },
  { imageUrl: image9 },
  { imageUrl: image10 },
  { imageUrl: image11 },
  { imageUrl: image12 },
  { imageUrl: image13 },
  { imageUrl: image14 },
  { imageUrl: image15 },
  { imageUrl: image16 },
  { imageUrl: image17 },
  { imageUrl: image18 },
  { imageUrl: image19 },
  { imageUrl: image20 },
  { imageUrl: image21 },
  // Add more images as needed
];

const Portfolio = () => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
  
    const handleImageClick = (imageUrl) => {
      setSelectedImage(imageUrl);
      setIsModalOpen(true);
    };
  
    const handleCloseModal = () => {
      setIsModalOpen(false);
      setSelectedImage(null);
    };
  
    return (
      <section id="portfolio" className="bg-slate-200 py-16 text-center">
        <div className="container mx-auto px-2">
          <h1 className="poppins-bold text-slate-700 text-4xl lg:text-5xl mb-8">Our Recent Work</h1>
          <InfiniteCards items={portfolioImages} direction="right" speed="slow" onImageClick={handleImageClick} />
        </div>
        <ImageModal imageSrc={selectedImage} isOpen={isModalOpen} onClose={handleCloseModal} />
      </section>
    );
  };
  
  export default Portfolio;


