// Portfolio.jsx
import React from 'react';
import BeforeAfterSlider from './BeforeAfterSlider';
import before1 from '../assets/before1.jpg';
import after1 from '../assets/after1.jpg';
import before2 from '../assets/before2.jpg';
import after2 from '../assets/after2.jpg';
import before3 from '../assets/before3.jpg';
import after3 from '../assets/after3.jpg';
import before4 from '../assets/before4.jpg';
import after4 from '../assets/after4.jpg';
import before5 from '../assets/before5.jpg';
import after5 from '../assets/after5.jpg';
import before6 from '../assets/before6.jpg';
import after6 from '../assets/after6.jpg';

const Portfolio = () => {

  const imagePairs = [
    { before: before1, after: after1 },
    { before: before2, after: after2 },
    { before: before3, after: after3 },
    { before: before4, after: after4 },
    { before: before5, after: after5 },
    { before: before6, after: after6 }
  ];

  return (
    <section id="portfolio" className="bg-slate-200 pt-8 py-12 pb-16">
      <div className="container mx-auto">
        <h1 className="text-5xl lg:text-7xl text-slate-700 text-center poppins-bold">
          Check Out Our Recent Work
        </h1>
        <p className="m-3 p-2 pb-6 text-slate-500 text-xl poppins-semibold">Click the button on the images below to view each project's tranformation!</p>
        <BeforeAfterSlider imagePairs={imagePairs} />
      </div>
    </section>
  );
};

export default Portfolio;