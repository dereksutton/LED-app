import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Menu, Transition } from '@headlessui/react';
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
        minHeight: '100vh',
        position: 'relative',
    };

    const menuButtonStyle = {
        outline: 'none',
        boxShadow: 'none',
        border: 'none',
        WebkitTapHighlightColor: 'rgba(0,0,0,0)',
    };

    const hamburgerButtonStyle = {
        ...menuButtonStyle,
        backgroundColor: 'transparent',
    };

    return (
        <section style={sectionStyle} className="text-white overflow-hidden">
            <div className="absolute top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 z-10"></div>
            <div className="relative z-20 h-full w-full">
                <div className="flex justify-between items-center lg:p-0 w-full">
                    <motion.img
                        src={logo}
                        alt="LED Custom Painting Logo"
                        className="h-72 pl-0 lg:pl-8"
                        initial={{ x: '-100vw' }}
                        animate={{ x: 0 }}
                        transition={{ type: 'spring', stiffness: 30 }}
                    />
                    <nav className="hidden lg:flex flex-col items-end">
                        <div className="text-yellow-500 poppins-semibold mb-2 pr-12"> {/* Phone number container */}
                            <a href="tel:+19043850426" className="hover:text-white text-xl no-underline transition-colors duration-300">
                                📞 (904) 385-0426
                            </a>
                        </div>
                        <motion.ul
                            className="flex items-center space-x-10 pr-6 text-lg poppins-regular"
                            initial={{ x: '100vw' }}
                            animate={{ x: 0 }}
                            transition={{ type: 'spring', stiffness: 30 }}
                        >
                            <li><a href="#services" className="hover:text-yellow-400 text-xl hover:no-underline">Services</a></li>
                            <Menu as="li" className="relative">
                                {({ open }) => (
                                    <>
                                        <Menu.Button 
                                            className="flex items-center hover:text-yellow-400 text-xl focus:outline-none focus:ring-0 focus:border-none active:outline-none active:border-none no-outline-button" 
                                            style={menuButtonStyle}
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
                                            <Menu.Items static className="absolute right-0 mt-2 w-48 bg-slate-700 rounded-md shadow-lg py-2 focus:outline-none">
                                                <Menu.Item>
                                                    {({ active }) => (
                                                        <a
                                                            href="#about"
                                                            className={`${active ? 'bg-yellow-400 text-slate-700' : 'text-yellow-400'} block px-4 py-2 hover:no-underline`}
                                                        >
                                                            Our Story
                                                        </a>
                                                    )}
                                                </Menu.Item>
                                                <Menu.Item>
                                                    {({ active }) => (
                                                        <a
                                                            href="#whyus"
                                                            className={`${active ? 'bg-yellow-400 text-slate-700' : 'text-yellow-400'} block px-4 py-2 hover:no-underline`}
                                                        >
                                                            Why Us?
                                                        </a>
                                                    )}
                                                </Menu.Item>
                                                <Menu.Item>
                                                    {({ active }) => (
                                                        <a
                                                            href="#portfolio"
                                                            className={`${active ? 'bg-yellow-400 text-slate-700' : 'text-yellow-400'} block px-4 py-2 hover:no-underline`}
                                                        >
                                                            Our Recent Work
                                                        </a>
                                                    )}
                                                </Menu.Item>
                                                <Menu.Item>
                                                    {({ active }) => (
                                                        <a
                                                            href="#guarantee"
                                                            className={`${active ? 'bg-yellow-400 text-slate-700' : 'text-yellow-400'} block px-4 py-2 hover:no-underline`}
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
                            <li><a href="#testimonials" className="hover:text-yellow-400 text-xl hover:no-underline">Testimonials</a></li>
                            <li><a href="#quote" className="bg-yellow-500 p-3 mr-10 rounded-md poppins-semibold text-slate-700 text-xl hover:no-underline hover:bg-yellow-300 hover:text-slate-700">Quote Request</a></li>
                        </motion.ul>
                    </nav>
                    <motion.div
                        className="lg:hidden pr-4 lg:pr-10"
                        initial={{ x: '100vw' }}
                        animate={{ x: 0 }}
                        transition={{ type: 'spring', stiffness: 30 }}
                    >
                        <button 
                            onClick={() => setIsMenuOpen(!isMenuOpen)} 
                            className="text-white focus:outline-none focus:ring-0 focus:border-none active:outline-none active:border-none no-outline-button"
                            style={hamburgerButtonStyle}
                        >
                            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}></path>
                            </svg>
                        </button>
                    </motion.div>
                </div>
                {isMenuOpen && (
                    <nav className="lg:hidden w-full mb-10">
                        <ul className="flex flex-col items-center space-y-3 text-lg poppins-regular bg-slate-900 bg-opacity-75 brand-gold py-2">
                            <li><a href="#services" className="hover:text-white hover:no-underline">Services</a></li>
                            <li><a href="#about" className="hover:text-white hover:no-underline">About Us</a></li>
                            <li><a href="#testimonials" className="hover:text-white hover:no-underline">Testimonials</a></li>
                            <li><a href="#quote" className="hover:text-white hover:no-underline">Quote Request</a></li>
                        </ul>
                    </nav>
                )}
                <motion.div
                    className="flex flex-col items-center justify-center h-full pb-44 sm:pb-48 lg:pb-64 px-4 lg:px-0 text-center w-full"
                    initial={{ y: '100vh' }}
                    animate={{ y: 0 }}
                    transition={{ type: 'spring', stiffness: 50 }}
                >
                    <h1 className="brand-gold text-4xl sm:text-4xl lg:text-5xl poppins-semibold mt-0 sm:mt-0 lg:mt-36 mb-2">
                        Transform Your Space With Precision Painting
                    </h1>
                    <p className="text-white text-xl sm:text-xl lg:text-3xl poppins-regular mb-4 sm:mb-5 lg:mb-6 pb-4">
                        Quality You Can See, Service You Can Trust.
                    </p>
                    <p className="text-white text-xl sm:text-xl lg:text-2xl poppins-regular mb-4 sm:mb-5 lg:mb-6 text-center">
                        <span className="block mb-2 mt-4">
                            ⭐⭐⭐⭐⭐
                        </span>
                            Proudly Maintaining a 5-Star Rating on Google
                    </p>
                    <a
                        href="#quote" className="inline-flex h-12 sm:h-12 lg:h-14 animate-shimmer items-center justify-center rounded-md border border-yellow-400
                        bg-[linear-gradient(110deg,#FFD700,45%,#FFA500,55%,#FFD700)] bg-[length:200%_100%] px-12 sm:px-12 lg:px-12 poppins-bold text-slate-700 text-3xl sm:text-3xl lg:text-5xl
                        transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105
                        focus:outline-none focus:ring-0 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-yellow-50
                        shadow-lg hover:shadow-2xl hover:no-underline hover:text-slate-700 mt-1"
                    >
                        Get a Free Quote
                    </a>
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;