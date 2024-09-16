import React from 'react';

const Services = () => {
    const services = [
        {
            title: 'Interior Painting',
            description: 'Transform your indoor spaces with expert painting.',
            icon: '🎨',
        },
        {
            title: 'Exterior Painting',
            description: `Enhance your home's curb appeal with fresh paint.`,
            icon: '🏠',
        },
        {
            title: 'Pressure Washing',
            description: 'Restore surfaces to their original beauty.',
            icon: '💦',
        },
        {
            title: 'Cabinet Refinishing',
            description: 'Give your cabinets a fresh, updated look.',
            icon: '🚪',
        },
        {
            title: 'Popcorn Ceiling Removal',
            description: 'Modernize your ceilings for a sleek appearance.',
            icon: '🔨',
        },
        {
            title: 'Knockdown Ceiling Texture',
            description: 'Add subtle texture for a modern ceiling finish.',
            icon: '🖌️',
        },
    ];

    return (
        <section id="services" className="bg-white pb-8 text-center">
            <div className="mx-auto">
                <div className="flex flex-col lg:flex-row justify-center lg:items-center gap-8">
                    <div className="flex justify-center w-screen lg:w-2/3 mb-0 lg:mb-0">
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
                        <h2 className="poppins-bold text-4xl lg:text-5xl text-slate-700 pt-0 lg:pt-6 mb-6 lg:mb-4 w-full">Our Services</h2>
                        <div className="flex flex-wrap justify-center gap-6">
                            {services.map((service, index) => (
                                <div key={index} className="bg-slate-400 rounded-lg shadow-lg p-4 w-80 text-center">
                                    <div className="text-5xl mb-4">{service.icon}</div>
                                    <h3 className="text-xl text-slate-700 poppins-semibold mb-2">{service.title}</h3>
                                    <p className="text-sm poppins-regular text-white">{service.description}</p>
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