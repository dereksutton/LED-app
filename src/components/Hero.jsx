import React, { useState } from 'react';
import { motion } from 'framer-motion';
import logo from '../assets/LED-logo.png';
import backgroundImage from '../assets/paintedhome2.jpg';

const Hero = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const sectionStyle = {
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        width: '100%',
        height: '100vh',
        position: 'relative',
    };

    return (
        <section style={sectionStyle} className="text-white overflow-hidden">
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                zIndex: 1
            }}></div>
            <div style={{ position: 'relative', zIndex: 2, height: '100%' }} className="w-full">
                <div className="flex justify-between items-center md:p-0 w-full">
                    <motion.img
                        src={logo}
                        alt="LED Custom Painting Logo"
                        className="h-44 sm:h-44 md:h-48 pl-2 md:pl-10"
                        initial={{ x: '-100vw' }}
                        animate={{ x: 0 }}
                        transition={{ type: 'spring', stiffness: 30 }}
                    />
                    <nav className="hidden md:flex">
                        <motion.ul
                            className="flex space-x-6 pr-4 md:pr-10 text-lg poppins-regular"
                            initial={{ x: '100vw' }}
                            animate={{ x: 0 }}
                            transition={{ type: 'spring', stiffness: 30 }}
                        >
                            <li><a href="#services" className="hover:text-gray-300 hover:no-underline">Services</a></li>
                            <li><a href="#testimonials" className="hover:text-gray-300 hover:no-underline">Testimonials</a></li>
                            <li><a href="#contact" className="hover:text-gray-300 hover:no-underline">Contact</a></li>
                        </motion.ul>
                    </nav>
                    <motion.div
                        className="md:hidden pr-4 md:pr-10"
                        initial={{ x: '100vw' }}
                        animate={{ x: 0 }}
                        transition={{ type: 'spring', stiffness: 30 }}
                    >
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white focus:outline-none focus:ring-0">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}></path>
                            </svg>
                        </button>
                    </motion.div>
                </div>
                {isMenuOpen && (
                    <nav className="md:hidden w-full">
                        <ul className="flex flex-col items-center space-y-3 text-lg poppins-regular bg-slate-900 bg-opacity-75 py-2">
                            <li><a href="#services" className="hover:text-gray-300">Services</a></li>
                            <li><a href="#testimonials" className="hover:text-gray-300">Testimonials</a></li>
                            <li><a href="#contact" className="hover:text-gray-300">Contact</a></li>
                        </ul>
                    </nav>
                )}
                <motion.div
                    className="flex flex-col items-center justify-center h-full pb-64 sm:pb-48 md:pb-64 px-4 md:px-0 text-center w-full"
                    initial={{ y: '100vh' }}
                    animate={{ y: 0 }}
                    transition={{ type: 'spring', stiffness: 50 }}
                >
                    <h1 className="brand-gold text-4xl sm:text-4xl md:text-5xl poppins-semibold mt-0 sm:mt-0 md:mt-36 mb-2">
                        Transform Your Space With Precision Painting
                    </h1>
                    <p className="text-xl sm:text-xl md:text-xl poppins-regular mb-4 sm:mb-5 md:mb-6 pb-6">
                        Quality You Can See, Service You Can Trust.
                    </p>
                    <button
                        className="inline-flex h-12 sm:h-12 md:h-12 animate-shimmer items-center justify-center rounded-md border border-yellow-700
                        bg-[linear-gradient(110deg,#FFD700,45%,#FFA500,55%,#FFD700)] bg-[length:200%_100%] px-4 sm:px-5 md:px-6 poppins-bold text-slate-700 text-3xl sm:text-3xl md:text-3xl
                        transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105
                        focus:outline-none focus:ring-0 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-yellow-50
                        shadow-lg hover:shadow-2xl"
                    >
                        Get a Free Quote
                    </button>
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;
