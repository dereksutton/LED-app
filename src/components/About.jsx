import React from 'react';

const About = () => {
    return (
        <section className="bg-slate-700 py-4">
            <div id="about" className="mx-auto w-4/5 lg:w-1/3 pb-8 pt-4 lg:pt-2">
                <h1 className="poppins-bold brand-gold text-5xl lg:text-4xl">Our Story</h1>
                <div className="flex justify-center items-center">
                    <p className="lg:w:1/3 poppins-regular text-white text-xl lg:text-lg">Here at <span className="poppins-bold brand-gold">LED</span>, we believe the experience you have is equally as important as the final results. 
                        We pride ourselves in taking the <span className="poppins-bold brand-gold">"PAIN"</span> out of Painting!
                        <br/>
                        <br/>
                        Serving <span className="poppins-bold brand-gold">North Florida</span> since 2011, we are a Professional Painting Company specializing in <span className="poppins-bold brand-gold">Residential & Commercial Painting Services</span>,
                        <span className="poppins-bold brand-gold"> Parking Lot Striping</span>, <span className="poppins-bold brand-gold">Popcorn Ceiling Removal</span> & much more.
                        <br/>
                        <br/>
                        Whether you are painting the Interior or Exterior of your home or business, line striping your parking lot, etc. - we will work with 
                        you around your schedule & budget to get your project done <span className="poppins-bold brand-gold">efficiently</span> & <span className="poppins-bold brand-gold">properly.</span>
                    </p>
                </div>
            </div>
        </section>
    );
}

export default About;