/**
 * Home page About preview data.
 * Location: client/src/components/Home/homeAboutData.js
 */
import { STATS } from '@utils/constants';

export const HOME_ABOUT_PREVIEW = {
  label: 'About Us',
  title: 'Precision Alignment. Performance Excellence.',
  description:
    'With over 18 years of expertise, Shukla Industrial Optical Alignment has been a trusted partner in delivering high-precision alignment, installation, and surveying solutions for critical industrial projects across India. Our commitment to accuracy, safety, and quality helps industries minimize downtime, enhance equipment life, and achieve peak operational efficiency.',
  stats: [
    { key: 'experience', label: 'Years of Experience', value: STATS.experience.value, suffix: STATS.experience.suffix },
    { key: 'projects', label: 'Projects Completed', value: STATS.projects.value, suffix: STATS.projects.suffix },
    { key: 'clients', label: 'Happy Clients', value: STATS.clients.value, suffix: STATS.clients.suffix },
    { key: 'support', label: 'Support & Assistance', value: STATS.support.value, suffix: STATS.support.suffix },
  ],
  commitments: ['Quality', 'Safety', 'Accuracy', 'Reliability'],
  images: {
    main: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=900&q=80',
    mainAlt: 'Technician performing precision alignment on industrial machinery',
    sub1: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=600&q=80',
    sub1Alt: 'Industrial piping and plant infrastructure',
    sub2: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=600&q=80',
    sub2Alt: 'Laser alignment and surveying equipment',
  },
};
