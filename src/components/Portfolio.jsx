// Portfolio.jsx
import React from 'react';
import { motion } from 'framer-motion';
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  return (
    <section id="portfolio" className="relative bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 py-24 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_80%,rgba(255,206,84,0.1),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(248,250,252,0.05),transparent_50%)]"></div>
      
      {/* Decorative Lines */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[--luxury-champagne]/30 to-transparent"></div>
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[--luxury-champagne]/30 to-transparent"></div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <motion.div 
          className="absolute top-20 right-10 w-96 h-96 bg-gradient-to-r from-[--luxury-champagne]/10 to-transparent rounded-full blur-3xl"
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
          className="absolute bottom-20 left-10 w-80 h-80 bg-gradient-to-r from-slate-300/20 to-transparent rounded-full blur-3xl"
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
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div variants={itemVariants}>
            <motion.h1 
              className="font-serif-luxury text-5xl lg:text-8xl text-[--luxury-champagne] mb-8"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Our Recent{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[--luxury-champagne] via-[--luxury-rose-gold] to-[--luxury-champagne]">
                Transformations
              </span>
            </motion.h1>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <p className="font-sans-luxury text-xl lg:text-2xl text-slate-300 mb-8 max-w-4xl mx-auto leading-relaxed">
              Witness the extraordinary transformations that showcase our commitment to excellence and attention to detail
            </p>
          </motion.div>

          <motion.div variants={itemVariants}>
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-600/30 max-w-3xl mx-auto">
              <p className="font-sans-luxury text-lg text-[--luxury-champagne] mb-2">
                ✨ Interactive Experience
              </p>
              <p className="font-sans-luxury text-slate-300">
                Click and drag the slider on each image to reveal the stunning before and after results
              </p>
            </div>
          </motion.div>
          
          <motion.div 
            className="w-40 h-1 bg-gradient-to-r from-transparent via-[--luxury-champagne] to-transparent mx-auto mt-8"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.8 }}
          />
        </motion.div>

        {/* Portfolio Grid */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative"
        >
          <div className="bg-gradient-to-r from-slate-800/50 via-slate-700/80 to-slate-800/50 backdrop-blur-sm rounded-3xl p-8 lg:p-12 border border-slate-600/30">
            <BeforeAfterSlider imagePairs={imagePairs} />
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
          <div className="bg-gradient-to-r from-slate-800/50 via-slate-700/80 to-slate-800/50 backdrop-blur-sm rounded-2xl p-12 border border-slate-600/30">
            <h3 className="font-serif-luxury text-3xl lg:text-4xl text-white mb-4">
              Inspired by These Results?
            </h3>
            <p className="font-sans-luxury text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
              Every project tells a story of transformation. Let us write the next chapter of excellence for your property.
            </p>
            <motion.a
              href="#quote"
              className="inline-flex min-h-[3.5rem] lg:min-h-[4rem] animate-shimmer items-center justify-center rounded-full border border-[--luxury-champagne]/30
              bg-[linear-gradient(110deg,#1e293b,45%,#334155,55%,#1e293b)] bg-[length:200%_100%] px-6 sm:px-10 lg:px-16 py-3 lg:py-4 font-serif-luxury font-semibold text-white text-base sm:text-lg lg:text-2xl tracking-wide whitespace-nowrap
              transition-all duration-500 ease-out transform hover:-translate-y-2 hover:scale-105
              focus:outline-none shadow-2xl hover:shadow-[--luxury-champagne]/20 hover:text-white backdrop-blur-sm group mx-auto"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              Start Your Transformation
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

export default Portfolio;