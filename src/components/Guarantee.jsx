import React from 'react';
import { Check, Shield, ThumbsUp } from 'lucide-react';

const Guarantee = () => {
    const guaranteePoints = [
        {
            title: "Quality Assurance",
            description: "We pledge to provide expert service with attention to detail, ensuring your complete satisfaction.",
            icon: <Check className="text-yellow-400" size={44} />
        },
        {
            title: "3-Year Warranty",
            description: "Our work comes with a transferable 3-year warranty, protecting against peeling, bubbling, cracking, or splitting.",
            icon: <Shield className="text-yellow-400" size={44} />
        },
        {
            title: "Transparent Pricing",
            description: "Free estimates, no hidden fees, and a commitment to punctuality and excellent service.",
            icon: <ThumbsUp className="text-yellow-400" size={44} />
        }
    ];

    return (
        <section id="guarantee" className="bg-slate-700 py-10 px-4 md:px-8">
            <div className="max-w-7xl mx-auto">
                <h2 className="poppins-bold brand-gold text-5xl lg:text-7xl text-center">Our Guarantee</h2>
                
                {/* Main container with adjusted spacing */}
                <div className="flex flex-col lg:flex-row items-center">
                    {/* Cards Container - reduced width on desktop */}
                    <div className="flex flex-col lg:flex-row gap-8 justify-center items-center lg:items-stretch lg:w-11/12">
                        {guaranteePoints.map((point, index) => (
                            <div key={index} className="bg-slate-400 rounded-xl p-4 shadow-lg flex flex-col items-center text-center w-80 lg:w-2/3">
                                <div className="mb-4">
                                    {point.icon}
                                </div>
                                <h3 className="text-slate-700 poppins-semibold text-2xl mb-3">{point.title}</h3>
                                <p className="text-white poppins-regular text-xl">{point.description}</p>
                            </div>
                        ))}
                    </div>
                    
                    {/* Lottie Container - significantly larger on desktop */}
                    <div className="w-full lg:w-1/2 h-[250px] lg:h-[400px] flex justify-center items-center mt-16 mb-6">
                        <dotlottie-player 
                            src="https://lottie.host/270a8cfb-e098-4d3c-990f-5b197bb0b585/XlgEY5DXZY.json" 
                            background="transparent" 
                            speed="1" 
                            style={{ 
                                width: '100%',
                                height: '100%',
                                minWidth: '350px',
                                minHeight: '350px',
                            }}
                            className="lg:scale-150"
                            loop 
                            autoplay
                        ></dotlottie-player>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Guarantee;