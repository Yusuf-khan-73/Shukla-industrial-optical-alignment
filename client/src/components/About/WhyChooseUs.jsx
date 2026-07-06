/**
 * Why Choose Us feature grid.
 * Location: client/src/components/About/WhyChooseUs.jsx
 */
import SectionHeader from './SectionHeader';
import { WHY_CHOOSE_US } from './aboutData';

const WhyChooseUs = () => (
  <div className="about-why">
    <SectionHeader
      centered
      label="Why Choose Us"
      title="The Shukla Industrial Advantage"
      subtitle="What sets us apart in industrial optical alignment and paper mill engineering."
    />

    <div className="about-why__grid">
      {WHY_CHOOSE_US.map((item, index) => (
        <article
          key={item.title}
          className="about-why__card hover-lift"
          data-aos="fade-up"
          data-aos-delay={index * 60}
        >
          <div className="about-why__icon">
            <i className={`bi ${item.icon}`} aria-hidden="true" />
          </div>
          <h3 className="about-why__title">{item.title}</h3>
          <p className="about-why__desc">{item.description}</p>
        </article>
      ))}
    </div>
  </div>
);

export default WhyChooseUs;
