/**
 * Shukla Industrial — Application Constants
 * Location: client/src/utils/constants.js
 *
 * Central source of truth for company info, navigation, and contact details.
 * Values marked as admin-editable will be overridden by API data in later modules.
 */

export const OFFICE_ADDRESS =
  'A302 Sushanti Co. Op. Housings Society Koppal Road GIDC Vapi Valsad 396195';

/** Google Maps place page — open in new tab */
export const MAP_LINK =
  'https://www.google.com/maps/place/Sushanti+Housing+Society,+near+Amba+Mata+Mandir,+Housing+Sector,+GIDC,+Chharwada,+Vapi,+Gujarat+396191/@20.3787777,72.9261012,654m/data=!3m2!1e3!4b1!4m6!3m5!1s0x3be0ce4b2fd124cb:0xff6c5955d1b4310d!8m2!3d20.3787777!4d72.9261012!16s%2Fg%2F11vc6ht2xk!18m1!1e1?entry=ttu';

/** Google Maps iframe embed — Sushanti Housing Society, Vapi */
export const MAP_EMBED_URL =
  import.meta.env.VITE_GOOGLE_MAPS_EMBED_URL ||
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7521.4!2d72.9261012!3d20.3787777!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be0ce4b2fd124cb%3A0xff6c5955d1b4310d!2sSushanti%20Housing%20Society!5e0!3m2!1sen!2sin!4v1';

export const COMPANY = {
  name: 'SHUKLA INDUSTRIAL OPTICAL ALIGNMENT',
  shortName: 'Shukla Industrial',
  tagline: 'Precision • Accuracy • Reliability',
  experience: '18+',
  experienceLabel: 'Years of Excellence',
  description:
    'Leading provider of Industrial Optical Alignment, Theodolite Alignment, Industrial Surveying, and Paper Mill Alignment Projects across India with 18+ years of proven expertise.',
  foundedYear: 2006,
};

export const CONTACT = {
  phones: ['+91 9510900608', '+91 8707305703'],
  phoneRaw: ['919510900608', '918707305703'],
  primaryPhone: '+91 9510900608',
  primaryPhoneTel: 'tel:+919510900608',
  secondaryPhoneTel: 'tel:+918707305703',
  email: 'sioaw98@yahoo.com',
  emailMailto:
    'mailto:sioaw98@yahoo.com?subject=Industrial%20Optical%20Alignment%20Inquiry&body=Hello%2C%0A%0AI%20visited%20your%20website%20and%20would%20like%20to%20know%20more%20about%20your%20Industrial%20Optical%20Alignment%20Services.%0A%0APlease%20contact%20me.%0A%0AThank%20You.',
  whatsapp: {
    url: 'https://wa.me/919510900608',
    message:
      'Hello,\nI visited your website and would like to know more about your Industrial Optical Alignment Services.',
    fullUrl:
      'https://wa.me/919510900608?text=Hello%2C%0AI%20visited%20your%20website%20and%20would%20like%20to%20know%20more%20about%20your%20Industrial%20Optical%20Alignment%20Services.',
  },
  workingHours: {
    days: 'Monday – Saturday',
    time: '09:00 AM – 07:00 PM',
    emergency: '24×7 Emergency Support Available',
    hasHours: true,
  },
  address: {
    line1: 'A302 Sushanti Co. Op. Housings Society',
    line2: 'Koppal Road GIDC Vapi',
    city: 'Vapi',
    state: 'Gujarat',
    pincode: '396195',
    country: 'India',
    full: OFFICE_ADDRESS,
  },
};

export const STATS = {
  experience: { value: 18, suffix: '+', label: 'Years Experience' },
  projects: { value: 500, suffix: '+', label: 'Projects Completed' },
  clients: { value: 100, suffix: '+', label: 'Happy Clients' },
  support: { value: 24, suffix: 'x7', label: 'Support Available' },
};

export const SOCIAL_LINKS = {
  whatsapp: 'https://wa.me/919510900608',
  facebook: '#',
  instagram: '#',
  linkedin: '#',
  youtube: '#',
};

export const NAV_LINKS = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Services', path: '/services' },
  { label: 'Projects', path: '/projects' },
  { label: 'Gallery', path: '/gallery' },
  { label: 'Clients', path: '/clients' },
  { label: 'Contact', path: '/contact' },
];

export const SERVICES_LIST = [
  'Industrial Optical Alignment',
  'Precision Optical Alignment',
  'Theodolite Alignment',
  'Machine Alignment',
  'Shaft Alignment',
  'Equipment Alignment',
  'Foundation Level Checking',
  'Industrial Surveying',
  'Precision Measurement',
  'Alignment Inspection',
  'Alignment Calibration',
  'Industrial Geometry Verification',
];

export const CLIENTS_LIST = [
  'JK Paper',
  'Ballarpur Industries',
  'Emami Paper',
  'Century Paper',
  'ITC Tribeni',
  'Orient Paper',
  'NR Agarwal',
  'Mehali Paper',
  'Satia Paper',
  'Quantum Paper',
  'Khanna Paper',
  'Tamil Nadu Newsprint',
  'Andhra Pradesh Paper',
  'West Coast Paper',
  'Bindal Duplex',
  'Pakka Ltd',
  'Silverton Paper',
  'Aryan Paper',
  'Best Paper',
  'Tulsi Paper',
  'Nithya Packaging',
  'Sharma Fabricators & Erectors',
  'Saloni Engineering',
];

export const SEO_DEFAULT = {
  title: 'Shukla Industrial Optical Alignment | Precision • Accuracy • Reliability',
  description:
    '18+ years of Industrial Optical Alignment, Theodolite Alignment, Industrial Surveying, and Paper Mill Alignment Projects across India.',
  keywords:
    'industrial optical alignment, theodolite alignment, machine alignment, shaft alignment, industrial surveying, precision measurement, paper mill alignment, India',
  siteUrl: import.meta.env.VITE_SITE_URL || 'http://localhost:5173',
};
