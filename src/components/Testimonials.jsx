import React from 'react';
import { motion } from 'framer-motion';
import InfiniteCards from './InfiniteCards';

const Testimonials = () => {
  const testimonials = [
    {
      quote: 'Efrain and his team did an absolute amazing job. Total transformation of the house. They were efficient and worked hard to make sure it was completed in a timely manner, and paid close attention to detail to make sure everything looked great. We are so happy with the results and definitely recommend to anyone looking for a painting professional!',
      rating: 5,
      name: 'Breanna Coleman',
      title: 'Google Review',
    },
    {
      quote: 'The team was very professional, efficient, and the quality of their work was outstanding. They paid attention to every detail, and my house looks brand new. I highly recommend their services to anyone looking for reliable and skilled painters!',
      rating: 5,
      name: 'Erica Lindo',
      title: 'Google Review',
    },
    {
      quote: 'Very, very pleased with the work that was just done at my house! Very punctual and professional throughout the process - will use again!',
      rating: 5,
      name: 'Aaron Locke',
      title: 'Google Review',
    },
    {
      quote: 'I had a fantastic experience with LED! Excellent service and quality work. The team was professional and efficient. I highly recommend LED for any painting needs.',
      rating: 5,
      name: 'Trisha Garbett',
      title: 'Google Review',
    },
    {
      quote: `LED Custom Painting is the best! They are SO great! Everything from setting an appointment (which is SO easy!) to fantastic workers! And they were always very punctual and did a great job! Made my ugly house the most beautiful! I still get compliments and tell them who painted it. I can't say enough good things about them!!`,
      rating: 5,
      name: 'Wendi Forte',
      title: 'Google Review',
    },
    {
      quote: 'Efrain and his team did a phenomenal job in painting our house exterior. I am very impressed with all of the finished work as well as the amount of prep that was done on the stucco and the window sills. He is very easy to work with and I believe that I received great value with the pricing. I would definitely recommend Efrain and LED Custom Painting and plan to contact him again in the future for some interior work.',
      rating: 5,
      name: 'William Barnes',
      title: 'Google Review',
    },
    {
      quote: `Efrain and his team did an amazing job painting our house. They even went above and beyond and helped me replace a few things on the outside of the home, up high where I didn't have a ladder to get to. He is very trustworthy, walked the property with me prior to completing things, and wouldn't leave untill I was completely happy with their work. Highly recommend their services and overall just a great person. You won't be disappointed.`,
      rating: 5,
      name: 'Bryan Schultheis',
      title: 'Google Review',
    },
    {
      quote: `I'm so happy I chose LED Custom Painting. LED was fast, friendly, straight forward with their price, and did phenomenal work. I will definitely call them next time I need paint work, it was truly a pleasure working with them.`,
      rating: 5,
      name: 'Aaron Kaufman',
      title: 'Google Review',
    },
    {
      quote: 'Thank you LED Custom Painting for your professionalism and incredible work! The communication was top-notch customer service. We received proper expectations that were met in a timely manner, and in our opinion, exceeded! Awesome job!',
      rating: 5,
      name: 'Larry F.',
      title: 'Google Review',
    },
    {
      quote: 'LED Custom Painting did a great job with our home. Process was a pleasure from beginning to end. On time, trustworthy, great craftsmanship and most of all affordable. Highly recommend.',
      rating: 5,
      name: 'Michael Guarino',
      title: 'Google Review',
    },
    {
      quote: 'Let me start off by saying. It is very hard these days to believe and trust a company will do exactly what they say they can do. Efrain and his team are truly the exception. From beginning to end their works and ethic, impeccable... definitely will use and recommend this company again.',
      rating: 5,
      name: 'Edmundo Mozas',
      title: 'Google Review',
    },
    {
      quote: 'Professional company who is easy to work with, courteous and great with communication. Excellent work, thank you LED!',
      rating: 5,
      name: 'Mandy B.',
      title: 'Google Review',
    },
    {
      quote: 'The absolute best of the best! Extremely professional & top notch work. Highly recommend & will be referring everyone to this company.',
      rating: 5,
      name: 'Steph Murphy',
      title: 'Google Review',
    },
    {
      quote: 'I needed the garage painted and contacted LED company the service was great very professional and affordable. Thank you LED. I recommend it to anyone who needs work done to their place.',
      rating: 5,
      name: 'Franca Riccio',
      title: 'Google Review',
    },
    {
      quote: `One of the best experiences I've had. The attention to detail is second to none. It's all about the trim. Never painting anything on my own again!`,
      rating: 5,
      name: 'John Henry III',
      title: 'Google Review',
    },
    {
      quote: `I recently had the pleasure of working with LED Custom Painting, and I can't express enough how impressed I am with their work! From the initial consultation to the final reveal, their professionalism stood out at every step of the process. The team was not only knowledgeable but also incredibly attentive to my vision. They took the time to understand exactly what I wanted and offered valuable suggestions that enhanced the final outcome. The quality of their painting is simply amazing -- every detail is crisp, and the colors are vibrant and true to what we discussed.`,
      rating: 5,
      name: 'Morgan DeLeon',
      title: 'Google Review',
    },
  ];

  const StarRating = ({ rating }) => {
    return (
      <div className="flex items-center space-x-1">
        {[...Array(5)].map((_, i) => (
          <motion.svg
            key={i}
            className={`w-5 h-5 ${i < rating ? 'text-[#F5E6D3]' : 'text-slate-600'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1, duration: 0.3 }}
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </motion.svg>
        ))}
      </div>
    );
  };

  const trustStats = [
    { number: "500+", label: "Happy Clients" },
    { number: "5-Star", label: "Average Rating" },
    { number: "13+", label: "Years Experience" },
    { number: "100%", label: "Satisfaction Rate" }
  ];

  return (
    <section id="testimonials" className="relative bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 py-24 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(245,230,211,0.1),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(232,180,160,0.08),transparent_50%)]"></div>
      
      {/* Decorative Lines */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#F5E6D3]/30 to-transparent"></div>
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#F5E6D3]/30 to-transparent"></div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <motion.div 
          className="absolute top-20 right-10 w-96 h-96 bg-gradient-to-r from-[#F5E6D3]/10 to-transparent rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-20 left-10 w-80 h-80 bg-gradient-to-r from-[#E8B4A0]/10 to-transparent rounded-full blur-3xl"
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ 
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header Section */}
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: -80 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <motion.div
            className="inline-block"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="font-serif-luxury text-5xl lg:text-8xl text-[#F5E6D3] mb-8">
              What Our{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F5E6D3] via-[#E8B4A0] to-[#F5E6D3]">
                Clients Say
              </span>
            </h2>
          </motion.div>
          
          <motion.p 
            className="font-sans-luxury text-2xl text-slate-300 max-w-4xl mx-auto leading-relaxed mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Don't just take our word for it. Hear directly from our satisfied customers about their exceptional experience with LED Custom Painting.
          </motion.p>

          {/* Trust Stats */}
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            {trustStats.map((stat, index) => (
              <motion.div
                key={index}
                className="text-center bg-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/30"
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <div className="font-serif-luxury text-3xl lg:text-4xl font-bold text-[#F5E6D3] mb-2">
                  {stat.number}
                </div>
                <div className="font-sans-luxury text-sm text-[#E8B4A0]">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
          
          <motion.div 
            className="w-40 h-1 bg-gradient-to-r from-transparent via-[#F5E6D3] to-transparent mx-auto"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.8 }}
          />
        </motion.div>

        {/* Testimonials Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative"
        >
          <div className="bg-gradient-to-r from-slate-900/30 via-slate-800/50 to-slate-900/30 backdrop-blur-sm rounded-3xl p-8 border border-slate-700/30">
            <InfiniteCards
              items={testimonials.map(testimonial => ({
                ...testimonial,
                StarComponent: StarRating
              }))}
              speed="slow"
              direction="right"
              contentType="testimonial"
            />
          </div>
        </motion.div>

        {/* Bottom CTA Section */}
        <motion.div 
          className="text-center mt-20"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <div className="bg-gradient-to-r from-[#F5E6D3] via-[#E8B4A0] to-[#F5E6D3] backdrop-blur-sm rounded-2xl p-12 border border-slate-700/50">
            <h3 className="font-serif-luxury text-3xl lg:text-4xl text-[#2C3E50] mb-4">
              Join Our Satisfied Customers
            </h3>
            <p className="font-sans-luxury text-xl text-slate-700 mb-8 max-w-3xl mx-auto">
              Experience the same exceptional service and quality that has earned us hundreds of 5-star reviews.
            </p>
            <motion.a
              href="#quote"
              className="inline-flex min-h-[3.5rem] lg:min-h-[4rem] animate-shimmer items-center justify-center rounded-full border border-[#F5E6D3]/30
              bg-[linear-gradient(110deg,#1e293b,45%,#334155,55%,#1e293b)] bg-[length:200%_100%] px-6 sm:px-10 lg:px-16 py-3 lg:py-4 font-serif-luxury font-semibold text-white text-base sm:text-lg lg:text-2xl tracking-wide whitespace-nowrap
              transition-all duration-500 ease-out transform hover:-translate-y-2 hover:scale-105
              focus:outline-none shadow-2xl hover:shadow-[#F5E6D3]/20 hover:text-white backdrop-blur-sm group"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              Get Your Free Quote Today
              <motion.svg 
                className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </motion.svg>
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;