/**
 * Company contact information glass cards.
 * Location: client/src/components/Contact/ContactInfo.jsx
 */
import { useApp } from '@context/AppProvider';

const ContactInfo = () => {
  const { contact, mapLink } = useApp();

  const items = [
    {
      icon: 'bi-geo-alt-fill',
      title: 'Office Address',
      content: (
        <a
          href={mapLink}
          target="_blank"
          rel="noopener noreferrer"
          className="contact-info__link"
        >
          {contact.address.full}
        </a>
      ),
    },
    {
      icon: 'bi-telephone-fill',
      title: 'Phone Numbers',
      content: contact.phones.map((phone) => (
        <a
          key={phone}
          href={`tel:+${phone.replace(/\D/g, '')}`}
          className="contact-info__link"
        >
          {phone}
        </a>
      )),
    },
    {
      icon: 'bi-envelope-fill',
      title: 'Email',
      content: (
        <a href={contact.emailMailto} className="contact-info__link">
          {contact.email}
        </a>
      ),
    },
    {
      icon: 'bi-whatsapp',
      title: 'WhatsApp',
      content: (
        <a
          href={contact.whatsapp.fullUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="contact-info__link contact-info__link--whatsapp"
        >
          Chat on WhatsApp
        </a>
      ),
    },
    {
      icon: 'bi-clock-fill',
      title: 'Business Hours',
      content: (
        <>
          <p className="contact-info__text mb-1">{contact.workingHours.days}</p>
          <p className="contact-info__text mb-1">{contact.workingHours.time}</p>
          <p className="contact-info__emergency">{contact.workingHours.emergency}</p>
        </>
      ),
    },
  ];

  return (
    <div className="contact-info">
      <div className="contact-info__header" data-aos="fade-up">
        <h2 className="contact-info__title">Get In Touch</h2>
        <p className="contact-info__subtitle">
          Reach out for industrial optical alignment, machinery installation, or surveying inquiries.
        </p>
      </div>

      <div className="contact-info__grid">
        {items.map((item, index) => (
          <div
            key={item.title}
            className="contact-info__card glass-card"
            data-aos="fade-up"
            data-aos-delay={index * 80}
          >
            <div className="contact-info__icon">
              <i className={`bi ${item.icon}`} aria-hidden="true" />
            </div>
            <h3 className="contact-info__card-title">{item.title}</h3>
            <div className="contact-info__card-body">{item.content}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContactInfo;
