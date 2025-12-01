import React from 'react';
import { motion } from 'framer-motion';
import paintedHomeImage from '../assets/paintedhome2.jpg';

const About = () => {
    const stats = [
        { number: '13+', label: 'Years of Excellence' },
        { number: '500+', label: 'Projects Completed' },
        { number: '100%', label: 'Customer Satisfaction' },
        { number: '5-Star', label: 'Google Rating' }
    ];

    const values = [
        {
            title: 'Quality First',
            description: 'We use only premium materials and proven techniques to ensure lasting results.',
            icon: '🎯'
        },
        {
            title: 'Trust & Reliability',
            description: 'Licensed, insured, and committed to delivering on our promises every time.',
            icon: '🛡️'
        },
        {
            title: 'Customer Experience',
            description: 'We take the "PAIN" out of painting with seamless, stress-free service.',
            icon: '⭐'
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.3,
                delayChildren: 0.2
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
        <section id="about" className="relative bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 py-24 overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_70%,rgba(255,206,84,0.1),transparent_50%)]"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_90%_20%,rgba(248,250,252,0.05),transparent_50%)]"></div>
            
            {/* Decorative Lines */}
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[--luxury-champagne]/30 to-transparent"></div>
            <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[--luxury-champagne]/30 to-transparent"></div>

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
                        className="font-serif-luxury text-5xl lg:text-8xl text-[--luxury-champagne] mb-6"
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-[--luxury-champagne] via-[--luxury-rose-gold] to-[--luxury-champagne]">Story</span>
                    </motion.h2>
                    <motion.div 
                        className="w-32 h-1 bg-gradient-to-r from-transparent via-[--luxury-champagne] to-transparent mx-auto"
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.5 }}
                    ></motion.div>
                </motion.div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20">
                    {/* Story Content */}
                    <motion.div
                        className="space-y-8"
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        <motion.div variants={itemVariants}>
                            <h3 className="font-serif-luxury text-3xl lg:text-4xl text-white mb-6">
                                Taking the <span className="text-[--luxury-champagne] font-bold">"PAIN"</span> out of Painting
                            </h3>
                            <p className="font-sans-luxury text-xl text-slate-300 leading-relaxed">
                                Here at <span className="text-[--luxury-champagne] font-semibold">LED Custom Painting</span>, we believe the experience you have is equally as important as the final results. 
                                Our commitment to excellence has made us North Florida's trusted painting professionals since 2011.
                            </p>
                        </motion.div>

                        <motion.div variants={itemVariants} className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-600/30">
                            <p className="font-sans-luxury text-lg text-slate-200 leading-relaxed">
                                Specializing in <span className="text-[--luxury-champagne] font-semibold">Residential & Commercial Painting Services</span>, 
                                <span className="text-[--luxury-champagne] font-semibold"> Parking Lot Striping</span>, and 
                                <span className="text-[--luxury-champagne] font-semibold"> Ceiling Services</span>, we work around your schedule and budget to deliver projects 
                                <span className="text-[--luxury-champagne] font-semibold"> efficiently</span> and 
                                <span className="text-[--luxury-champagne] font-semibold"> properly</span>.
                            </p>
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <p className="font-sans-luxury text-xl text-slate-300 leading-relaxed mb-8">
                                Whether transforming your home's interior, enhancing curb appeal, or managing commercial projects, 
                                our team delivers precision craftsmanship with unmatched customer service.
                            </p>
                            
                            {/* Image */}
                            <motion.div
                                className="relative overflow-hidden rounded-2xl shadow-2xl shadow-slate-900/50"
                                whileHover={{ scale: 1.02 }}
                                transition={{ duration: 0.3 }}
                            >
                                <img
                                    src={paintedHomeImage}
                                    alt="Beautifully painted home showcasing our craftsmanship"
                                    className="w-full h-80 object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 via-transparent to-transparent"></div>
                            </motion.div>
                        </motion.div>
                    </motion.div>

                    {/* Stats & Values */}
                    <motion.div
                        className="space-y-12"
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        {/* Statistics */}
                        <motion.div variants={itemVariants}>
                            <h4 className="font-serif-luxury text-2xl text-[--luxury-champagne] mb-8 text-center">
                                Proven Excellence
                            </h4>
                            <div className="grid grid-cols-2 gap-6">
                                {stats.map((stat, index) => (
                                    <motion.div
                                        key={index}
                                        className="text-center bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 border border-slate-600/20"
                                        whileHover={{ scale: 1.05, y: -5 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <div className="font-serif-luxury text-3xl lg:text-4xl font-bold text-[--luxury-champagne] mb-2">
                                            {stat.number}
                                        </div>
                                        <div className="font-sans-luxury text-sm text-slate-300">
                                            {stat.label}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Core Values */}
                        <motion.div variants={itemVariants}>
                            <h4 className="font-serif-luxury text-2xl text-[--luxury-champagne] mb-10 text-center">
                                Our Core Values
                            </h4>
                            <div className="grid grid-cols-1 gap-6">
                                {values.map((value, index) => (
                                    <motion.div
                                        key={index}
                                        className="relative bg-gradient-to-br from-slate-800/40 via-slate-700/50 to-slate-800/40 backdrop-blur-sm rounded-2xl p-8 border border-slate-600/30 overflow-hidden group"
                                        whileHover={{ scale: 1.02, y: -3 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        {/* Background accent */}
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[--luxury-champagne]/10 to-transparent rounded-full blur-3xl group-hover:scale-150 transition-transform duration-500"></div>

                                        {/* Content Container */}
                                        <div className="relative flex items-start space-x-6">
                                            {/* Emoji Container */}
                                            <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-slate-700/50 to-slate-800/50 rounded-2xl flex items-center justify-center border border-slate-600/30 shadow-lg">
                                                <span className="text-3xl transform group-hover:scale-110 transition-transform duration-300">
                                                    {value.icon}
                                                </span>
                                            </div>

                                            {/* Text Content */}
                                            <div className="flex-1">
                                                <h5 className="font-serif-luxury text-xl text-[--luxury-champagne] mb-3">
                                                    {value.title}
                                                </h5>
                                                <p className="font-sans-luxury text-slate-300 leading-relaxed">
                                                    {value.description}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Decorative line */}
                                        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[--luxury-champagne]/20 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </motion.div>
                </div>

                {/* Call to Action */}
                <motion.div 
                    className="text-center"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                >
                    <div className="bg-gradient-to-r from-slate-800/50 via-slate-700/80 to-slate-800/50 backdrop-blur-sm rounded-2xl p-12 border border-slate-600/30">
                        <h3 className="font-serif-luxury text-3xl lg:text-4xl text-white mb-4">
                            Ready to Experience the LED Difference?
                        </h3>
                        <p className="font-sans-luxury text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
                            Join hundreds of satisfied customers who chose quality, reliability, and exceptional service. 
                            Let's bring your vision to life.
                        </p>
                        <motion.a
                            href="#quote"
                            className="inline-flex h-14 lg:h-20 animate-shimmer items-center justify-center rounded-full border border-[--luxury-champagne]/30
                            bg-[linear-gradient(110deg,#1e293b,45%,#334155,55%,#1e293b)] bg-[length:200%_100%] px-6 lg:px-16 py-3 lg:py-6 font-serif-luxury font-semibold text-white text-base lg:text-2xl tracking-wide whitespace-nowrap
                            transition-all duration-500 ease-out transform hover:-translate-y-2 hover:scale-105
                            focus:outline-none shadow-2xl hover:shadow-[--luxury-champagne]/20 hover:text-white backdrop-blur-sm group"
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            Start Your Project Today
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

export default About;