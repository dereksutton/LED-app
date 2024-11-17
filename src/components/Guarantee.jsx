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
        <section id="guarantee" className="bg-slate-700 py-12 px-4 md:px-8">
            <div className="max-w-7xl mx-auto">
                <h2 className="poppins-bold brand-gold text-4xl lg:text-5xl text-center mb-8">Our Guarantee</h2>
                
                <div className="flex flex-col lg:flex-row justify-center items-center lg:items-stretch gap-8">
                    <div className="flex flex-col lg:flex-row gap-8 justify-center items-center lg:items-stretch">
                        {guaranteePoints.map((point, index) => (
                            <div key={index} className="bg-slate-400 rounded-xl p-6 shadow-lg flex flex-col items-center text-center w-80">
                                <div className="mb-4">
                                    {point.icon}
                                </div>
                                <h3 className="text-slate-700 poppins-semibold text-xl mb-3">{point.title}</h3>
                                <p className="text-white poppins-regular text-lg">{point.description}</p>
                            </div>
                        ))}
                    </div>
                    
                    <div className="lg:w-1/3 flex justify-center items-center">
                        <dotlottie-player 
                            src="https://lottie.host/270a8cfb-e098-4d3c-990f-5b197bb0b585/XlgEY5DXZY.json" 
                            background="transparent" 
                            speed="1" 
                            style={{ width: '100%', maxWidth: '600px' }} 
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