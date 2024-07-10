import React from 'react';
import ledWhyUs from '../assets/LED-WhyUs.png';

const WhyUs = () => {
  return (
    <section id="whyus" className="bg-white">
      <div className="w-screen mx-auto">
        <div className="flex flex-col lg:flex-row items-center justify-center">
          <div className="lg:w-1/2 w-full lg:pr-24 mb-8 lg:mb-0 flex flex-col items-center justify-center">
            <h1 className="poppins-bold text-slate-700 text-4xl lg:text-5xl text-center mt-4 mb-6">
              Why Work With Us?
            </h1>
            <ul className="w-3/5 text-slate-400 text-lg leading-relaxed text-start custom-list">
              <li className="pb-4"><span className="poppins-bold text-slate-500">The Best House Guest:</span> We treat your home with utmost respect, ensuring a pleasant and stress-free painting process.</li>
              <li className="pb-4"><span className="poppins-bold text-slate-500">Attention to Detail:</span> Our meticulous approach guarantees flawless results that exceed expectations.</li>
              <li className="pb-4"><span className="poppins-bold text-slate-500">Clear Communication:</span> We prioritize understanding your vision and addressing any concerns throughout the project.</li>
              <li className="pb-4"><span className="poppins-bold text-slate-500">Extra Mile Service:</span> From careful masking to thorough clean-up, we go above and beyond to protect your property.</li>
              <li className="pb-4"><span className="poppins-bold text-slate-500">Joy Through Color:</span> We don't just paint walls; we bring life and happiness to your living spaces.</li>
              <li className="pb-4"><span className="poppins-bold text-slate-500">Local Expertise:</span> As the top house and commercial painters in the area, we understand your community's unique needs.</li>
              <li><span className="poppins-bold text-slate-500">Customer Satisfaction:</span> Our ultimate goal is your complete delight with both our work and service.</li>
            </ul>
          </div>
          <div className="lg:w-1/2 w-screen">
            <img
              src={ledWhyUs}
              alt="Why Work With Us"
              className="w-full h-auto lg:h-full lg:object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyUs;
