/**
 * Contact Page
 * Location: client/src/pages/Contact/ContactPage.jsx
 */
import PageHero from '@components/Layout/PageHero';
import Contact from '@components/Contact';

const ContactPage = () => (
  <>
    <PageHero
      title="Contact Us"
      subtitle="Get in touch for industrial optical alignment, theodolite surveying, and precision measurement services."
      breadcrumbs={[{ label: 'Contact' }]}
    />
    <Contact showMap />
  </>
);

export default ContactPage;
