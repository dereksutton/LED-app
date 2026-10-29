"use client";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { trackLead } from '../lib/analytics';
import { claims } from '../data/site';

const IconComponent = ({ iconType }) => {
    const iconProps = {
        className: "w-6 h-6",
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
        case 'clock':
            return (
                <svg {...iconProps}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            );
        case 'phone':
            return (
                <svg {...iconProps}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
            );
        case 'award':
            return (
                <svg {...iconProps}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
            );
        default:
            return null;
    }
};

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        projectType: '',
        propertyType: '',
        timeline: '',
        budgetRange: '',
        paintingArea: '',
        message: '',
        howDidYouHear: '',
        website: ''
    });
    const [status, setStatus] = useState({
        type: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setStatus({ type: '', message: '' });

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/send-quote`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                trackLead({ service: formData.projectType });
                setStatus({
                    type: 'success',
                    message: 'Thank you for your request! We\'ll contact you within 24 hours with a detailed quote.'
                });
                setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    address: '',
                    projectType: '',
                    propertyType: '',
                    timeline: '',
                    budgetRange: '',
                    paintingArea: '',
                    message: '',
                    howDidYouHear: '',
                    website: ''
                });
            } else {
                setStatus({
                    type: 'error',
                    message: data.message || 'Something went wrong. Please try again.'
                });
            }
        } catch (error) {
            setStatus({
                type: 'error',
                message: 'Failed to send request. Please try again later.'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const trustBadges = [
        { icon: 'shield', text: 'Licensed & Insured' },
        { icon: 'award', text: claims.bbb },
        { icon: 'clock', text: '24hr Response' }
    ];

    const projectTypes = [
        'Interior Painting',
        'Exterior Painting',
        'Cabinet Refinishing',
        'Ceiling Services',
        'Pressure Washing',
        'Commercial Painting',
        'Other'
    ];

    const propertyTypes = [
        'Single Family Home',
        'Townhouse/Condo',
        'Apartment Complex',
        'Commercial Building',
        'Office Space',
        'Other'
    ];

    const timelines = [
        'ASAP',
        'Within 2 weeks',
        'Within 1 month',
        'Within 3 months',
        'No rush - just planning'
    ];

    const budgetRanges = [
        'Under $2,000',
        '$2,000 - $5,000',
        '$5,000 - $10,000',
        '$10,000 - $20,000',
        'Over $20,000'
    ];

    const labelClass = 'block text-slate-300 mb-2 font-sans-luxury font-semibold';
    const inputClass = 'w-full p-4 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-[#F5E6D3] focus:ring-2 focus:ring-[#F5E6D3]/40 transition-colors duration-300';

    return (
        <section id="quote" className="relative bg-white py-24 overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_80%,rgba(44,62,80,0.03),transparent_50%)]"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(245,230,211,0.05),transparent_50%)]"></div>

            {/* Decorative Lines */}
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#2C3E50]/20 to-transparent"></div>
            <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#2C3E50]/20 to-transparent"></div>

            {/* Animated Background Elements */}
            <div className="absolute inset-0">
                <motion.div
                    className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-[#2C3E50]/05 to-transparent rounded-full blur-3xl"
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
                    className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-r from-[#F5E6D3]/08 to-transparent rounded-full blur-3xl"
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
                    className="text-center mb-16"
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
                        <h2 className="font-serif-luxury text-5xl lg:text-8xl text-[#2C3E50] mb-8">
                            Get Your{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2C3E50] via-[#4A5F7F] to-[#2C3E50]">
                                Free Quote
                            </span>
                        </h2>
                    </motion.div>

                    <motion.p
                        className="font-sans-luxury text-2xl text-slate-600 max-w-4xl mx-auto leading-relaxed mb-8"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                    >
                        Transform your space with professional painting services. No hassle, no hidden fees—just exceptional results.
                    </motion.p>

                    {/* Trust Badges */}
                    <motion.div
                        className="flex flex-wrap justify-center gap-6 mb-8"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                    >
                        {trustBadges.map((badge, index) => (
                            <motion.div
                                key={index}
                                className="flex items-center space-x-3 bg-[#2C3E50] backdrop-blur-sm rounded-full px-6 py-3 border border-[#2C3E50] shadow-md"
                                whileHover={{ scale: 1.05, y: -2 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="text-[#F5E6D3]">
                                    <IconComponent iconType={badge.icon} />
                                </div>
                                <span className="font-sans-luxury font-semibold text-[#F5E6D3] text-sm lg:text-base">
                                    {badge.text}
                                </span>
                            </motion.div>
                        ))}
                    </motion.div>

                    <motion.div
                        className="w-40 h-1 bg-gradient-to-r from-transparent via-[#2C3E50] to-transparent mx-auto"
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, delay: 0.8 }}
                    />
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Quote Form */}
                    <motion.div
                        className="lg:col-span-2"
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                    >
                        <div className="bg-gradient-to-br from-[#2C3E50] via-[#34495e] to-[#2C3E50] backdrop-blur-sm rounded-3xl p-8 lg:p-12 border border-[#2C3E50]/30 shadow-2xl">
                            <div aria-live="polite">
                            {status.message && (
                                <motion.div
                                    className={`mb-6 p-4 rounded-2xl border ${
                                        status.type === 'success'
                                            ? 'bg-green-900/50 border-green-500/50 text-green-200'
                                            : 'bg-red-900/50 border-red-500/50 text-red-200'
                                    }`}
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <div className="flex items-center space-x-3">
                                        {status.type === 'success' ? (
                                            <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                        ) : (
                                            <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                            </svg>
                                        )}
                                        <span className="font-sans-luxury">{status.message}</span>
                                    </div>
                                </motion.div>
                            )}
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6 text-left">
                                {/* Honeypot: hidden from people, filled by bots, dropped by the API */}
                                <div aria-hidden="true" style={{ position: 'absolute', left: '-10000px', width: '1px', height: '1px', overflow: 'hidden' }}>
                                    <label htmlFor="website">Website</label>
                                    <input type="text" id="website" name="website" tabIndex={-1} autoComplete="off" value={formData.website} onChange={handleChange} />
                                </div>

                                <p className="font-sans-luxury text-slate-300 m-0">
                                    Takes about 30 seconds. We&apos;ll call or text to confirm details.
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label htmlFor="name" className={labelClass}>Name *</label>
                                        <input type="text" id="name" name="name" autoComplete="name" value={formData.name} onChange={handleChange} required className={inputClass} placeholder="Your name" disabled={isSubmitting} />
                                    </div>
                                    <div>
                                        <label htmlFor="phone" className={labelClass}>Phone *</label>
                                        <input type="tel" id="phone" name="phone" autoComplete="tel" inputMode="tel" value={formData.phone} onChange={handleChange} required className={inputClass} placeholder="(904) 555-0123" disabled={isSubmitting} />
                                    </div>
                                    <div>
                                        <label htmlFor="email" className={labelClass}>Email *</label>
                                        <input type="email" id="email" name="email" autoComplete="email" value={formData.email} onChange={handleChange} required className={inputClass} placeholder="you@example.com" disabled={isSubmitting} />
                                    </div>
                                    <div>
                                        <label htmlFor="projectType" className={labelClass}>Service *</label>
                                        <select id="projectType" name="projectType" value={formData.projectType} onChange={handleChange} required className={inputClass} disabled={isSubmitting}>
                                            <option value="">Choose a service</option>
                                            {projectTypes.map((type) => (
                                                <option key={type} value={type}>{type}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="md:col-span-2">
                                        <label htmlFor="address" className={labelClass}>Property address or ZIP *</label>
                                        <input type="text" id="address" name="address" autoComplete="street-address" value={formData.address} onChange={handleChange} required className={inputClass} placeholder="Street address, or just your ZIP" disabled={isSubmitting} />
                                    </div>
                                </div>

                                <details className="group rounded-xl border border-slate-600/60 bg-slate-800/30 open:bg-slate-800/40">
                                    <summary className="cursor-pointer select-none list-none px-5 py-4 font-sans-luxury font-semibold text-[#F5E6D3] flex items-center justify-between">
                                        Add project details (optional)
                                        <svg className="w-5 h-5 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </summary>
                                    <div className="px-5 pb-5 grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div>
                                            <label htmlFor="propertyType" className={labelClass}>Property type</label>
                                            <select id="propertyType" name="propertyType" value={formData.propertyType} onChange={handleChange} className={inputClass} disabled={isSubmitting}>
                                                <option value="">Select property type</option>
                                                {propertyTypes.map((type) => (
                                                    <option key={type} value={type}>{type}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label htmlFor="timeline" className={labelClass}>Timeline</label>
                                            <select id="timeline" name="timeline" value={formData.timeline} onChange={handleChange} className={inputClass} disabled={isSubmitting}>
                                                <option value="">Select timeline</option>
                                                {timelines.map((time) => (
                                                    <option key={time} value={time}>{time}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label htmlFor="paintingArea" className={labelClass}>Areas to paint</label>
                                            <input type="text" id="paintingArea" name="paintingArea" value={formData.paintingArea} onChange={handleChange} className={inputClass} placeholder="e.g. living room, exterior trim" disabled={isSubmitting} />
                                        </div>
                                        <div>
                                            <label htmlFor="budgetRange" className={labelClass}>Budget range</label>
                                            <select id="budgetRange" name="budgetRange" value={formData.budgetRange} onChange={handleChange} className={inputClass} disabled={isSubmitting}>
                                                <option value="">Select budget range</option>
                                                {budgetRanges.map((range) => (
                                                    <option key={range} value={range}>{range}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="md:col-span-2">
                                            <label htmlFor="howDidYouHear" className={labelClass}>How did you hear about us?</label>
                                            <select id="howDidYouHear" name="howDidYouHear" value={formData.howDidYouHear} onChange={handleChange} className={inputClass} disabled={isSubmitting}>
                                                <option value="">Select one</option>
                                                <option value="Google Search">Google Search</option>
                                                <option value="Facebook">Facebook</option>
                                                <option value="Referral">Friend/Family Referral</option>
                                                <option value="Nextdoor">Nextdoor App</option>
                                                <option value="Previous Customer">Previous Customer</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>
                                        <div className="md:col-span-2">
                                            <label htmlFor="message" className={labelClass}>Anything else we should know?</label>
                                            <textarea id="message" name="message" value={formData.message} onChange={handleChange} rows="4" className={`${inputClass} resize-none`} placeholder="Colors, surfaces, problem areas, best time to reach you..." disabled={isSubmitting} />
                                        </div>
                                    </div>
                                </details>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`w-full inline-flex h-16 items-center justify-center rounded-full bg-[#F5E6D3] px-10 font-sans-luxury font-bold text-[#1e293b] text-lg lg:text-xl shadow-xl transition-all duration-300 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F5E6D3] ${isSubmitting ? 'opacity-60 cursor-not-allowed' : ''}`}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Sending...
                                        </>
                                    ) : (
                                        'Get My Free Quote'
                                    )}
                                </button>
                            </form>
                        </div>
                    </motion.div>

                    {/* Contact Information Sidebar */}
                    <motion.div
                        className="space-y-8"
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                    >
                        {/* Phone Contact */}
                        <div className="bg-gradient-to-br from-[#F5E6D3] via-[#E8B4A0] to-[#F5E6D3] backdrop-blur-sm rounded-2xl p-8 border border-slate-700/30">
                            <div className="text-center">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-[#2C3E50]/20 rounded-full mb-4">
                                    <IconComponent iconType="phone" />
                                </div>
                                <h3 className="font-serif-luxury text-2xl text-[#2C3E50] mb-4">
                                    Prefer to Call?
                                </h3>
                                <p className="font-sans-luxury text-slate-700 mb-6">
                                    Speak directly with our team for immediate assistance and answers to your questions.
                                </p>
                                <motion.a
                                    href="tel:+19043850426"
                                    className="inline-flex items-center justify-center font-serif-luxury font-bold text-2xl text-[#2C3E50] hover:text-slate-600 transition-colors duration-300 no-underline"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    📞 (904) 385-0426
                                </motion.a>
                                <p className="font-sans-luxury text-sm text-slate-600 mt-4">
                                    Available Mon-Fri: 8AM-6PM<br />
                                    Saturday: 9AM-4PM
                                </p>
                            </div>
                        </div>

                        {/* Why Choose Us */}
                        <div className="bg-gradient-to-br from-[#2C3E50] via-[#34495e] to-[#2C3E50] backdrop-blur-sm rounded-2xl p-8 border border-[#2C3E50]/30 shadow-lg">
                            <h3 className="font-serif-luxury text-2xl text-[#F5E6D3] mb-6 text-center">
                                Why Choose LED Custom Painting?
                            </h3>
                            <div className="space-y-4">
                                {[
                                    'Free detailed estimates',
                                    `${claims.warranty} on all work`,
                                    'Licensed & fully insured',
                                    'A+ Better Business Bureau rating',
                                    `${claims.experience} of experience`,
                                    'Local North Florida company'
                                ].map((benefit, index) => (
                                    <motion.div
                                        key={index}
                                        className="flex items-center space-x-3"
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <div className="w-6 h-6 rounded-full bg-[#F5E6D3]/20 flex items-center justify-center flex-shrink-0">
                                            <svg className="w-4 h-4 text-[#F5E6D3]" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <span className="font-sans-luxury text-[#F5E6D3]">{benefit}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Response Time */}
                        <div className="bg-gradient-to-br from-[#F5E6D3] to-[#E8B4A0] backdrop-blur-sm rounded-2xl p-6 border border-[#2C3E50]/10 text-center shadow-md">
                            <div className="inline-flex items-center justify-center w-12 h-12 bg-white/80 rounded-full mb-4">
                                <IconComponent iconType="clock" />
                            </div>
                            <h4 className="font-serif-luxury text-lg text-[#2C3E50] mb-2">
                                Quick Response
                            </h4>
                            <p className="font-sans-luxury text-slate-700 text-sm">
                                We&apos;ll contact you within 24 hours with your detailed quote
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Contact;
