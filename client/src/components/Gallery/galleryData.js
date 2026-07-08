/**
 * Gallery seed data — fallback until API is live (Module 13).
 * Location: client/src/components/Gallery/galleryData.js
 */
import { industrialImage } from '@utils/industrialImages';

export const GALLERY_FILTERS = [
  { id: 'all', label: 'All Photos' },
  { id: 'alignment', label: 'Optical Alignment' },
  { id: 'surveying', label: 'Surveying' },
  { id: 'paper-mill', label: 'Paper Mill' },
];

const galleryImg = (index, alt) => ({
  url: industrialImage(index),
  alt,
});

export const GALLERY_SEED = [
  {
    id: 1,
    title: 'Paper Machine Roller Alignment',
    company: 'JK Paper',
    location: 'Songadh, Gujarat',
    date: '2024-11-10',
    category: 'alignment',
    categoryLabel: 'Optical Alignment',
    featured: true,
    description:
      'Precision optical alignment of paper machine press section rollers using theodolite reference lines.',
    image: galleryImg(0, 'Paper machine roller optical alignment at JK Paper'),
  },
  {
    id: 2,
    title: 'Theodolite Centerline Survey',
    company: 'Century Paper',
    location: 'Kalyan, Maharashtra',
    date: '2024-08-18',
    category: 'surveying',
    categoryLabel: 'Surveying',
    featured: true,
    description:
      'Theodolite-based centerline establishment for dryer section cylinder alignment.',
    image: galleryImg(1, 'Theodolite survey at Century Paper mill'),
  },
  {
    id: 3,
    title: 'Production Line Leveling & Alignment',
    company: 'ITC Tribeni',
    location: 'Tribeni, West Bengal',
    date: '2024-06-05',
    category: 'alignment',
    categoryLabel: 'Optical Alignment',
    featured: true,
    description:
      'Precision leveling and optical alignment of paper mill production line machinery.',
    image: galleryImg(2, 'Paper mill machinery alignment at ITC Tribeni'),
  },
  {
    id: 4,
    title: 'Dryer Section Alignment',
    company: 'Orient Paper',
    location: 'Amlai, Madhya Pradesh',
    date: '2023-12-01',
    category: 'paper-mill',
    categoryLabel: 'Paper Mill',
    featured: true,
    description:
      'Multi-cylinder dryer section alignment ensuring uniform paper web tracking.',
    image: galleryImg(3, 'Dryer section alignment at Orient Paper'),
  },
  {
    id: 5,
    title: 'Drive Coupling Alignment',
    company: 'NR Agarwal',
    location: 'Gujarat',
    date: '2024-03-12',
    category: 'alignment',
    categoryLabel: 'Optical Alignment',
    featured: true,
    description:
      'Shaft and coupling alignment for duplex board machine drive system.',
    image: galleryImg(4, 'Drive coupling alignment NR Agarwal'),
  },
  {
    id: 6,
    title: 'Foundation Bolt Survey',
    company: 'Tamil Nadu Newsprint',
    location: 'Karur, Tamil Nadu',
    date: '2023-09-25',
    category: 'surveying',
    categoryLabel: 'Surveying',
    featured: true,
    description:
      'Pre-delivery anchor bolt pattern verification and foundation level checking survey.',
    image: galleryImg(5, 'Foundation bolt survey TNNPL'),
  },
  {
    id: 7,
    title: 'Plant Layout Survey',
    company: 'West Coast Paper',
    location: 'Dandeli, Karnataka',
    date: '2024-01-15',
    category: 'surveying',
    categoryLabel: 'Surveying',
    featured: true,
    description:
      'Industrial plant layout survey for expansion project planning.',
    image: galleryImg(6, 'Plant layout survey West Coast Paper'),
  },
  {
    id: 8,
    title: 'Calendar Stack Precision',
    company: 'Emami Paper',
    location: 'West Bengal',
    date: '2024-09-01',
    category: 'paper-mill',
    categoryLabel: 'Paper Mill',
    featured: true,
    description:
      'Calendar stack optical alignment for uniform sheet thickness control.',
    image: galleryImg(7, 'Calendar stack alignment Emami Paper'),
  },
  {
    id: 9,
    title: 'Equipment Leveling & Alignment',
    company: 'Quantum Paper',
    location: 'Gujarat',
    date: '2024-04-20',
    category: 'alignment',
    categoryLabel: 'Optical Alignment',
    featured: false,
    description:
      'Precision equipment leveling using optical levels before alignment work.',
    image: galleryImg(8, 'Equipment leveling Quantum Paper'),
  },
  {
    id: 10,
    title: 'Press Section Optical Alignment',
    company: 'Khanna Paper',
    location: 'Punjab',
    date: '2023-10-12',
    category: 'alignment',
    categoryLabel: 'Optical Alignment',
    featured: false,
    description:
      'Press section centerline alignment with theodolite verification.',
    image: galleryImg(9, 'Press section optical alignment Khanna Paper'),
  },
  {
    id: 11,
    title: 'Packaging Line Alignment',
    company: 'Nithya Packaging',
    location: 'India',
    date: '2024-05-08',
    category: 'alignment',
    categoryLabel: 'Optical Alignment',
    featured: false,
    description:
      'Converting line equipment alignment for packaging production unit.',
    image: galleryImg(0, 'Packaging line alignment Nithya Packaging'),
  },
  {
    id: 12,
    title: 'Heavy Equipment Alignment Support',
    company: 'Sharma Fabricators & Erectors',
    location: 'Pan-India',
    date: '2023-11-02',
    category: 'alignment',
    categoryLabel: 'Optical Alignment',
    featured: false,
    description:
      'Theodolite alignment support during heavy industrial equipment positioning.',
    image: galleryImg(1, 'Heavy equipment alignment support'),
  },
];

export default GALLERY_SEED;
