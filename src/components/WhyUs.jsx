import React, { useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import whyUsImage from '../assets/whyus.png';

const WhyUs = () => {
    const [activeCard, setActiveCard] = useState(0);
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    
    const rotateX = useSpring(useTransform(mouseY, [-300, 300], [15, -15]));
    const rotateY = useSpring(useTransform(mouseX, [-300, 300], [-15, 15]));

    const IconComponent = ({ iconType }) => {
        const iconProps = {
            className: "w-8 h-8",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
            viewBox: "0 0 24 24"
        };

        switch (iconType) {
            case 'home':
                return (
                    <svg {...iconProps}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                );
            case 'search':
                return (
                    <svg {...iconProps}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                );
            case 'chat':
                return (
                    <svg {...iconProps}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                );
            case 'star':
                return (
                    <svg {...iconProps}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                );
            case 'location':
                return (
                    <svg {...iconProps}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                );
            case 'heart':
                return (
                    <svg {...iconProps}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                );
            default:
                return null;
        }
    };

    const reasons = [
        {
            icon: "home",
            title: "The Best House Guest",
            description: "We treat your home with utmost respect and care, ensuring a pleasant, stress-free painting experience from start to finish.",
            highlight: "Respectful & Professional"
        },
        {
            icon: "search",
            title: "Attention to Detail",
            description: "Our meticulous approach and precision craftsmanship guarantee flawless results that consistently exceed expectations.",
            highlight: "Perfectionist Standards"
        },
        {
            icon: "chat",
            title: "Clear Communication",
            description: "We prioritize understanding your vision and maintain transparent communication throughout every project phase.",
            highlight: "Always Transparent"
        },
        {
            icon: "star",
            title: "Extra Mile Service",
            description: "From careful masking to thorough cleanup, we go above and beyond to protect and preserve your property.",
            highlight: "Beyond Expectations"
        },
        {
            icon: "location",
            title: "Local Expertise",
            description: "As North Florida's premier painting specialists, we understand your community's unique architectural needs.",
            highlight: "13+ Years Local Experience"
        },
        {
            icon: "heart",
            title: "Customer Satisfaction",
            description: "Your complete satisfaction with our work and service is our ultimate goal and unwavering commitment.",
            highlight: "100% Satisfaction Goal"
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3
            }
        }
    };

    const cardVariants = {
        hidden: { 
            opacity: 0, 
            y: 60,
            scale: 0.8,
            rotateX: -15
        },
        visible: { 
            opacity: 1, 
            y: 0,
            scale: 1,
            rotateX: 0,
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
        rotation: [0, 3, 0],
        transition: {
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
        }
    };

    const handleMouseMove = (event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        mouseX.set(event.clientX - centerX);
        mouseY.set(event.clientY - centerY);
    };

    return (
        <section id="whyus" className="relative bg-gradient-to-br from-slate-50 via-white to-slate-100 py-32 overflow-hidden">
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
                        <h2 className="font-serif-luxury text-5xl lg:text-8xl text-slate-800 mb-8">
                            Why Work{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[--luxury-champagne] via-[--luxury-rose-gold] to-[--luxury-champagne]">
                                With Us?
                            </span>
                        </h2>
                    </motion.div>
                    
                    <motion.p 
                        className="font-sans-luxury text-2xl text-slate-600 max-w-4xl mx-auto leading-relaxed"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                    >
                        Discover the six pillars that make LED Custom Painting North Florida's most trusted painting professionals
                    </motion.p>
                    
                    <motion.div 
                        className="w-40 h-1 bg-gradient-to-r from-transparent via-[--luxury-champagne] to-transparent mx-auto mt-8"
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, delay: 0.6 }}
                    />
                </motion.div>

                {/* Top Section - First 4 cards in 2x2 grid */}
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                >
                    {reasons.slice(0, 4).map((reason, index) => (
                        <motion.div
                            key={index}
                            variants={cardVariants}
                            className={`group relative cursor-pointer`}
                            onMouseEnter={() => setActiveCard(index)}
                            whileHover={{ 
                                scale: 1.05,
                                z: 10
                            }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-800/80 via-slate-700/90 to-slate-800/80 backdrop-blur-sm border border-slate-600/30 shadow-xl shadow-slate-900/30">
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
                                
                                <div className="relative p-6">
                                    {/* Icon with floating animation */}
                                    <motion.div 
                                        className="flex justify-center mb-4"
                                        animate={activeCard === index ? floatingAnimation : {}}
                                    >
                                        <div className="w-16 h-16 bg-[--luxury-champagne]/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-[--luxury-champagne]/40">
                                            <div className="text-[--luxury-champagne]">
                                                <IconComponent iconType={reason.icon} />
                                            </div>
                                        </div>
                                    </motion.div>
                                    
                                    <h3 className="font-serif-luxury text-lg text-[--luxury-champagne] mb-3 text-center group-hover:text-white transition-colors duration-300">
                                        {reason.title}
                                    </h3>
                                    
                                    <p className="font-sans-luxury text-sm text-slate-300 leading-relaxed mb-4 text-center">
                                        {reason.description}
                                    </p>
                                    
                                    <motion.div 
                                        className="flex justify-center"
                                        whileHover={{ scale: 1.05 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <div className="inline-flex items-center px-3 py-1 bg-[--luxury-champagne]/90 backdrop-blur-sm rounded-full border border-[--luxury-champagne]/40">
                                            <span className="font-sans-luxury font-semibold text-[--luxury-rose-gold] text-xs">
                                                {reason.highlight}
                                            </span>
                                        </div>
                                    </motion.div>
                                </div>
                                
                                {/* Hover border glow */}
                                <div className="absolute inset-0 rounded-2xl border-2 border-transparent bg-gradient-to-r from-[--luxury-champagne]/30 via-transparent to-[--luxury-champagne]/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                            </div>
                            
                            {/* Floating shadow */}
                            <div className="absolute inset-0 -z-10 rounded-2xl bg-[--luxury-champagne]/20 blur-xl scale-95 opacity-0 group-hover:opacity-100 transition-all duration-500" />
                        </motion.div>
                    ))}
                </motion.div>

                {/* Bottom Section - Mobile: cards first, then image, Desktop: side by side */}
                <div className="space-y-6 lg:space-y-0">
                    {/* Mobile Card Container - Shows cards first on mobile */}
                    <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {/* Mobile Card 1 */}
                        <motion.div
                            variants={cardVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            transition={{ delay: 0.6 }}
                        >
                            <motion.div
                                className={`group relative cursor-pointer`}
                                onMouseEnter={() => setActiveCard(4)}
                                whileHover={{ 
                                    scale: 1.05,
                                    z: 10
                                }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-800/80 via-slate-700/90 to-slate-800/80 backdrop-blur-sm border border-slate-600/30 shadow-xl shadow-slate-900/30">
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
                                    
                                    <div className="relative p-6">
                                        <motion.div 
                                            className="flex justify-center mb-4"
                                            animate={activeCard === 4 ? floatingAnimation : {}}
                                        >
                                            <div className="w-16 h-16 bg-[--luxury-champagne]/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-[--luxury-champagne]/40">
                                                <div className="text-[--luxury-champagne]">
                                                <IconComponent iconType={reasons[4].icon} />
                                            </div>
                                            </div>
                                        </motion.div>
                                        
                                        <h3 className="font-serif-luxury text-lg text-[--luxury-champagne] mb-3 text-center group-hover:text-white transition-colors duration-300">
                                            {reasons[4].title}
                                        </h3>
                                        
                                        <p className="font-sans-luxury text-sm text-slate-300 leading-relaxed mb-4 text-center">
                                            {reasons[4].description}
                                        </p>
                                        
                                        <motion.div 
                                            className="flex justify-center"
                                            whileHover={{ scale: 1.05 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <div className="inline-flex items-center px-3 py-1 bg-[--luxury-champagne]/90 backdrop-blur-sm rounded-full border border-[--luxury-champagne]/40">
                                                <span className="font-sans-luxury font-semibold text-[--luxury-rose-gold] text-xs">
                                                    {reasons[4].highlight}
                                                </span>
                                            </div>
                                        </motion.div>
                                    </div>
                                    
                                    <div className="absolute inset-0 rounded-2xl border-2 border-transparent bg-gradient-to-r from-[--luxury-champagne]/30 via-transparent to-[--luxury-champagne]/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                                </div>
                                <div className="absolute inset-0 -z-10 rounded-2xl bg-[--luxury-champagne]/20 blur-xl scale-95 opacity-0 group-hover:opacity-100 transition-all duration-500" />
                            </motion.div>
                        </motion.div>

                        {/* Mobile Card 2 */}
                        <motion.div
                            variants={cardVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            transition={{ delay: 0.8 }}
                        >
                            <motion.div
                                className={`group relative cursor-pointer`}
                                onMouseEnter={() => setActiveCard(5)}
                                whileHover={{ 
                                    scale: 1.05,
                                    z: 10
                                }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-800/80 via-slate-700/90 to-slate-800/80 backdrop-blur-sm border border-slate-600/30 shadow-xl shadow-slate-900/30">
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
                                    
                                    <div className="relative p-6">
                                        <motion.div 
                                            className="flex justify-center mb-4"
                                            animate={activeCard === 5 ? floatingAnimation : {}}
                                        >
                                            <div className="w-16 h-16 bg-[--luxury-champagne]/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-[--luxury-champagne]/40">
                                                <div className="text-[--luxury-champagne]">
                                                <IconComponent iconType={reasons[5].icon} />
                                            </div>
                                            </div>
                                        </motion.div>
                                        
                                        <h3 className="font-serif-luxury text-lg text-[--luxury-champagne] mb-3 text-center group-hover:text-white transition-colors duration-300">
                                            {reasons[5].title}
                                        </h3>
                                        
                                        <p className="font-sans-luxury text-sm text-slate-300 leading-relaxed mb-4 text-center">
                                            {reasons[5].description}
                                        </p>
                                        
                                        <motion.div 
                                            className="flex justify-center"
                                            whileHover={{ scale: 1.05 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <div className="inline-flex items-center px-3 py-1 bg-[--luxury-champagne]/90 backdrop-blur-sm rounded-full border border-[--luxury-champagne]/40">
                                                <span className="font-sans-luxury font-semibold text-[--luxury-rose-gold] text-xs">
                                                    {reasons[5].highlight}
                                                </span>
                                            </div>
                                        </motion.div>
                                    </div>
                                    
                                    <div className="absolute inset-0 rounded-2xl border-2 border-transparent bg-gradient-to-r from-[--luxury-champagne]/30 via-transparent to-[--luxury-champagne]/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                                </div>
                                <div className="absolute inset-0 -z-10 rounded-2xl bg-[--luxury-champagne]/20 blur-xl scale-95 opacity-0 group-hover:opacity-100 transition-all duration-500" />
                            </motion.div>
                        </motion.div>
                    </div>

                    {/* Desktop Grid Layout */}
                    <div className="hidden lg:grid lg:grid-cols-4 gap-8 items-center">
                        {/* Left Card */}
                        <motion.div
                            className="lg:col-span-1"
                            variants={cardVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            transition={{ delay: 0.6 }}
                        >
                            <motion.div
                                className={`group relative cursor-pointer`}
                                onMouseEnter={() => setActiveCard(4)}
                                whileHover={{ 
                                    scale: 1.05,
                                    z: 10
                                }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-800/80 via-slate-700/90 to-slate-800/80 backdrop-blur-sm border border-slate-600/30 shadow-xl shadow-slate-900/30">
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
                                    
                                    <div className="relative p-6">
                                        <motion.div 
                                            className="flex justify-center mb-4"
                                            animate={activeCard === 4 ? floatingAnimation : {}}
                                        >
                                            <div className="w-16 h-16 bg-[--luxury-champagne]/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-[--luxury-champagne]/40">
                                                <div className="text-[--luxury-champagne]">
                                                <IconComponent iconType={reasons[4].icon} />
                                            </div>
                                            </div>
                                        </motion.div>
                                        
                                        <h3 className="font-serif-luxury text-lg text-[--luxury-champagne] mb-3 text-center group-hover:text-white transition-colors duration-300">
                                            {reasons[4].title}
                                        </h3>
                                        
                                        <p className="font-sans-luxury text-sm text-slate-300 leading-relaxed mb-4 text-center">
                                            {reasons[4].description}
                                        </p>
                                        
                                        <motion.div 
                                            className="flex justify-center"
                                            whileHover={{ scale: 1.05 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <div className="inline-flex items-center px-3 py-1 bg-[--luxury-champagne]/90 backdrop-blur-sm rounded-full border border-[--luxury-champagne]/40">
                                                <span className="font-sans-luxury font-semibold text-[--luxury-rose-gold] text-xs">
                                                    {reasons[4].highlight}
                                                </span>
                                            </div>
                                        </motion.div>
                                    </div>
                                    
                                    <div className="absolute inset-0 rounded-2xl border-2 border-transparent bg-gradient-to-r from-[--luxury-champagne]/30 via-transparent to-[--luxury-champagne]/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                                </div>
                                <div className="absolute inset-0 -z-10 rounded-2xl bg-[--luxury-champagne]/20 blur-xl scale-95 opacity-0 group-hover:opacity-100 transition-all duration-500" />
                            </motion.div>
                        </motion.div>

                        {/* Center Image */}
                        <motion.div 
                            className="lg:col-span-2 relative"
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
                            onMouseMove={handleMouseMove}
                            onMouseLeave={() => {
                                mouseX.set(0);
                                mouseY.set(0);
                            }}
                            style={{ perspective: 1000 }}
                        >
                            <motion.div
                                className="relative"
                                style={{ 
                                    rotateX,
                                    rotateY,
                                    transformStyle: "preserve-3d"
                                }}
                            >
                                {/* Main image container */}
                                <div className="relative overflow-hidden rounded-3xl shadow-2xl shadow-slate-400/20">
                                    <motion.img
                                        src={whyUsImage}
                                        alt="Professional LED Custom Painting team showcasing exceptional craftsmanship"
                                        loading="lazy"
                                        className="w-full h-auto"
                                        whileHover={{ scale: 1.02 }}
                                        transition={{ duration: 0.4 }}
                                    />
                                    
                                    {/* Gradient overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 via-transparent to-transparent" />
                                    
                                    {/* Floating elements */}
                                    <motion.div 
                                        className="absolute top-8 right-8 bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-xl"
                                        animate={{ 
                                            y: [0, -8, 0],
                                            rotate: [0, 2, 0]
                                        }}
                                        transition={{ 
                                            duration: 4,
                                            repeat: Infinity,
                                            ease: "easeInOut"
                                        }}
                                    >
                                        <div className="text-center">
                                            <div className="font-serif-luxury text-2xl font-bold text-slate-800">13+</div>
                                            <div className="font-sans-luxury text-sm text-slate-600">Years</div>
                                        </div>
                                    </motion.div>
                                    
                                    <motion.div 
                                        className="absolute bottom-8 left-8 bg-slate-900/90 backdrop-blur-sm rounded-2xl p-4 shadow-xl border border-slate-700/50"
                                        animate={{ 
                                            y: [0, 8, 0],
                                            rotate: [0, -2, 0]
                                        }}
                                        transition={{ 
                                            duration: 3,
                                            repeat: Infinity,
                                            ease: "easeInOut",
                                            delay: 1
                                        }}
                                    >
                                        <div className="text-center">
                                            <div className="font-serif-luxury text-2xl font-bold text-[--luxury-champagne]">★★★★★</div>
                                            <div className="font-sans-luxury text-sm text-[--luxury-rose-gold]">5-Star Rating</div>
                                        </div>
                                    </motion.div>
                                </div>
                                
                                {/* 3D depth layers */}
                                <div 
                                    className="absolute inset-0 rounded-3xl bg-gradient-to-br from-slate-200/30 to-slate-400/30 -z-10 blur-sm"
                                    style={{ transform: 'translateZ(-20px) scale(0.95)' }}
                                />
                                <div 
                                    className="absolute inset-0 rounded-3xl bg-gradient-to-br from-slate-300/20 to-slate-500/20 -z-20 blur-md"
                                    style={{ transform: 'translateZ(-40px) scale(0.9)' }}
                                />
                            </motion.div>
                        </motion.div>

                        {/* Right Card */}
                        <motion.div
                            className="lg:col-span-1"
                            variants={cardVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            transition={{ delay: 0.8 }}
                        >
                            <motion.div
                                className={`group relative cursor-pointer`}
                                onMouseEnter={() => setActiveCard(5)}
                                whileHover={{ 
                                    scale: 1.05,
                                    z: 10
                                }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-800/80 via-slate-700/90 to-slate-800/80 backdrop-blur-sm border border-slate-600/30 shadow-xl shadow-slate-900/30">
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
                                    
                                    <div className="relative p-6">
                                        <motion.div 
                                            className="flex justify-center mb-4"
                                            animate={activeCard === 5 ? floatingAnimation : {}}
                                        >
                                            <div className="w-16 h-16 bg-[--luxury-champagne]/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-[--luxury-champagne]/40">
                                                <div className="text-[--luxury-champagne]">
                                                <IconComponent iconType={reasons[5].icon} />
                                            </div>
                                            </div>
                                        </motion.div>
                                        
                                        <h3 className="font-serif-luxury text-lg text-[--luxury-champagne] mb-3 text-center group-hover:text-white transition-colors duration-300">
                                            {reasons[5].title}
                                        </h3>
                                        
                                        <p className="font-sans-luxury text-sm text-slate-300 leading-relaxed mb-4 text-center">
                                            {reasons[5].description}
                                        </p>
                                        
                                        <motion.div 
                                            className="flex justify-center"
                                            whileHover={{ scale: 1.05 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <div className="inline-flex items-center px-3 py-1 bg-[--luxury-champagne]/90 backdrop-blur-sm rounded-full border border-[--luxury-champagne]/40">
                                                <span className="font-sans-luxury font-semibold text-[--luxury-rose-gold] text-xs">
                                                    {reasons[5].highlight}
                                                </span>
                                            </div>
                                        </motion.div>
                                    </div>
                                    
                                    <div className="absolute inset-0 rounded-2xl border-2 border-transparent bg-gradient-to-r from-[--luxury-champagne]/30 via-transparent to-[--luxury-champagne]/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                                </div>
                                <div className="absolute inset-0 -z-10 rounded-2xl bg-[--luxury-champagne]/20 blur-xl scale-95 opacity-0 group-hover:opacity-100 transition-all duration-500" />
                            </motion.div>
                        </motion.div>
                    </div>

                    {/* Mobile Image Container - Shows image second on mobile */}
                    <motion.div 
                        className="lg:hidden relative"
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
                        onMouseMove={handleMouseMove}
                        onMouseLeave={() => {
                            mouseX.set(0);
                            mouseY.set(0);
                        }}
                        style={{ perspective: 1000 }}
                    >
                        <motion.div
                            className="relative"
                            style={{ 
                                rotateX,
                                rotateY,
                                transformStyle: "preserve-3d"
                            }}
                        >
                            {/* Main image container */}
                            <div className="relative overflow-hidden rounded-3xl shadow-2xl shadow-slate-400/20">
                                <motion.img
                                    src={whyUsImage}
                                    alt="Professional LED Custom Painting team showcasing exceptional craftsmanship"
                                    loading="lazy"
                                    className="w-full h-auto"
                                    whileHover={{ scale: 1.02 }}
                                    transition={{ duration: 0.4 }}
                                />
                                
                                {/* Gradient overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 via-transparent to-transparent" />
                                
                                {/* Floating elements */}
                                <motion.div 
                                    className="absolute top-8 right-8 bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-xl"
                                    animate={{ 
                                        y: [0, -8, 0],
                                        rotate: [0, 2, 0]
                                    }}
                                    transition={{ 
                                        duration: 4,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                >
                                    <div className="text-center">
                                        <div className="font-serif-luxury text-2xl font-bold text-slate-800">13+</div>
                                        <div className="font-sans-luxury text-sm text-slate-600">Years</div>
                                    </div>
                                </motion.div>
                                
                                <motion.div 
                                    className="absolute bottom-8 left-8 bg-slate-900/90 backdrop-blur-sm rounded-2xl p-4 shadow-xl border border-slate-700/50"
                                    animate={{ 
                                        y: [0, 8, 0],
                                        rotate: [0, -2, 0]
                                    }}
                                    transition={{ 
                                        duration: 3,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                        delay: 1
                                    }}
                                >
                                    <div className="text-center">
                                        <div className="font-serif-luxury text-2xl font-bold text-[--luxury-champagne]">★★★★★</div>
                                        <div className="font-sans-luxury text-sm text-[--luxury-rose-gold]">5-Star Rating</div>
                                    </div>
                                </motion.div>
                            </div>
                            
                            {/* 3D depth layers */}
                            <div 
                                className="absolute inset-0 rounded-3xl bg-gradient-to-br from-slate-200/30 to-slate-400/30 -z-10 blur-sm"
                                style={{ transform: 'translateZ(-20px) scale(0.95)' }}
                            />
                            <div 
                                className="absolute inset-0 rounded-3xl bg-gradient-to-br from-slate-300/20 to-slate-500/20 -z-20 blur-md"
                                style={{ transform: 'translateZ(-40px) scale(0.9)' }}
                            />
                        </motion.div>
                    </motion.div>
                </div>
                
                {/* Bottom CTA Section */}
                <motion.div 
                    className="text-center mt-24"
                    initial={{ opacity: 0, y: 80 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                >
                    <div className="bg-gradient-to-r from-slate-800/50 via-slate-700/80 to-slate-800/50 backdrop-blur-sm rounded-2xl p-12 border border-slate-600/30">
                        <h3 className="font-serif-luxury text-3xl lg:text-4xl text-white mb-6">
                            Experience the LED Difference Today
                        </h3>
                        <p className="font-sans-luxury text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
                            Join thousands of satisfied customers who chose excellence. Let's transform your vision into reality.
                        </p>
                        <motion.a
                            href="#quote"
                            className="inline-flex h-16 lg:h-20 animate-shimmer items-center justify-center rounded-full border border-slate-700/30
                            bg-[linear-gradient(110deg,#1e293b,45%,#334155,55%,#1e293b)] bg-[length:200%_100%] px-12 lg:px-16 py-4 lg:py-6 font-serif-luxury font-semibold text-white text-xl lg:text-2xl tracking-wide
                            transition-all duration-500 ease-out transform hover:-translate-y-2 hover:scale-105
                            focus:outline-none shadow-2xl hover:shadow-slate-800/30 hover:text-white backdrop-blur-sm group"
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            Get Started Now
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

export default WhyUs;