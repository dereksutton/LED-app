import React from 'react';
import InfiniteCards from './InfiniteCards';

const Testimonials = () => {
  const testimonials = [
    {
      quote: 'Outstanding service and quality work! Highly recommended.',
      name: 'John Doe',
      title: 'New York, NY',
    },
    {
      quote: 'The team was professional and the results were fantastic.',
      name: 'Jane Smith',
      title: 'Los Angeles, CA',
    },
    {
      quote: 'Great experience from start to finish. Will hire again!',
      name: 'Peter Johnson',
      title: 'Chicago, IL',
    },
    {
      quote: 'Exceptional quality and customer service. Very happy!',
      name: 'Alice Brown',
      title: 'Houston, TX',
    },
    {
      quote: 'Top-notch work and friendly team. Strongly recommend!',
      name: 'Michael Davis',
      title: 'Phoenix, AZ',
    },
    // Add more testimonials as needed
  ];

  return (
    <section id="testimonials" className="bg-white py-16 text-center">
      <div className="container mx-auto px-4 flex-col">
        <h2 className="poppins-bold text-slate-700 text-4xl lg:text-5xl mb-8">What Our Clients Say</h2>
        <InfiniteCards items={testimonials} speed="normal" direction="right" contentType="text" className="flex-col" />
      </div>
    </section>
  );
};

export default Testimonials;
