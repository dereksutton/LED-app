import React from 'react';

const Testimonials = () => {
    const testimonials = [
        {
            name: 'John Doe',
            feedback: 'Outstanding service and quality work! Highly recommended.',
            location: 'New York, NY',
        },
        {
            name: 'Jane Smith',
            feedback: 'The team was professional and the results were fantastic.',
            location: 'Los Angeles, CA',
        },
        {
            name: 'Peter Johnson',
            feedback: 'Great experience from start to finish. Will hire again!',
            location: 'Chicago, IL',
        },
    ];

    return (
        <section id="testimonials" className="bg-white py-16 text-center">
            <div className="container mx-auto px-4">
                <h2 className="poppins-bold text-slate-700 text-5xl lg:text-5xl">What Our Clients Say</h2>
                <div className="flex flex-wrap justify-center gap-8">
                    {testimonials.map((testimonial, index) => (
                        <div key={index} className="bg-gray-100 rounded-lg shadow-lg p-6 w-72 text-center">
                            <p className="text-gray-700 mb-4">"{testimonial.feedback}"</p>
                            <h4 className="text-xl font-semibold">{testimonial.name}</h4>
                            <span className="text-gray-500">{testimonial.location}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;