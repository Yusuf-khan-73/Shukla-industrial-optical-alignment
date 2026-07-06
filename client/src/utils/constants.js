/**
 * Shukla Industrial — Application Constants
 * Location: client/src/utils/constants.js
 *
 * Central source of truth for company info, navigation, and contact details.
 * Values marked as admin-editable will be overridden by API data in later modules.
 */

export const COMPANY = {
  name: 'SHUKLA INDUSTRIAL OPTICAL ALIGNMENT',
  shortName: 'Shukla Industrial',
  tagline: 'Precision • Accuracy • Reliability',
  experience: '18+',
  experienceLabel: 'Years of Excellence',
  description:
    'Leading provider of Industrial Optical Alignment, Machinery Installation, Industrial Surveying, and Paper Mill Projects across India with 18+ years of proven expertise.',
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
    'mailto:sioaw98@yahoo.com?subject=Industrial%20Optical%20Alignment%20Inquiry&body=Hello%2C%0A%0AI%20would%20like%20to%20know%20more%20about%20your%20Industrial%20Optical%20Alignment%20Services.%0A%0APlease%20contact%20me.%0A%0AThank%20You.',
  whatsapp: {
    url: 'https://wa.me/919510900608',
    message:
      'Hello,\nI found your website and I would like to know more about your Industrial Optical Alignment Services.',
    fullUrl:
      'https://wa.me/919510900608?text=Hello%2C%0AI%20found%20your%20website%20and%20I%20would%20like%20to%20know%20more%20about%20your%20Industrial%20Optical%20Alignment%20Services.',
  },
  workingHours: {
    days: 'Monday - Saturday',
    time: '09:00 AM - 07:00 PM',
    emergency: '24x7 Emergency Support Available',
  },
  address: {
    line1: '123, Industrial Area',
    line2: '',
    city: 'Kanpur',
    state: 'Uttar Pradesh',
    pincode: '208001',
    country: 'India',
    full: '123, Industrial Area, Kanpur, Uttar Pradesh, India — 208001',
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
  'Theodolite Alignment',
  'Machinery Installation',
  'Industrial Surveying',
  'Equipment Leveling',
  'Machine Alignment',
  'Plant Installation',
  'Laser Alignment Consultation',
  'Foundation Alignment',
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
    '18+ years of Industrial Optical Alignment, Machinery Installation, Industrial Surveying, and Paper Mill Projects across India.',
  keywords:
    'industrial optical alignment, theodolite alignment, machinery installation, paper mill projects, laser alignment, India',
  siteUrl: import.meta.env.VITE_SITE_URL || 'http://localhost:5173',
};

export const MAP_LINK =
  'https://www.google.com/maps/search/?api=1&query=123+Industrial+Area,+Kanpur,+Uttar+Pradesh+208001';

export const MAP_EMBED_URL =
  import.meta.env.VITE_GOOGLE_MAPS_EMBED_URL ||
  'https://maps.google.com/maps?q=123+Industrial+Area,+Kanpur,+Uttar+Pradesh+208001&hl=en&z=16&output=embed';
