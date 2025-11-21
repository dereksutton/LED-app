import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, Transition } from '@headlessui/react';
import Logo from './Logo';
import backgroundVideoOptimized from '../assets/led-hero-optimized.mp4';
import backgroundVideoMobile from '../assets/led-hero-mobile.mp4';

const Hero = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        // Check if mobile on mount and resize
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Simple approach that works across all browsers
    return (
        <section className="relative min-h-screen overflow-hidden">
            {/* Background video container - contained within hero section */}
            <div className="absolute inset-0 z-0">
                <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{
                        filter: 'brightness(0.8)',
                    }}
                >
                    <source src={isMobile ? backgroundVideoMobile : backgroundVideoOptimized} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
                {/* Optional overlay to ensure text readability */}
                <div className="absolute inset-0 bg-black/20"></div>
            </div>

            {/* Content section that overlays the video */}
            <div className="text-luxury-cream relative min-h-screen">
                <div className="relative z-20 flex flex-col min-h-screen">
                    {/* Header Section - Clean Layout */}
                    <header className="flex justify-between w-full px-4 lg:px-8">
                        {/* Logo positioned higher on left */}
                        <div className="flex-shrink-0 -mt-4 lg:-mt-8">
                            <Logo />
                        </div>
                        
                        {/* Desktop Navigation */}
                        <nav className="hidden lg:flex flex-col items-end space-y-3 mt-4 pt-4 lg:pt-8">
                            {/* Navigation menu */}
                            <motion.ul
                                className="flex items-center space-x-6 font-sans-luxury font-medium backdrop-blur-sm bg-white/10 rounded-full px-6 py-3 border border-white/20"
                                initial={{ x: '100vw' }}
                                animate={{ x: 0 }}
                                transition={{ type: 'spring', stiffness: 30 }}
                            >
                                <li><a href="#services" className="hover:text-slate-600 text-slate-800 text-lg font-semibold transition-all duration-300">Services</a></li>
                                <Menu as="li" className="relative">
                                    {({ open }) => (
                                        <>
                                            <Menu.Button 
                                                className="flex items-center hover:text-slate-600 text-slate-800 text-lg font-semibold focus:outline-none focus:ring-0 focus:border-none active:outline-none active:border-none no-outline-button transition-all duration-300" 
                                                style={{
                                                    outline: 'none',
                                                    boxShadow: 'none',
                                                    border: 'none',
                                                    WebkitTapHighlightColor: 'rgba(0,0,0,0)'
                                                }}
                                            >
                                                About Us
                                                <svg className="w-4 h-4 ml-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                                </svg>
                                            </Menu.Button>
                                            <Transition
                                                show={open}
                                                enter="transition ease-out duration-100"
                                                enterFrom="transform opacity-0 scale-95"
                                                enterTo="transform opacity-100 scale-100"
                                                leave="transition ease-in duration-75"
                                                leaveFrom="transform opacity-100 scale-100"
                                                leaveTo="transform opacity-0 scale-95"
                                            >
                                                <Menu.Items static className="absolute -right-4 top-12 w-52 backdrop-blur-md bg-white/95 rounded-xl shadow-2xl py-2 focus:outline-none border border-slate-200 font-sans-luxury">
                                                    <Menu.Item>
                                                        {({ active }) => (
                                                            <a
                                                                href="#about"
                                                                className={`${active ? 'bg-slate-200 text-slate-800' : 'text-slate-800'} block px-5 py-3 transition-all duration-200 font-sans-luxury`}
                                                            >
                                                                Our Story
                                                            </a>
                                                        )}
                                                    </Menu.Item>
                                                    <Menu.Item>
                                                        {({ active }) => (
                                                            <a
                                                                href="#whyus"
                                                                className={`${active ? 'bg-slate-200 text-slate-800' : 'text-slate-800'} block px-5 py-3 transition-all duration-200 font-sans-luxury`}
                                                            >
                                                                Why Us?
                                                            </a>
                                                        )}
                                                    </Menu.Item>
                                                    <Menu.Item>
                                                        {({ active }) => (
                                                            <a
                                                                href="#portfolio"
                                                                className={`${active ? 'bg-slate-200 text-slate-800' : 'text-slate-800'} block px-5 py-3 transition-all duration-200 font-sans-luxury`}
                                                            >
                                                                Our Recent Work
                                                            </a>
                                                        )}
                                                    </Menu.Item>
                                                    <Menu.Item>
                                                        {({ active }) => (
                                                            <a
                                                                href="#guarantee"
                                                                className={`${active ? 'bg-slate-200 text-slate-800' : 'text-slate-800'} block px-5 py-3 transition-all duration-200 font-sans-luxury`}
                                                            >
                                                                Our Guarantee
                                                            </a>
                                                        )}
                                                    </Menu.Item>
                                                </Menu.Items>
                                            </Transition>
                                        </>
                                    )}
                                </Menu>
                                <li><a href="#testimonials" className="hover:text-slate-600 text-slate-800 text-lg font-semibold transition-all duration-300">Testimonials</a></li>
                                <li><a href="#quote" className="bg-slate-800 text-[--luxury-champagne] px-6 py-3 rounded-full font-sans-luxury font-semibold text-lg hover:bg-slate-700 hover:scale-105 transition-all duration-300 shadow-lg">Quote Request</a></li>
                            </motion.ul>
                        </nav>
                        
                        {/* Mobile menu button */}
                        <motion.div
                            className="lg:hidden mt-4"
                            initial={{ x: '100vw' }}
                            animate={{ x: 0 }}
                            transition={{ type: 'spring', stiffness: 30 }}
                        >
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="text-[#F5E6D3] focus:outline-none focus:ring-0 focus:border-none active:outline-none active:border-none no-outline-button"
                                style={{
                                    backgroundColor: 'transparent',
                                    outline: 'none',
                                    boxShadow: 'none',
                                    border: 'none',
                                    WebkitTapHighlightColor: 'rgba(0,0,0,0)'
                                }}
                            >
                                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}></path>
                                </svg>
                            </button>
                        </motion.div>
                    </header>
                    
                    {/* Mobile Drawer */}
                    <motion.div
                        className={`fixed inset-0 z-50 lg:hidden ${isMenuOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
                        initial={false}
                        animate={isMenuOpen ? 'open' : 'closed'}
                    >
                        {/* Backdrop */}
                        <motion.div
                            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                            variants={{
                                open: { opacity: 1 },
                                closed: { opacity: 0 }
                            }}
                            transition={{ duration: 0.3 }}
                            onClick={() => setIsMenuOpen(false)}
                        />
                        
                        {/* Drawer */}
                        <motion.div
                            className="absolute top-0 right-0 h-full w-80 max-w-[85vw] bg-gradient-to-br from-[#2C3E50] via-[#34495e] to-[#2C3E50] shadow-2xl"
                            variants={{
                                open: { x: 0 },
                                closed: { x: '100%' }
                            }}
                            transition={{
                                type: 'spring',
                                damping: 25,
                                stiffness: 200,
                                duration: 0.4
                            }}
                        >
                            {/* Decorative gradient overlay */}
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(245,230,211,0.1),transparent_50%)]"></div>

                            {/* Drawer Header with Title and Close Button */}
                            <div className="relative flex justify-between items-center px-6 py-3 border-b border-[#F5E6D3]/20">
                                <h2 className="text-[#F5E6D3] text-2xl font-serif-luxury">Menu</h2>
                                <button
                                    onClick={() => setIsMenuOpen(false)}
                                    className="text-[#F5E6D3]/70 hover:text-[#F5E6D3] transition-colors duration-200"
                                    style={{
                                        outline: 'none',
                                        boxShadow: 'none',
                                        border: 'none',
                                        WebkitTapHighlightColor: 'rgba(0,0,0,0)'
                                    }}
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            
                            {/* Navigation Links */}
                            <nav className="relative px-6 py-4">
                                <ul className="space-y-1">
                                    <motion.li
                                        variants={{
                                            open: { opacity: 1, x: 0 },
                                            closed: { opacity: 0, x: 20 }
                                        }}
                                        transition={{ delay: 0.1 }}
                                    >
                                        <a
                                            href="#services"
                                            className="group relative block text-[#F5E6D3] text-xl font-serif-luxury py-2 hover:text-white transition-all duration-300"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            <span className="relative z-10">Services</span>
                                            <div className="absolute left-0 bottom-0 w-0 h-0.5 bg-gradient-to-r from-[#F5E6D3] to-[#E8B4A0] group-hover:w-full transition-all duration-300"></div>
                                        </a>
                                    </motion.li>

                                    <motion.li
                                        variants={{
                                            open: { opacity: 1, x: 0 },
                                            closed: { opacity: 0, x: 20 }
                                        }}
                                        transition={{ delay: 0.15 }}
                                    >
                                        <a
                                            href="#about"
                                            className="group relative block text-[#F5E6D3] text-xl font-serif-luxury py-2 hover:text-white transition-all duration-300"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            <span className="relative z-10">About Us</span>
                                            <div className="absolute left-0 bottom-0 w-0 h-0.5 bg-gradient-to-r from-[#F5E6D3] to-[#E8B4A0] group-hover:w-full transition-all duration-300"></div>
                                        </a>
                                    </motion.li>

                                    <motion.li
                                        variants={{
                                            open: { opacity: 1, x: 0 },
                                            closed: { opacity: 0, x: 20 }
                                        }}
                                        transition={{ delay: 0.2 }}
                                    >
                                        <a
                                            href="#whyus"
                                            className="group relative block text-[#F5E6D3] text-xl font-serif-luxury py-2 hover:text-white transition-all duration-300"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            <span className="relative z-10">Why Us</span>
                                            <div className="absolute left-0 bottom-0 w-0 h-0.5 bg-gradient-to-r from-[#F5E6D3] to-[#E8B4A0] group-hover:w-full transition-all duration-300"></div>
                                        </a>
                                    </motion.li>

                                    <motion.li
                                        variants={{
                                            open: { opacity: 1, x: 0 },
                                            closed: { opacity: 0, x: 20 }
                                        }}
                                        transition={{ delay: 0.25 }}
                                    >
                                        <a
                                            href="#portfolio"
                                            className="group relative block text-[#F5E6D3] text-xl font-serif-luxury py-2 hover:text-white transition-all duration-300"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            <span className="relative z-10">Portfolio</span>
                                            <div className="absolute left-0 bottom-0 w-0 h-0.5 bg-gradient-to-r from-[#F5E6D3] to-[#E8B4A0] group-hover:w-full transition-all duration-300"></div>
                                        </a>
                                    </motion.li>

                                    <motion.li
                                        variants={{
                                            open: { opacity: 1, x: 0 },
                                            closed: { opacity: 0, x: 20 }
                                        }}
                                        transition={{ delay: 0.3 }}
                                    >
                                        <a
                                            href="#testimonials"
                                            className="group relative block text-[#F5E6D3] text-xl font-serif-luxury py-2 hover:text-white transition-all duration-300"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            <span className="relative z-10">Testimonials</span>
                                            <div className="absolute left-0 bottom-0 w-0 h-0.5 bg-gradient-to-r from-[#F5E6D3] to-[#E8B4A0] group-hover:w-full transition-all duration-300"></div>
                                        </a>
                                    </motion.li>

                                    <motion.li
                                        variants={{
                                            open: { opacity: 1, x: 0 },
                                            closed: { opacity: 0, x: 20 }
                                        }}
                                        transition={{ delay: 0.35 }}
                                        className="pt-2"
                                    >
                                        <a
                                            href="#quote"
                                            className="inline-block bg-gradient-to-r from-[#F5E6D3] via-[#E8B4A0] to-[#F5E6D3] text-[#2C3E50] px-6 py-3 rounded-full font-serif-luxury font-semibold text-lg hover:shadow-lg hover:shadow-[#F5E6D3]/20 transform hover:scale-105 transition-all duration-300"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            Get Free Quote
                                        </a>
                                    </motion.li>
                                </ul>
                            </nav>
                            
                            {/* Logo and Contact Info at Bottom */}
                            <div className="absolute bottom-0 left-0 right-0 border-t border-[#F5E6D3]/20 bg-gradient-to-t from-[#1a252f] to-[#2C3E50]" style={{ height: '280px' }}>
                                <div className="relative flex flex-col items-center justify-center h-full pb-6">
                                    {/* Decorative accent */}
                                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#F5E6D3]/30 to-transparent"></div>

                                    {/* Logo */}
                                    <div className="scale-[0.6] -mt-8 -mb-14">
                                        <Logo />
                                    </div>

                                    {/* Call Us Now Text */}
                                    <p className="text-[#F5E6D3] font-serif-luxury text-sm mb-1">
                                        Call Us Now
                                    </p>

                                    {/* Phone Number */}
                                    <a
                                        href="tel:+19043850426"
                                        className="text-[#F5E6D3] hover:text-[#E8B4A0] transition-colors duration-300 font-sans-luxury text-base font-semibold mb-3"
                                    >
                                        (904) 385-0426
                                    </a>

                                    {/* Social Icons */}
                                    <div className="flex space-x-4">
                                        <a
                                            href="https://www.facebook.com/ledcustompainting?mibextid=kFxxJD"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="group"
                                        >
                                            <div className="w-9 h-9 bg-[#F5E6D3]/10 rounded-full flex items-center justify-center group-hover:bg-[#F5E6D3]/20 transition-all duration-300">
                                                <svg className="w-4 h-4 text-[#F5E6D3] group-hover:text-white transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                                </svg>
                                            </div>
                                        </a>
                                        <a
                                            href="https://www.instagram.com/led_custom_painting?igsh=MXMxczJ2NXp3anAxdA=="
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="group"
                                        >
                                            <div className="w-9 h-9 bg-[#F5E6D3]/10 rounded-full flex items-center justify-center group-hover:bg-[#F5E6D3]/20 transition-all duration-300">
                                                <svg className="w-4 h-4 text-[#F5E6D3] group-hover:text-white transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                                                </svg>
                                            </div>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                    
                    {/* Main Hero Content - Properly spaced */}
                    <motion.div
                        className="flex flex-col items-center justify-center flex-grow px-4 lg:px-0 text-center w-full pb-32 pt-8 lg:pt-16"
                        initial={{ y: '100vh' }}
                        animate={{ y: 0 }}
                        transition={{ type: 'spring', stiffness: 50 }}
                    >
                        <h1 className="text-[--luxury-midnight] font-serif-luxury font-bold text-4xl lg:text-7xl leading-tight tracking-tighter mb-8 lg:mb-10" style={{textShadow: '2px 2px 0px #F7E7CE, -2px -2px 0px #F7E7CE, 2px -2px 0px #F7E7CE, -2px 2px 0px #F7E7CE, 0px 2px 0px #F7E7CE, 0px -2px 0px #F7E7CE, 2px 0px 0px #F7E7CE, -2px 0px 0px #F7E7CE'}}>
                            Transform Your Space With Precision Painting
                        </h1>
                        <p className="text-[--luxury-champagne] text-2xl lg:text-4xl font-sans-luxury font-medium mb-8 lg:mb-12 leading-relaxed max-w-4xl" style={{textShadow: '2px 2px 0px #1e293b, 2px 2px 0px #1e293b, 2px 2px 0px #1e293b, 1px 2px 0px #1e293b, 0px 1px 0px #1e293b, 0px -1px 0px #1e293b, 1px 0px 0px #1e293b, -1px 0px 0px #1e293b'}}>
                            Quality You Can See, Service You Can Trust.
                        </p>
                        <div className="text-[--luxury-champagne] text-xl lg:text-2xl font-sans-luxury font-semibold mb-8 lg:mb-12 text-center" style={{textShadow: '2px 2px 0px #1e293b, 2px 2px 0px #1e293b, 2px 2px 0px #1e293b, 1px 2px 0px #1e293b, 0px 1px 0px #1e293b, 0px -1px 0px #1e293b, 1px 0px 0px #1e293b, -1px 0px 0px #1e293b'}}>
                            <div className="mb-4">
                                <dotlottie-player 
                                    src="https://lottie.host/3e9cd2ba-8d91-41a0-9e14-5bdb198d2408/cME3iszBZ8.lottie" 
                                    background="transparent" 
                                    speed="1" 
                                    style={{ width: '100%', maxWidth: '400px', margin: '0 auto' }} 
                                    loop 
                                    autoplay
                                ></dotlottie-player>
                            </div>
                            <p>Proudly Maintaining a 5-Star Rating on Google</p>
                        </div>
                        <a
                            href="#quote" className="inline-flex h-16 lg:h-20 animate-shimmer items-center justify-center rounded-full border border-slate-700/30
                            bg-[linear-gradient(110deg,#1e293b,45%,#334155,55%,#1e293b)] bg-[length:200%_100%] px-12 lg:px-16 py-4 lg:py-6 font-serif-luxury font-semibold text-white text-xl lg:text-2xl tracking-wide
                            transition-all duration-500 ease-out transform hover:-translate-y-2 hover:scale-105
                            focus:outline-none shadow-2xl hover:shadow-slate-800/30 hover:text-white backdrop-blur-sm"
                        >
                            Get a Free Quote
                        </a>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Hero;