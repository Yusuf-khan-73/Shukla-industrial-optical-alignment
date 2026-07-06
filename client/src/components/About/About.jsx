/**
 * About section — home page & reusable blocks.
 * Location: client/src/components/About/About.jsx
 */
import AboutStory from './AboutStory';
import MissionVision from './MissionVision';
import AboutTimeline from './AboutTimeline';
import WhyChooseUs from './WhyChooseUs';
import './About.css';

const About = () => (
  <section className="about section-padding" id="about" aria-label="About us">
    <div className="container-custom">
      <AboutStory />

      <div className="about__mv-wrap">
        <MissionVision />
      </div>

      <div className="about__timeline-wrap">
        <AboutTimeline />
      </div>

      <div className="about__why-wrap">
        <WhyChooseUs />
      </div>
    </div>

    <div className="about__bg-shape about__bg-shape--1" aria-hidden="true" />
    <div className="about__bg-shape about__bg-shape--2" aria-hidden="true" />
  </section>
);

export default About;
