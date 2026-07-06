/**
 * Full contact section — info, form, and map.
 * Location: client/src/components/Contact/Contact.jsx
 */
import ContactInfo from './ContactInfo';
import ContactForm from './ContactForm';
import GoogleMap from './GoogleMap';
import './Contact.css';

const Contact = ({ showMap = true }) => (
  <section className="contact section-padding" id="contact" aria-label="Contact us">
    <div className="container-custom">
      <div className="row g-5 align-items-start">
        <div className="col-lg-5">
          <ContactInfo />
        </div>
        <div className="col-lg-7">
          <ContactForm />
        </div>
      </div>

      {showMap && (
        <div className="contact__map-wrap">
          <GoogleMap />
        </div>
      )}
    </div>
  </section>
);

export default Contact;
