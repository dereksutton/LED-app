import React from 'react';
import { Shield, Check } from 'lucide-react';

const Guarantee = () => {
    const guarantees = [
        "A dedicated project manager",
        "Comprehensive color recommendations",
        "Proper product selection",
        "Intensive procedures for masking, covering, and protecting your space",
        "Nothing but sharp lines",
        "Full coverage",
        "No missed spots",
        "A clean job site once we've finished"
    ];

    return (
        <section id="guarantee" className="bg-slate-800 py-20 px-4 md:px-8">
            <div className="max-w-6xl mx-auto">
                <h2 className="poppins-bold text-white text-4xl lg:text-5xl text-center mb-16">Our Guarantee</h2>
                
                <div className="flex flex-col lg:flex-row gap-12">
                    <div className="lg:w-1/2 bg-slate-700 rounded-xl p-8 shadow-lg">
                        <h3 className="text-white text-2xl font-bold mb-6">We pledge to provide:</h3>
                        <ul className="space-y-4">
                            {guarantees.map((item, index) => (
                                <li key={index} className="flex items-start">
                                    <Check className="text-yellow-400 mr-3 mt-1 flex-shrink-0" size={24} />
                                    <span className="text-slate-200 text-lg">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    
                    <div className="lg:w-1/2 space-y-8">
                        <div className="bg-white rounded-xl p-8 shadow-lg">
                            <h3 className="text-slate-800 text-2xl font-bold mb-4 flex items-center">
                                <Shield className="text-yellow-500 mr-3" size={28} />
                                Our Warranty
                            </h3>
                            <p className="text-slate-600 text-lg leading-relaxed">
                                All of our work comes with a three-year warranty, providing extra protection should peeling, bubbling, cracking, or splitting occur due to improper prep or application on our part.
                            </p>
                            <p className="text-slate-600 text-lg mt-4 font-semibold">
                                Even better? Our warranty is transferable between homeowners.
                            </p>
                        </div>
                        
                        <div className="bg-yellow-400 rounded-xl p-8 shadow-lg">
                            <h3 className="text-slate-800 text-2xl font-bold mb-6">Free Estimates. No Hidden Fees.</h3>
                            <ul className="space-y-4">
                                <li className="flex items-start">
                                    <Check className="text-slate-800 mr-3 mt-1 flex-shrink-0" size={24} />
                                    <span className="text-slate-800 text-lg">We strive to always be on time and provide excellent quality service.</span>
                                </li>
                                <li className="flex items-start">
                                    <Check className="text-slate-800 mr-3 mt-1 flex-shrink-0" size={24} />
                                    <span className="text-slate-800 text-lg">All of our estimates are free and sent the same day or in the next 24 hours or less.</span>
                                </li>
                                <li className="flex items-start">
                                    <Check className="text-slate-800 mr-3 mt-1 flex-shrink-0" size={24} />
                                    <span className="text-slate-800 text-lg">We never have any hidden costs or fees.</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Guarantee;