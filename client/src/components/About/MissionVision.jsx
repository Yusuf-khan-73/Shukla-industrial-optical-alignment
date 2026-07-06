/**
 * Mission and Vision glass cards.
 * Location: client/src/components/About/MissionVision.jsx
 */
import { MISSION_VISION } from './aboutData';

const MissionVision = () => (
  <div className="about-mv">
    <div className="row g-4">
      {Object.values(MISSION_VISION).map((item, index) => (
        <div key={item.title} className="col-md-6" data-aos="fade-up" data-aos-delay={index * 100}>
          <article className="about-mv__card glass-card hover-lift">
            <div className="about-mv__icon">
              <i className={`bi ${item.icon}`} aria-hidden="true" />
            </div>
            <h3 className="about-mv__title">{item.title}</h3>
            <p className="about-mv__text">{item.text}</p>
          </article>
        </div>
      ))}
    </div>
  </div>
);

export default MissionVision;
