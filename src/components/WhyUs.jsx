import React from 'react';
import ledWhyUs from '../assets/LED-WhyUs.png';

const WhyUs = () => {
  const reasons = [
    { title: "The Best House Guest", description: "We treat your home with utmost respect, ensuring a pleasant and stress-free painting process.", icon: "🏠" },
    { title: "Attention to Detail", description: "Our meticulous approach guarantees flawless results that exceed expectations.", icon: "🔍" },
    { title: "Clear Communication", description: "We prioritize understanding your vision and addressing any concerns throughout the project.", icon: "💬" },
    { title: "Extra Mile Service", description: "From careful masking to thorough clean-up, we go above and beyond to protect your property.", icon: "🏃" },
    { title: "Local Expertise", description: "As the top house and commercial painters in the area, we understand your community's unique needs.", icon: "🏘️" },
    { title: "Customer Satisfaction", description: "Our ultimate goal is your complete delight with both our work and service.", icon: "😊" }
  ];

  return (
    <section id="whyus" className="bg-white">
      <div className="flex flex-col lg:flex-row">
        <div className="w-full lg:w-1/2 p-4 pb-6 flex flex-col items-center justify-center">
          <h2 className="poppins-bold text-5xl lg:text-7xl text-slate-700 mb-6 text-center">Why Work With Us?</h2>
          <div className="flex flex-wrap justify-center gap-6 max-w-2xl mb-6">
            {reasons.map((reason, index) => (
              <div key={index} className="bg-slate-400 rounded-lg shadow-lg p-4 w-80 sm:w-80 text-center">
                <div className="text-5xl mb-4">{reason.icon}</div>
                <h3 className="text-2xl text-slate-700 poppins-semibold mb-2">{reason.title}</h3>
                <p className="text-xl poppins-regular text-white">{reason.description}</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Simple image display for all devices */}
        <div className="w-full lg:w-1/2 relative min-h-[400px] md:min-h-[600px] lg:min-h-[600px] overflow-hidden">
          <img
            src={ledWhyUs}
            alt="Why Work With Us"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
      </div>
    </section>
  );
};

export default WhyUs;