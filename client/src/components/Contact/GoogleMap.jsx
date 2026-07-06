/**
 * Google Maps embed — URL editable via Admin Panel / env.
 * Location: client/src/components/Contact/GoogleMap.jsx
 */
import { useApp } from '@context/AppProvider';

const GoogleMap = () => {
  const { mapEmbedUrl } = useApp();

  return (
    <div className="google-map" data-aos="fade-up">
      <div className="google-map__header text-center mb-4">
        <span className="section-label">Find Us</span>
        <h2 className="section-title">Our Location</h2>
      </div>
      <div className="google-map__frame glass-card">
        <iframe
          src={mapEmbedUrl}
          title="Shukla Industrial Optical Alignment — Office Location"
          className="google-map__iframe"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
    </div>
  );
};

export default GoogleMap;
