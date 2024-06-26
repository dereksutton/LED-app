import React, { useState } from 'react';
import emailjs from 'emailjs-com';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const serviceID = 'service_ejza0lp'; // Your EmailJS service ID
        const templateID = 'template_95zj3ls'; // Your EmailJS template ID
        const userID = 'l0Wxgq4RwYuDMgXZJ'; // Your EmailJS Public Key

        const emailParams = {
            from_name: formData.name,
            from_email: formData.email, // User's email
            to_email: 'dsutton@visioneerprints.com', // Your verified email address
            reply_to: formData.email, // Set the reply-to field to user's email
            message: formData.message,
        };

        emailjs.send(serviceID, templateID, emailParams, userID)
            .then((result) => {
                alert('Thank you for your message!');
                setFormData({ name: '', email: '', message: '' });
            }, (error) => {
                console.error('Failed to send email. Error: ', error);
                alert('An error occurred. Please try again.');
            });
    };

    return (
        <section id="quote" className="bg-slate-700 py-16 text-center">
            <div className="container mx-auto px-4">
                <h2 className="poppins-bold brand-gold text-4xl lg:text-5xl">Quote Request Form</h2>
                <p className="poppins-regular text-lg lg:text-xl text-white pb-6">No hassle. No hidden fees.</p>
                <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-slate-400 rounded-lg shadow-lg p-8 space-y-6">
                    <div className="form-group">
                        <label htmlFor="name" className="block text-left text-slate-700 mb-2 font-semibold">Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full p-3 border border-gray-300 rounded-lg"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email" className="block text-left text-slate-700 mb-2 font-semibold">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full p-3 border border-gray-300 rounded-lg"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="message" className="block text-left text-slate-700 mb-2 font-semibold">Tell Us About Your Project</label>
                        <textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            rows="5"
                            required
                            className="w-full p-3 border border-gray-300 rounded-lg"
                        />
                    </div>
                    <button type="submit" className="inline-flex h-12 sm:h-12 md:h-12 animate-shimmer items-center justify-center rounded-md border border-yellow-400
                        bg-[linear-gradient(110deg,#FFD700,45%,#FFA500,55%,#FFD700)] bg-[length:200%_100%] px-4 sm:px-5 md:px-6 poppins-bold text-slate-700 text-3xl sm:text-3xl md:text-3xl
                        transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105
                        focus:outline-none focus:ring-0 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-yellow-50
                        shadow-lg hover:shadow-2xl">Send Message</button>
                </form>
            </div>
        </section>
    );
};

export default Contact;
