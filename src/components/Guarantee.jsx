import React from 'react';
import { motion } from 'framer-motion';

const Guarantee = () => {
    const IconComponent = ({ iconType }) => {
        const iconProps = {
            className: "w-8 h-8",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
            viewBox: "0 0 24 24"
        };

        switch (iconType) {
            case 'shield':
                return (
                    <svg {...iconProps}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                );
            case 'award':
                return (
                    <svg {...iconProps}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                );
            case 'document':
                return (
                    <svg {...iconProps}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                );
            case 'clock':
                return (
                    <svg {...iconProps}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                );
            default:
                return null;
        }
    };

    const guaranteePoints = [
        {
            title: "Quality Assurance",
            description: "We pledge to provide expert service with meticulous attention to detail, ensuring your complete satisfaction with every project.",
            icon: "award",
            highlight: "Expert Craftsmanship"
        },
        {
            title: "3-Year Warranty",
            description: "Our work comes with a comprehensive transferable 3-year warranty, protecting against peeling, bubbling, cracking, or splitting.",
            icon: "shield",
            highlight: "Fully Transferable"
        },
        {
            title: "Transparent Process",
            description: "Free detailed estimates, no hidden fees, and a commitment to punctuality and exceptional service delivery.",
            icon: "document",
            highlight: "No Hidden Fees"
        }
    ];

    const trustBadges = [
        {
            label: "Licensed & Insured",
            icon: "shield"
        },
        {
            label: "On-Time Guarantee",
            icon: "clock"
        },
        {
            label: "100% Satisfaction",
            icon: "award"
        }
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
            y: 60,
            scale: 0.8
        },
        visible: { 
            opacity: 1, 
            y: 0,
            scale: 1,
            transition: {
                type: "spring",
                damping: 20,
                stiffness: 100,
                duration: 0.8
            }
        }
    };

    const floatingAnimation = {
        y: [0, -8, 0],
        rotation: [0, 2, 0],
        transition: {
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
        }
    };

    return (
        <section id="guarantee" className="relative bg-gradient-to-br from-[--luxury-champagne] via-[--luxury-rose-gold] to-[--luxury-champagne] py-24 overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_70%,rgba(30,41,59,0.2),transparent_50%)]"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_90%_30%,rgba(30,41,59,0.15),transparent_50%)]"></div>
            
            {/* Decorative Lines */}
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[--luxury-midnight]/40 to-transparent"></div>
            <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[--luxury-midnight]/40 to-transparent"></div>

            {/* Animated Background Elements */}
            <div className="absolute inset-0">
                <motion.div 
                    className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-[--luxury-champagne]/10 to-transparent rounded-full blur-3xl"
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
                    className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-r from-slate-300/20 to-transparent rounded-full blur-3xl"
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
                        <h2 className="font-serif-luxury text-5xl lg:text-8xl text-[--luxury-midnight] mb-8">
                            Our{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800">
                                Guarantee
                            </span>
                        </h2>
                    </motion.div>
                    
                    <motion.p 
                        className="font-sans-luxury text-2xl text-slate-700 max-w-4xl mx-auto leading-relaxed mb-8"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                    >
                        Your peace of mind is our priority. We stand behind every project with uncompromising standards and ironclad guarantees.
                    </motion.p>

                    {/* Trust Badges */}
                    <motion.div 
                        className="flex flex-wrap justify-center gap-6 mb-12"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                    >
                        {trustBadges.map((badge, index) => (
                            <motion.div
                                key={index}
                                className="flex items-center space-x-3 bg-slate-900/80 backdrop-blur-sm rounded-full px-6 py-3 border border-slate-700/50"
                                whileHover={{ scale: 1.05, y: -2 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="text-white">
                                    <IconComponent iconType={badge.icon} />
                                </div>
                                <span className="font-sans-luxury font-semibold text-white text-sm lg:text-base">
                                    {badge.label}
                                </span>
                            </motion.div>
                        ))}
                    </motion.div>
                    
                    <motion.div 
                        className="w-40 h-1 bg-gradient-to-r from-transparent via-[#2C3E50] to-transparent mx-auto"
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, delay: 0.6 }}
                    />
                </motion.div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    {/* Guarantee Cards */}
                    <motion.div
                        className="space-y-8"
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        {guaranteePoints.map((point, index) => (
                            <motion.div
                                key={index}
                                variants={cardVariants}
                                className="group relative cursor-pointer"
                                whileHover={{ 
                                    scale: 1.02,
                                    x: 10
                                }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900/90 via-slate-800/95 to-slate-900/90 backdrop-blur-sm border border-slate-700/50 shadow-xl shadow-slate-900/50 p-8">
                                    {/* Animated gradient overlay */}
                                    <motion.div 
                                        className="absolute inset-0 bg-gradient-to-r from-transparent via-[--luxury-champagne]/10 to-transparent"
                                        initial={{ x: '-100%' }}
                                        whileHover={{ 
                                            x: '100%',
                                            transition: { 
                                                duration: 0.8,
                                                ease: "easeInOut"
                                            }
                                        }}
                                    />
                                    
                                    <div className="relative flex items-start space-x-6">
                                        {/* Icon */}
                                        <motion.div 
                                            className="flex-shrink-0"
                                            animate={floatingAnimation}
                                        >
                                            <div className="w-16 h-16 bg-[#F5E6D3]/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-[#F5E6D3]/40">
                                                <div className="text-[#F5E6D3]">
                                                    <IconComponent iconType={point.icon} />
                                                </div>
                                            </div>
                                        </motion.div>
                                        
                                        {/* Content */}
                                        <div className="flex-1">
                                            <h3 className="font-serif-luxury text-2xl text-[#F5E6D3] mb-3 group-hover:text-white transition-colors duration-300">
                                                {point.title}
                                            </h3>
                                            
                                            <p className="font-sans-luxury text-slate-200 leading-relaxed mb-4">
                                                {point.description}
                                            </p>
                                            
                                            <motion.div 
                                                className="flex justify-start"
                                                whileHover={{ scale: 1.05 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <div className="inline-flex items-center px-4 py-2 bg-[#F5E6D3]/90 backdrop-blur-sm rounded-full border border-[#F5E6D3]/60">
                                                    <span className="font-sans-luxury font-semibold text-[#2C3E50] text-sm">
                                                        {point.highlight}
                                                    </span>
                                                </div>
                                            </motion.div>
                                        </div>
                                    </div>
                                    
                                    {/* Hover border glow */}
                                    <div className="absolute inset-0 rounded-2xl border-2 border-transparent bg-gradient-to-r from-[--luxury-champagne]/30 via-transparent to-[--luxury-champagne]/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                                </div>
                                
                                {/* Floating shadow */}
                                <div className="absolute inset-0 -z-10 rounded-2xl bg-[--luxury-champagne]/20 blur-xl scale-95 opacity-0 group-hover:opacity-100 transition-all duration-500" />
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Lottie Animation with Info Boxes */}
                    <motion.div 
                        className="flex flex-col items-center space-y-8"
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
                    >
                        {/* Lottie Animation */}
                        <div className="w-full h-[400px] lg:h-[500px] flex justify-center items-center">
                            <dotlottie-player 
                                src="https://lottie.host/270a8cfb-e098-4d3c-990f-5b197bb0b585/XlgEY5DXZY.json" 
                                background="transparent" 
                                speed="1" 
                                style={{ 
                                    width: '100%',
                                    height: '100%',
                                    minWidth: '400px',
                                    minHeight: '400px',
                                }}
                                className="filter drop-shadow-2xl"
                                loop 
                                autoplay
                            ></dotlottie-player>
                        </div>
                        
                        {/* Info Boxes Below Animation */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
                            <motion.div 
                                className="bg-slate-900/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 text-center"
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.8 }}
                                whileHover={{ scale: 1.02, y: -2 }}
                            >
                                <div className="font-serif-luxury text-3xl font-bold text-[#F5E6D3] mb-2">13+</div>
                                <div className="font-sans-luxury text-sm font-semibold text-[#E8B4A0] mb-2">Years of Excellence</div>
                                <div className="font-sans-luxury text-xs text-slate-400 leading-relaxed">
                                    Over a decade of trusted service in North Florida, delivering consistently exceptional results for residential and commercial clients.
                                </div>
                            </motion.div>
                            
                            <motion.div 
                                className="bg-slate-900/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 text-center"
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 1.0 }}
                                whileHover={{ scale: 1.02, y: -2 }}
                            >
                                <div className="font-serif-luxury text-3xl font-bold text-[#F5E6D3] mb-2">A+</div>
                                <div className="font-sans-luxury text-sm font-semibold text-[#E8B4A0] mb-2">Customer Rating</div>
                                <div className="font-sans-luxury text-xs text-slate-400 leading-relaxed">
                                    Consistently rated A+ by the Better Business Bureau and maintaining a 5-star average across all customer review platforms.
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>

                {/* Bottom CTA Section */}
                <motion.div 
                    className="text-center mt-20"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                >
                    <div className="bg-gradient-to-r from-slate-900/80 via-slate-800/90 to-slate-900/80 backdrop-blur-sm rounded-2xl p-12 border border-slate-700/50">
                        <h3 className="font-serif-luxury text-3xl lg:text-4xl text-[#F5E6D3] mb-4">
                            Experience Risk-Free Excellence
                        </h3>
                        <p className="font-sans-luxury text-xl text-slate-200 mb-8 max-w-3xl mx-auto">
                            With our comprehensive guarantee and proven track record, your investment is protected every step of the way.
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
                            Get Your Risk-Free Quote
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
}

export default Guarantee;