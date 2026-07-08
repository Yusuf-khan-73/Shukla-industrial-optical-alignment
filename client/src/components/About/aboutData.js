/**
 * About section static content.
 * Location: client/src/components/About/aboutData.js
 */
import { COMPANY } from '@utils/constants';
import { industrialImage } from '@utils/industrialImages';

export const ABOUT_STORY = {
  label: 'About Us',
  title: 'Leading India\'s Paper & Industrial Sector',
  paragraphs: [
    COMPANY.description,
    `Since ${COMPANY.foundedYear}, Shukla Industrial Optical Alignment has been the trusted partner for paper mills, manufacturing plants, and heavy industries across India. We specialize in precision optical alignment, theodolite surveying, and industrial geometry verification.`,
    'From JK Paper to Century Paper, ITC Tribeni to Orient Paper — our work powers the backbone of India\'s industrial economy with accuracy you can measure and reliability you can count on.',
  ],
  image: industrialImage(0),
  imageAlt: 'Industrial optical alignment on paper mill machinery',
};

export const MISSION_VISION = {
  mission: {
    icon: 'bi-bullseye',
    title: 'Our Mission',
    text: 'To deliver world-class industrial optical alignment and theodolite surveying services with uncompromising precision, ensuring every client\'s plant operates at peak efficiency and maximum uptime.',
  },
  vision: {
    icon: 'bi-eye',
    title: 'Our Vision',
    text: 'To be India\'s most trusted name in industrial optical alignment — setting the benchmark for accuracy, safety, and engineering excellence across every paper mill and manufacturing facility we serve.',
  },
};

export const TIMELINE = [
  {
    year: 2006,
    title: 'Foundation',
    description: 'Shukla Industrial Optical Alignment established with a focus on paper mill precision engineering.',
  },
  {
    year: 2010,
    title: 'Pan-India Expansion',
    description: 'Expanded operations across major paper mill hubs in Gujarat, Maharashtra, and Uttar Pradesh.',
  },
  {
    year: 2014,
    title: '100+ Projects Milestone',
    description: 'Crossed 100 successful alignment and surveying projects for leading paper manufacturers.',
  },
  {
    year: 2018,
    title: 'Advanced Theodolite Services',
    description: 'Introduced advanced theodolite alignment and laser consultation for complex industrial setups.',
  },
  {
    year: 2022,
    title: '500+ Projects Completed',
    description: 'Achieved 500+ project completions serving 100+ clients with 24x7 emergency support.',
  },
  {
    year: 2026,
    title: '18+ Years of Excellence',
    description: 'Continuing to lead with precision, accuracy, and reliability across India\'s industrial sector.',
  },
];

export const WHY_CHOOSE_US = [
  {
    icon: 'bi-award',
    title: '18+ Years Experience',
    description: 'Nearly two decades of specialized expertise in industrial optical alignment and paper mill projects.',
    image: industrialImage(0),
    imageAlt: 'Theodolite alignment on paper mill machinery',
  },
  {
    icon: 'bi-building-check',
    title: '500+ Projects',
    description: 'Proven track record across paper mills, duplex board plants, and heavy manufacturing facilities.',
    image: industrialImage(1),
    imageAlt: 'Industrial survey equipment at paper plant',
  },
  {
    icon: 'bi-people',
    title: '100+ Clients',
    description: 'Trusted by JK Paper, Century Paper, ITC Tribeni, Orient Paper, and industry leaders nationwide.',
    image: industrialImage(2),
    imageAlt: 'Paper mill production line machinery',
  },
  {
    icon: 'bi-headset',
    title: '24x7 Support',
    description: 'Round-the-clock emergency support ensuring zero downtime for critical alignment operations.',
    image: industrialImage(3),
    imageAlt: 'Heavy industrial machinery alignment work',
  },
  {
    icon: 'bi-geo-alt',
    title: 'Pan-India Coverage',
    description: 'Service teams deployed across all major industrial corridors from Gujarat to Tamil Nadu.',
    image: industrialImage(4),
    imageAlt: 'Factory alignment and steel structure survey',
  },
  {
    icon: 'bi-shield-check',
    title: 'Precision Guaranteed',
    description: 'Every project delivered with theodolite-verified accuracy and comprehensive documentation.',
    image: industrialImage(5),
    imageAlt: 'Industrial precision measurement on site',
  },
];
