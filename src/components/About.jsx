import React from 'react';

const About = () => {
    return (
        <section id="about" className="mx-auto w-4/5 lg:w-1/3 mb-8">
           <h1 className="poppins-bold text-slate-700 text-4xl lg:text-5xl">Our Story</h1>
           <div className="flex justify-center items-center">
                <p className="lg:w:1/3 poppins-regular text-slate-400">Here at <span className="poppins-bold text-slate-700">LED</span>, we believe the experience you have is equally as important as the final results. 
                    We pride ourselves in taking the <span className="poppins-bold text-slate-700">"PAIN"</span> out of Painting!
                    <br/>
                    <br/>
                    Serving <span className="poppins-bold text-slate-700">North Florida</span> since 2011, we are a Professional Painting Company specializing in <span className="poppins-bold text-slate-700">Residential & Commercial Painting Services</span>,
                    <span className="poppins-bold text-slate-700"> Parking Lot Striping</span>, <span className="poppins-bold text-slate-700">Popcorn Ceiling Removal</span> & much more.
                    <br/>
                    <br/>
                    Whether you are painting the Interior or Exterior of your home or business, line striping your parking lot, etc. - we will work with 
                    you around your schedule & budget to get your project done <span className="poppins-bold text-slate-700">efficiently</span> & <span className="poppins-bold text-slate-700">properly.</span>
                </p>
            </div>
        </section>
    );
}

export default About;