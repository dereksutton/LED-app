import Hero from '../src/components/Hero';
import Services from '../src/components/Services';
import About from '../src/components/About';
import WhyUs from '../src/components/WhyUs';
import Portfolio from '../src/components/Portfolio';
import Guarantee from '../src/components/Guarantee';
import Testimonials from '../src/components/Testimonials';
import Contact from '../src/components/Contact';
import Footer from '../src/components/Footer';

export default function Home() {
  return (
    <>
      <Hero />
      <main>
        <Services />
        <About />
        <WhyUs />
        <Portfolio />
        <Guarantee />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
