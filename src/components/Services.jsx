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
        {
            title: 'Cabinet Refinishing',
            description: 'We redo the finish on your cabinets.',
            icon: '🖌️'
        },
        {
            title: 'Cabinet Refinishing',
            description: 'We redo the finish on your cabinets.',
            icon: '🖌️'
        },
        {
            title: 'Cabinet Refinishing',
            description: 'We redo the finish on your cabinets.',
            icon: '🖌️'
        },
    ];

    return (
        <section id="services" className="bg-gray-100 pb-8 text-center">
            <div className="mx-auto">
                <div className="flex flex-col lg:flex-row justify-center lg:items-center gap-8">
                    <div className="flex justify-center w-full lg:w-2/3 mb-0 lg:mb-0">
                        <dotlottie-player 
                            src="https://lottie.host/2250bca4-7b80-483f-930e-5b2384312c4b/g852b9giyz.json" 
                            background="transparent" 
                            speed="1" 
                            style={{ width: '100%', maxWidth: '600px', height: 'auto' }} 
                            loop 
                            autoplay>
                        </dotlottie-player>
                    </div>
                    <div className="flex flex-wrap w-full lg:w-full items-center">
                        <h2 className="poppins-bold text-5xl lg:text-5xl text-slate-700 pt-10 mb-6 w-full">Our Services</h2>
                        <div className="flex flex-wrap justify-center gap-6">
                            {services.map((service, index) => (
                                <div key={index} className="bg-white rounded-lg shadow-lg p-4 w-72 lg:w-72 text-center">
                                    <div className="text-5xl mb-4">{service.icon}</div>
                                    <h3 className="text-2xl font-semibold mb-2">{service.title}</h3>
                                    <p className="text-gray-700">{service.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Services;
