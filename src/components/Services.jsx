import React from 'react';
import { motion } from 'framer-motion';
import interiorImage from '../assets/services-interior.png';
import exteriorImage from '../assets/services-exterior.png';
import pressureWashingImage from '../assets/services-pressurewashing.png';
import cabinetsImage from '../assets/services-cabinets.png';
import ceilingsImage from '../assets/services-ceilings.png';
import parkingLotImage from '../assets/services-parkinglot.png';

const Services = () => {
    const services = [
        {
            title: 'Interior Painting',
            description: 'Transform your indoor spaces with precision and artistry. Our expert team uses premium paints and techniques.',
            image: interiorImage,
        },
        {
            title: 'Exterior Painting',
            description: 'Enhance your home\'s curb appeal with weather-resistant finishes that protect and beautify.',
            image: exteriorImage,
        },
        {
            title: 'Pressure Washing',
            description: 'Restore surfaces to their original brilliance with professional-grade cleaning equipment.',
            image: pressureWashingImage,
        },
        {
            title: 'Cabinet Refinishing',
            description: 'Breathe new life into your kitchen with expert cabinet restoration and custom finishes.',
            image: cabinetsImage,
        },
        {
            title: 'Ceiling Services',
            description: 'Modernize your space with popcorn removal and elegant knockdown texture applications.',
            image: ceilingsImage,
        },
        {
            title: 'Commercial Services',
            description: 'Professional painting solutions for parking lots, buildings, and commercial properties.',
            image: parkingLotImage,
        },
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

    const cardVariants = {
        hidden: { 
            opacity: 0, 
            y: 50,
            scale: 0.9
        },
        visible: { 
            opacity: 1, 
            y: 0,
            scale: 1,
            transition: {
                type: "spring",
                damping: 20,
                stiffness: 100
            }
        }
    };

    return (
        <section id="services" className="relative bg-gradient-to-br from-slate-50 via-white to-slate-100 py-24 overflow-hidden z-10">
            {/* Background Elements */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_80%,rgba(120,119,198,0.1),transparent_50%)]"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,206,84,0.1),transparent_50%)]"></div>
            
            <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
                {/* Header Section */}
                <motion.div 
                    className="text-center mb-20"
                    initial={{ opacity: 0, y: -50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <motion.h2
                        className="font-serif-luxury text-5xl lg:text-8xl text-slate-800 mb-6"
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-700 via-slate-600 to-slate-800">Premium</span> Services
                    </motion.h2>
                    <motion.div 
                        className="w-32 h-1 bg-gradient-to-r from-transparent via-slate-400 to-transparent mx-auto"
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.5 }}
                    ></motion.div>
                </motion.div>

                {/* Services Grid */}
                <motion.div 
                    className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                >
                    {services.map((service, index) => (
                        <motion.div
                            key={index}
                            variants={cardVariants}
                            whileHover={{ 
                                y: -15, 
                                scale: 1.02,
                                transition: { duration: 0.3, ease: "easeOut" }
                            }}
                            className="group relative"
                        >
                            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[--luxury-midnight] via-slate-800 to-[--luxury-midnight] shadow-xl shadow-slate-900/50 border border-slate-700/50 backdrop-blur-sm h-full flex flex-col">
                                {/* Image Container */}
                                <div className="relative h-64 overflow-hidden">
                                    <motion.img
                                        src={service.image}
                                        alt={service.title}
                                        loading="lazy"
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                </div>

                                {/* Content */}
                                <div className="p-8 flex-1 flex flex-col">
                                    <motion.h3
                                        className="font-serif-luxury text-2xl text-[--luxury-champagne] mb-4 group-hover:text-[--luxury-champagne]/80 transition-colors duration-300"
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.6, delay: index * 0.1 }}
                                    >
                                        {service.title}
                                    </motion.h3>
                                    <motion.p 
                                        className="font-sans-luxury text-gray-300 leading-relaxed text-lg group-hover:text-gray-200 transition-colors duration-300 flex-1"
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.6, delay: index * 0.1 + 0.2 }}
                                    >
                                        {service.description}
                                    </motion.p>
                                </div>

                                {/* Hover Effect Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                                
                                {/* Border Glow Effect */}
                                <div className="absolute inset-0 rounded-2xl border-2 border-transparent bg-gradient-to-r from-slate-300/50 via-transparent to-slate-300/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                            </div>

                            {/* Floating Shadow */}
                            <div className="absolute inset-0 -z-10 rounded-2xl bg-slate-900/5 blur-xl scale-95 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Call to Action */}
                <motion.div 
                    className="text-center mt-20"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                >
                    {/* Marketing Hook */}
                    <motion.div
                        className="mb-8"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                    >
                        <h3 className="text-3xl lg:text-4xl font-serif-luxury font-bold text-slate-800 mb-3">
                            Ready to Transform Your Space?
                        </h3>
                        <p className="text-xl font-sans-luxury text-slate-600 max-w-2xl mx-auto">
                            Join hundreds of satisfied customers who trust LED Custom Painting for exceptional results. 
                            <span className="font-semibold text-slate-700"> Free estimates • Licensed & Insured • 5-Star Service</span>
                        </p>
                    </motion.div>

                    <motion.a
                        href="#quote"
                        className="inline-flex h-16 lg:h-20 animate-shimmer items-center justify-center rounded-full border border-slate-700/30
                        bg-[linear-gradient(110deg,#1e293b,45%,#334155,55%,#1e293b)] bg-[length:200%_100%] px-12 lg:px-16 py-4 lg:py-6 font-serif-luxury font-semibold text-white text-xl lg:text-2xl tracking-wide
                        transition-all duration-500 ease-out transform hover:-translate-y-2 hover:scale-105
                        focus:outline-none shadow-2xl hover:shadow-slate-800/30 hover:text-white backdrop-blur-sm group"
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        Get Your Free Quote
                        <motion.svg 
                            className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </motion.svg>
                    </motion.a>
                </motion.div>
            </div>
        </section>
    );
};

export default Services;