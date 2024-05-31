import React from 'react';
import ledWhyUs from '../assets/LED-WhyUs.png';

const WhyUs = () => {
  return (
    <section id="whyus" className="bg-white">
      <div className="w-screen mx-auto">
        <div className="flex flex-col lg:flex-row items-center justify-center">
          <div className="lg:w-1/2 w-full lg:pr-24 mb-8 lg:mb-0 flex flex-col items-center justify-center">
            <h1 className="poppins-bold text-slate-700 text-4xl lg:text-5xl text-center mt-4 mb-6">
              Why Work With Us?
            </h1>
            <p className="w-4/5 text-slate-400 text-lg leading-relaxed text-center">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam ac
              venenatis erat. Donec et lacus vitae elit dignissim aliquet. Fusce
              dapibus quam in ullamcorper suscipit. Integer non libero at lorem
              bibendum ultricies. Praesent finibus, lorem in commodo malesuada,
              ligula risus tristique sapien, eu suscipit nisi ante a erat.
              Aliquam erat volutpat.
            </p>
          </div>
          <div className="lg:w-1/2 w-screen">
            <img
              src={ledWhyUs}
              alt="Why Work With Us"
              className="w-full h-auto lg:h-full lg:object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyUs;
