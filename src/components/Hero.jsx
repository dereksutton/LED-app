import React from 'react';

const Hero = () => {
    // Define the background styles directly in the component for high specificity
    const sectionStyle = {
        backgroundImage: "url('/src/assets/paintedhome2.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        width: '100%',
        height: '100vh', // Use viewport height to explicitly set the height
        position: 'relative', // Ensure relative positioning for absolute children
    };

    return (
        <section style={sectionStyle} className="text-white">
            {/* Overlay div with shading that only affects the background image */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.5)', // Use RGBA for direct color and opacity control
                zIndex: 1 // Ensure this is below the content
            }}></div>
            {/* Content needs to be outside the overlay in the DOM structure */}
            <div style={{ position: 'relative', zIndex: 2, height: '100%' }}>
                {/* Top bar with logo and navigation */}
                <div className="flex justify-between items-center p-0">
                    <img src="/src/assets/LED-logo.png" alt="LED Custom Painting Logo" className="h-48 pl-10" />
                    <nav>
                        <ul className="flex space-x-6 pr-10 text-lg">
                            <li><a href="#services" className="hover:text-gray-300">Services</a></li>
                            <li><a href="#testimonials" className="hover:text-gray-300">Testimonials</a></li>
                            <li><a href="#contact" className="hover:text-gray-300">Contact</a></li>
                        </ul>
                    </nav>
                </div>
                {/* Centered content */}
                <div className="flex flex-col items-center justify-center h-full pb-48">
                    <h1 className="text-4xl font-bold mb-2">Professional Painting Services</h1>
                    <p className="text-xl mb-6">Transform Your Space with Quality and Precision</p>
                    <button 
                        className="inline-flex h-12 animate-shimmer items-center justify-center rounded-md border border-yellow-700 
                        bg-[linear-gradient(110deg,#FFD700,45%,#FFA500,55%,#FFD700)] bg-[length:200%_100%] px-6 font-bold text-slate-700 text-2xl 
                        transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 
                        focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-yellow-50
                        shadow-lg hover:shadow-2xl"
                    >
                    Get a Free Quote
                    </button>


                </div>
            </div>
        </section>
    );
};

export default Hero;





