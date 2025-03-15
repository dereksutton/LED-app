import React from 'react';
import InfiniteCards from './InfiniteCards';

const Testimonials = () => {
  const testimonials = [
    {
      quote: 'Efrain and his team did an absolute amazing job. Total transformation of the house. They were efficient and worked hard to make sure it was completed in a timely manner, and paid close attention to detail to make sure everything looked great. We are so happy with the results and definitely recommend to anyone looking for a painting professional!',
      rating: '⭐⭐⭐⭐⭐',
      name: 'Breanna Coleman',
      title: 'Google Review',
    },
    {
      quote: 'The team was very professional, efficient, and the quality of their work was outstanding. They paid attention to every detail, and my house looks brand new. I highly recommend their services to anyone looking for reliable and skilled painters!',
      rating: '⭐⭐⭐⭐⭐',
      name: 'Erica Lindo',
      title: 'Google Review',
    },
    {
      quote: 'Very, very pleased with the work that was just done at my house! Very punctual and professional throughout the process - will use again!',
      rating: '⭐⭐⭐⭐⭐',
      name: 'Aaron Locke',
      title: 'Google Review',
    },
    {
      quote: 'I had a fantastic experience with LED! Excellent service and quality work. The team was professional and efficient. I highly recommend LED for any painting needs.',
      rating: '⭐⭐⭐⭐⭐',
      name: 'Trisha Garbett',
      title: 'Google Review',
    },
    {
      quote: `LED Custom Painting is the best! They are SO great! Everything from setting an appointment (which is SO easy!) to fantastic workers! And they were always very punctual and did a great job! Made my ugly house the most beautiful! I still get compliments and tell them who painted it. I can't say enough good things about them!!`,
      rating: '⭐⭐⭐⭐⭐',
      name: 'Wendi Forte',
      title: 'Google Review',
    },
    {
      quote: 'Efrain and his team did a phenomenal job in painting our house exterior. I am very impressed with all of the finished work as well as the amount of prep that was done on the stucco and the window sills. He is very easy to work with and I believe that I received great value with the pricing. I would definitely recommend Efrain and LED Custom Painting and plan to contact him again in the future for some interior work.',
      rating: '⭐⭐⭐⭐⭐',
      name: 'William Barnes',
      title: 'Google Review',
    },
    {
      quote: `Efrain and his team did an amazing job painting our house. They even went above and beyond and helped me replace a few things on the outside of the home, up high where I didn't have a ladder to get to. He is very trustworthy, walked the property with me prior to completing things, and wouldn't leave untill I was completely happy with their work. Highly recommend their services and overall just a great person. You won't be disappointed.`,
      rating: '⭐⭐⭐⭐⭐',
      name: 'Bryan Schultheis',
      title: 'Google Review',
    },
    {
      quote: `I'm so happy I chose LED Custom Painting. LED was fast, friendly, straight forward with their price, and did phenomenal work. I will definitely call them next time I need paint work, it was truly a pleasure working with them.`,
      rating: '⭐⭐⭐⭐⭐',
      name: 'Aaron Kaufman',
      title: 'Google Review',
    },
    {
      quote: 'Thank you LED Custom Painting for your professionalism and incredible work! The communication was top-notch customer service. We received proper expectations that were met in a timely manner, and in our opinion, exceeded! Awesome job!',
      rating: '⭐⭐⭐⭐⭐',
      name: 'Larry F.',
      title: 'Google Review',
    },
    {
      quote: 'LED Custom Painting did a great job with our home. Process was a pleasure from beginning to end. On time, trustworthy, great craftsmanship and most of all affordable. Highly recommend.',
      rating: '⭐⭐⭐⭐⭐',
      name: 'Michael Guarino',
      title: 'Google Review',
    },
    {
      quote: 'Let me start off by saying. It is very hard these days to believe and trust a company will do exactly what they say they can do. Efrain and his team are truly the exception. From beginning to end their works and ethic, impeccable... definitely will use and recommend this company again.',
      rating: '⭐⭐⭐⭐⭐',
      name: 'Edmundo Mozas',
      title: 'Google Review',
    },
    {
      quote: 'Professional company who is easy to work with, courteous and great with communication. Excellent work, thank you LED!',
      rating: '⭐⭐⭐⭐⭐',
      name: 'Mandy B.',
      title: 'Google Review',
    },
    {
      quote: 'The absolute best of the best! Extremely professional & top notch work. Highly recommend & will be referring everyone to this company.',
      rating: '⭐⭐⭐⭐⭐',
      name: 'Steph Murphy',
      title: 'Google Review',
    },
    {
      quote: 'I needed the garage painted and contacted LED company the service was great very professional and affordable. Thank you LED. I recommend it to anyone who needs work done to their place.',
      rating: '⭐⭐⭐⭐⭐',
      name: 'Franca Riccio',
      title: 'Google Review',
    },
    {
      quote: `One of the best experiences I've had. The attention to detail is second to none. It's all about the trim. Never painting anything on my own again!`,
      rating: '⭐⭐⭐⭐⭐',
      name: 'John Henry III',
      title: 'Google Review',
    },
    {
      quote: `I recently had the pleasure of working with LED Custom Painting, and I can't express enough how impressed I am with their work! From the initial consultation to the final reveal, their professionalism stood out at every step of the process. The team was not only knowledgeable but also incredibly attentive to my vision. They took the time to understand exactly what I wanted and offered valuable suggestions that enhanced the final outcome. The quality of their painting is simply amazing -- every detail is crisp, and the colors are vibrant and true to what we discussed.`,
      rating: '⭐⭐⭐⭐⭐',
      name: 'Morgan DeLeon',
      title: 'Google Review',
    },
  ];

  return (
    <section id="testimonials" className="bg-white p-4 overflow-hidden">
      <div className="container mx-auto">
        <h2 className="poppins-bold text-slate-700 text-5xl lg:text-7xl mb-10 text-center px-4">
          What Our Clients Say
        </h2>
        <div className="mt-8">
          <InfiniteCards
            items={testimonials}
            speed="slow"
            direction="right"
            contentType="text"
          />
        </div>
      </div>
    </section>
  );
};

export default Testimonials;