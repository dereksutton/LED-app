import React from 'react';
import InfiniteCards from './InfiniteCards';

const Testimonials = () => {
  const testimonials = [
    {
      quote: 'Outstanding service and quality work! Highly recommended.',
      rating: '⭐⭐⭐⭐⭐',
      name: 'John Doe',
      title: 'Google Review',
    },
    {
      quote: 'The team was professional and the results were fantastic.',
      rating: '⭐⭐⭐⭐⭐',
      name: 'Jane Smith',
      title: 'Google Review',
    },
    {
      quote: 'Great experience from start to finish. Will hire again!',
      rating: '⭐⭐⭐⭐⭐',
      name: 'Peter Johnson',
      title: 'Google Review',
    },
    {
      quote: 'Exceptional quality and customer service. Very happy!',
      rating: '⭐⭐⭐⭐⭐',
      name: 'Alice Brown',
      title: 'Google Review',
    },
    {
      quote: 'Top-notch work and friendly team. Strongly recommend!',
      rating: '⭐⭐⭐⭐⭐',
      name: 'Michael Davis',
      title: 'Google Review',
    },
  ];

  return (
    <section id="testimonials" className="bg-white py-16 overflow-hidden">
      <div className="container mx-auto">
        <h2 className="poppins-bold text-slate-700 text-4xl lg:text-5xl mb-12 text-center px-4">
          What Our Clients Say
        </h2>
        <div className="mt-8">
          <InfiniteCards
            items={testimonials}
            speed="normal"
            direction="right"
            contentType="text"
          />
        </div>
      </div>
    </section>
  );
};

export default Testimonials;