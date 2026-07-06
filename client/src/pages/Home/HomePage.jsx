/**
 * Home Page
 * Location: client/src/pages/Home/HomePage.jsx
 */
import Hero from '@components/Hero';
import { HomeAboutPreview } from '@components/Home';
import Services from '@components/Services';
import Clients from '@components/Clients';
import Projects from '@components/Projects';
import Gallery from '@components/Gallery';
import Testimonials from '@components/Testimonials';
import Contact from '@components/Contact';

const HomePage = () => (
  <>
    <Hero />
    <HomeAboutPreview />
    <Services variant="home" />
    <Clients variant="home" />
    <Projects variant="home" />
    <Gallery variant="home" />
    <Testimonials />
    <Contact showMap />
  </>
);

export default HomePage;
