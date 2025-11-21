import React from 'react';
import { HelmetProvider } from 'react-helmet-async';
import Hero from './components/Hero';
import Services from './components/Services';
import About from './components/About';
import WhyUs from './components/WhyUs';
import Portfolio from './components/Portfolio';
import Guarantee from './components/Guarantee';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';
import Footer from './components/Footer';
import SEO from './components/SEO';
import './App.css';

function App() {
  return (
    <HelmetProvider>
      <SEO />
      <Hero />
      <Services />
      <About />
      <WhyUs />
      <Portfolio />
      <Guarantee />
      <Testimonials />
      <Contact />
      <Footer />
    </HelmetProvider>
  );
}

export default App;

