import React, { useState } from 'react';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
	phone: '',
        message: '',
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
            const response = await fetch('/send-quote', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                setStatus({
                    type: 'success',
                    message: 'Thank you for your message! We\'ll get back to you soon.'
                });
                setFormData({ name: '', email: '', message: '' });
            } else {
                setStatus({
                    type: 'error',
                    message: data.message || 'Something went wrong. Please try again.'
                });
            }
        } catch (error) {
            setStatus({
                type: 'error',
                message: 'Failed to send message. Please try again later.'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section id="quote" className="bg-slate-700 p-3 pb-12 text-center">
            <div className="container mx-auto px-1">
                <h2 className="poppins-bold brand-gold text-5xl lg:text-7xl">Quote Request</h2>
                <p className="poppins-regular text-2xl lg:text-4xl text-white pb-8">No hassle. No hidden fees.</p>
                
                {status.message && (
                    <div className={`max-w-lg mx-auto mb-6 p-4 rounded-lg ${
                        status.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                        {status.message}
                    </div>
                )}
                
                <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-slate-400 rounded-lg shadow-lg p-8 space-y-6">
                    <div className="form-group">
                        <label htmlFor="name" className="block text-left text-slate-700 mb-2 text-xl poppins-semibold">Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full p-3 border border-gray-300 rounded-lg"
                            disabled={isSubmitting}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email" className="block text-left text-slate-700 mb-2 text-xl poppins-semibold">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full p-3 border border-gray-300 rounded-lg"
                            disabled={isSubmitting}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email" className="block text-left text-slate-700 mb-2 text-xl poppins-semibold">Phone</label>
                        <input
                            type="number"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                            className="w-full p-3 border border-gray-300 rounded-lg"
                            disabled={isSubmitting}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="message" className="block text-left text-slate-700 mb-2 text-xl poppins-semibold">Tell Us About Your Project</label>
                        <textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            rows="5"
                            required
                            className="w-full p-3 border border-gray-300 rounded-lg"
                            disabled={isSubmitting}
                        />
                    </div>
                    <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className={`inline-flex h-20 sm:h-22 lg:h-24 animate-shimmer items-center justify-center rounded-md border border-yellow-400
                            bg-[linear-gradient(110deg,#FFD700,45%,#FFA500,55%,#FFD700)] bg-[length:200%_100%] 
                            px-8 sm:px-10 md:px-12 lg:px-16 py-4 sm:py-5 poppins-bold text-slate-700 text-3xl sm:text-4xl lg:text-4xl
                            w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg
                            transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105
                            focus:outline-none focus:ring-0 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-yellow-50
                            shadow-lg hover:shadow-2xl ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}>
                        {isSubmitting ? 'Sending...' : 'Send Message'}
                    </button>
                </form>
                <span>
                    <p className="poppins-regular text-2xl lg:text-3xl text-white p-5">
                        Or call us today at:
                    </p>
                </span>
                <span className="brand-gold">
                    <a href="tel:+19043850426" className="hover:text-white text-4xl lg:text-5xl poppins-bold no-underline transition-colors duration-300">
                        📞 (904) 385-0426
                    </a>
                </span>
            </div>
        </section>
    );
};

export default Contact;
