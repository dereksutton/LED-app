import React from 'react';

const Services = () => {
    const services = [
        {
            title: 'Residential Painting',
            description: 'Interior and exterior painting for homes.',
            icon: '🏠',
        },
        {
            title: 'Commercial Painting',
            description: 'Painting services for offices and commercial spaces.',
            icon: '🏢',
        },
        {
            title: 'Custom Finishes',
            description: 'Unique finishes to give your walls a special look.',
            icon: '🎨',
        },
    ];

    return (
        <section id="services" className="bg-gray-100 py-16 text-center">
            <div className="container mx-auto px-4">
                <h2 className="text-4xl font-bold mb-8">Our Services</h2>
                <div className="flex flex-wrap justify-center gap-8">
                    {services.map((service, index) => (
                        <div key={index} className="bg-white rounded-lg shadow-lg p-6 w-72 text-center">
                            <div className="text-5xl mb-4">{service.icon}</div>
                            <h3 className="text-2xl font-semibold mb-2">{service.title}</h3>
                            <p className="text-gray-700">{service.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Services;