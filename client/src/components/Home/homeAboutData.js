/**
 * Home page About preview data.
 * Location: client/src/components/Home/homeAboutData.js
 */
import { STATS } from '@utils/constants';
import { industrialImage } from '@utils/industrialImages';

export const HOME_ABOUT_PREVIEW = {
  label: 'About Us',
  title: 'Precision Alignment. Performance Excellence.',
  description:
    'With over 18 years of expertise, Shukla Industrial Optical Alignment has been a trusted partner in delivering high-precision optical alignment, theodolite surveying, and industrial measurement solutions for critical paper mill projects across India. Our commitment to accuracy, safety, and quality helps industries minimize downtime, enhance equipment life, and achieve peak operational efficiency.',
  stats: [
    { key: 'experience', label: 'Years of Experience', value: STATS.experience.value, suffix: STATS.experience.suffix },
    { key: 'projects', label: 'Projects Completed', value: STATS.projects.value, suffix: STATS.projects.suffix },
    { key: 'clients', label: 'Happy Clients', value: STATS.clients.value, suffix: STATS.clients.suffix },
    { key: 'support', label: 'Support & Assistance', value: STATS.support.value, suffix: STATS.support.suffix },
  ],
  commitments: ['Quality', 'Safety', 'Accuracy', 'Reliability'],
  images: {
    main: industrialImage(0),
    mainAlt: 'Theodolite optical alignment on paper mill machinery',
    sub1: industrialImage(1),
    sub1Alt: 'Industrial survey equipment at paper manufacturing plant',
    sub2: industrialImage(2),
    sub2Alt: 'Heavy paper mill machinery alignment work',
  },
};
