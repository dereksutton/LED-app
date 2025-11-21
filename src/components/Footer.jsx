import React from 'react';
import { motion } from 'framer-motion';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const navigationSections = [
        { name: 'About', href: '#about' },
        { name: 'Services', href: '#services' },
        { name: 'Why Choose Us', href: '#whyus' },
        { name: 'Portfolio', href: '#portfolio' },
        { name: 'Our Guarantee', href: '#guarantee' },
        { name: 'Testimonials', href: '#testimonials' },
        { name: 'Get Quote', href: '#quote' }
    ];

    const contactInfo = [
        {
            icon: 'phone',
            label: 'Call Us',
            value: '(904) 385-0426',
            href: 'tel:+19043850426'
        },
        {
            icon: 'email',
            label: 'Email Us',
            value: 'info@ledcustompainting.com',
            href: 'mailto:info@ledcustompainting.com'
        },
        {
            icon: 'location',
            label: 'Service Area',
            value: 'North Florida',
            href: null
        }
    ];

    const businessInfo = [
        'Licensed & Insured',
        'A+ BBB Rating',
        '13+ Years Experience',
        '3-Year Warranty'
    ];

    const SocialIcon = ({ platform, href }) => {
        const iconProps = {
            className: "w-6 h-6",
            fill: "currentColor",
            viewBox: "0 0 24 24"
        };

        const getIcon = () => {
            switch (platform) {
                case 'facebook':
                    return (
                        <svg {...iconProps}>
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                    );
                case 'instagram':
                    return (
                        <svg {...iconProps}>
                            <path d="M12.017 0C8.396 0 7.929.013 6.71.06 5.487.107 4.65.278 3.927.525 3.166.789 2.529 1.15 1.893 1.787.734 2.946.371 4.274.067 5.649.014 6.866 0 7.335 0 12.017s.014 5.151.067 6.369c.304 1.375.667 2.703 1.826 3.862.637.637 1.274.998 2.035 1.262.723.247 1.56.418 2.783.465 1.219.047 1.686.06 5.307.06s4.088-.013 5.307-.06c1.223-.047 2.06-.218 2.783-.465.761-.264 1.398-.625 2.035-1.262 1.159-1.159 1.522-2.487 1.826-3.862.053-1.218.067-1.687.067-6.369s-.014-5.151-.067-6.369c-.304-1.375-.667-2.703-1.826-3.862-.637-.637-1.274-.998-2.035-1.262C19.35.278 18.513.107 17.29.06 16.071.013 15.602 0 12.017 0zm0 2.17c3.312 0 3.706.012 5.021.058 1.213.055 1.872.256 2.311.425.58.225.994.495 1.429.929.434.435.704.849.929 1.43.169.439.37 1.098.425 2.311.046 1.315.058 1.709.058 5.021s-.012 3.706-.058 5.021c-.055 1.213-.256 1.872-.425 2.311-.225.58-.495.994-.929 1.429-.435.434-.849.704-1.43.929-.439.169-1.098.37-2.311.425-1.315.046-1.709.058-5.021.058s-3.706-.012-5.021-.058c-1.213-.055-1.872-.256-2.311-.425-.58-.225-.994-.495-1.429-.929-.434-.435-.704-.849-.929-1.43-.169-.439-.37-1.098-.425-2.311-.046-1.315-.058-1.709-.058-5.021s.012-3.706.058-5.021c.055-1.213.256-1.872.425-2.311.225-.58.495-.994.929-1.429.435-.434.849-.704 1.43-.929.439-.169 1.098-.37 2.311-.425 1.315-.046 1.709-.058 5.021-.058z"/>
                            <path d="M12.017 15.52a3.503 3.503 0 1 1 0-7.006 3.503 3.503 0 0 1 0 7.006zm0-8.858a5.355 5.355 0 1 0 0 10.71 5.355 5.355 0 0 0 0-10.71z"/>
                            <circle cx="17.708" cy="6.292" r="1.25"/>
                        </svg>
                    );
                default:
                    return null;
            }
        };

        return (
            <motion.a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-12 h-12 bg-slate-800/50 backdrop-blur-sm rounded-full border border-slate-700/50 text-[#F5E6D3] hover:text-white hover:bg-[#F5E6D3]/20 hover:border-[#F5E6D3]/50 transition-all duration-300"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
            >
                {getIcon()}
            </motion.a>
        );
    };

    const ContactIcon = ({ iconType }) => {
        const iconProps = {
            className: "w-5 h-5",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
            viewBox: "0 0 24 24"
        };

        switch (iconType) {
            case 'phone':
                return (
                    <svg {...iconProps}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                );
            case 'email':
                return (
                    <svg {...iconProps}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                );
            case 'location':
                return (
                    <svg {...iconProps}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                );
            default:
                return null;
        }
    };

    return (
        <footer className="relative bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(245,230,211,0.08),transparent_50%)]"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(232,180,160,0.06),transparent_50%)]"></div>
            
            {/* Decorative Top Line */}
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#F5E6D3]/30 to-transparent"></div>

            {/* Animated Background Elements */}
            <div className="absolute inset-0">
                <motion.div 
                    className="absolute top-10 right-10 w-64 h-64 bg-gradient-to-r from-[#F5E6D3]/05 to-transparent rounded-full blur-3xl"
                    animate={{ 
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3]
                    }}
                    transition={{ 
                        duration: 10,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
                <motion.div 
                    className="absolute bottom-10 left-10 w-48 h-48 bg-gradient-to-r from-[#E8B4A0]/05 to-transparent rounded-full blur-3xl"
                    animate={{ 
                        scale: [1.2, 1, 1.2],
                        opacity: [0.2, 0.4, 0.2]
                    }}
                    transition={{ 
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 3
                    }}
                />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-16">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 mb-12">
                    {/* Company Info */}
                    <motion.div
                        className="lg:col-span-1 text-center lg:text-left"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h3 className="font-serif-luxury text-2xl text-[#F5E6D3] mb-6">
                            LED Custom Painting
                        </h3>
                        <p className="font-sans-luxury text-slate-300 mb-6 leading-relaxed">
                            North Florida's premier painting professionals, delivering exceptional results with 13+ years of experience and unwavering commitment to quality.
                        </p>
                        <div className="space-y-3 inline-block lg:block">
                            {businessInfo.map((info, index) => (
                                <motion.div
                                    key={index}
                                    className="flex items-center space-x-3 text-left"
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <div className="w-4 h-4 rounded-full bg-[#F5E6D3]/20 flex items-center justify-center flex-shrink-0">
                                        <svg className="w-2 h-2 text-[#F5E6D3]" fill="currentColor" viewBox="0 0 8 8">
                                            <circle cx="4" cy="4" r="2"/>
                                        </svg>
                                    </div>
                                    <span className="font-sans-luxury text-slate-300 text-sm">{info}</span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Navigation Menu */}
                    <motion.div
                        className="lg:col-span-1 text-center lg:text-left"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <h3 className="font-serif-luxury text-2xl text-[#F5E6D3] mb-6">
                            Quick Links
                        </h3>
                        <nav className="space-y-3 inline-block lg:block">
                            {navigationSections.map((section, index) => (
                                <motion.a
                                    key={section.name}
                                    href={section.href}
                                    className="block font-sans-luxury text-slate-300 hover:text-[#F5E6D3] transition-colors duration-300 py-1 text-left"
                                    whileHover={{ x: 5 }}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    {section.name}
                                </motion.a>
                            ))}
                        </nav>
                    </motion.div>

                    {/* Contact Information */}
                    <motion.div
                        className="lg:col-span-1 text-center lg:text-left"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                    >
                        <h3 className="font-serif-luxury text-2xl text-[#F5E6D3] mb-6">
                            Contact Info
                        </h3>
                        <div className="space-y-4 inline-block lg:block">
                            {contactInfo.map((contact, index) => (
                                <motion.div
                                    key={contact.label}
                                    className="flex items-start space-x-3 text-left"
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <div className="w-8 h-8 bg-[#F5E6D3]/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                                        <div className="text-[#E8B4A0]">
                                            <ContactIcon iconType={contact.icon} />
                                        </div>
                                    </div>
                                    <div>
                                        <p className="font-sans-luxury text-sm text-slate-400 mb-1">
                                            {contact.label}
                                        </p>
                                        {contact.href ? (
                                            <motion.a
                                                href={contact.href}
                                                className="font-sans-luxury text-[#F5E6D3] hover:text-white transition-colors duration-300"
                                                whileHover={{ scale: 1.02 }}
                                            >
                                                {contact.value}
                                            </motion.a>
                                        ) : (
                                            <span className="font-sans-luxury text-slate-300">
                                                {contact.value}
                                            </span>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Social Media & CTA */}
                    <motion.div
                        className="lg:col-span-1 text-center lg:text-left"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                    >
                        <h3 className="font-serif-luxury text-2xl text-[#F5E6D3] mb-6">
                            Follow Us
                        </h3>
                        <p className="font-sans-luxury text-slate-300 mb-6">
                            Stay connected and see our latest projects and transformations.
                        </p>
                        <div className="flex justify-center lg:justify-start space-x-4 mb-8">
                            <SocialIcon
                                platform="facebook"
                                href="https://www.facebook.com/ledcustompainting?mibextid=kFxxJD"
                            />
                            <SocialIcon
                                platform="instagram"
                                href="https://www.instagram.com/led_custom_painting?igsh=MXMxczJ2NXp3anAxdA=="
                            />
                        </div>

                        {/* CTA Button */}
                        <motion.a
                            href="#quote"
                            className="inline-flex items-center justify-center w-full lg:w-auto px-8 h-12 bg-gradient-to-r from-[#F5E6D3] via-[#E8B4A0] to-[#F5E6D3] rounded-full font-serif-luxury font-semibold text-[#2C3E50] hover:shadow-lg hover:shadow-[#F5E6D3]/20 transition-all duration-300 group"
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            Get Free Quote
                            <motion.svg
                                className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </motion.svg>
                        </motion.a>
                    </motion.div>
                </div>

                {/* Bottom Bar */}
                <motion.div
                    className="border-t border-slate-700/50 pt-8"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                >
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                        <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
                            <p className="font-sans-luxury text-slate-400 text-sm">
                                &copy; {currentYear} LED Custom Painting & More. All rights reserved.
                            </p>
                            <div className="flex items-center space-x-4 text-slate-400 text-sm">
                                <motion.a 
                                    href="#" 
                                    className="font-sans-luxury hover:text-[#F5E6D3] transition-colors duration-300"
                                    whileHover={{ scale: 1.05 }}
                                >
                                    Privacy Policy
                                </motion.a>
                                <span>•</span>
                                <motion.a 
                                    href="#" 
                                    className="font-sans-luxury hover:text-[#F5E6D3] transition-colors duration-300"
                                    whileHover={{ scale: 1.05 }}
                                >
                                    Terms of Service
                                </motion.a>
                            </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                            <span className="font-sans-luxury text-slate-400 text-sm">
                                Proudly serving
                            </span>
                            <span className="font-serif-luxury text-[#E8B4A0] font-semibold">
                                North Florida
                            </span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </footer>
    );
};

export default Footer;