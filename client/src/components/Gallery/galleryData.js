/**
 * Gallery seed data — fallback until API is live (Module 13).
 * Location: client/src/components/Gallery/galleryData.js
 */

export const GALLERY_FILTERS = [
  { id: 'all', label: 'All Photos' },
  { id: 'alignment', label: 'Optical Alignment' },
  { id: 'installation', label: 'Installation' },
  { id: 'surveying', label: 'Surveying' },
  { id: 'paper-mill', label: 'Paper Mill' },
];

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
    image: {
      url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80',
      alt: 'Paper machine roller optical alignment at JK Paper',
    },
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
    image: {
      url: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=800&q=80',
      alt: 'Theodolite survey at Century Paper mill',
    },
  },
  {
    id: 3,
    title: 'Machinery Erection & Leveling',
    company: 'ITC Tribeni',
    location: 'Tribeni, West Bengal',
    date: '2024-06-05',
    category: 'installation',
    categoryLabel: 'Installation',
    featured: true,
    description:
      'Heavy machinery erection with precision leveling before final optical alignment.',
    image: {
      url: 'https://images.unsplash.com/photo-1565043589221-1a6fd9f4c837?auto=format&fit=crop&w=800&q=80',
      alt: 'Machinery installation at ITC Tribeni',
    },
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
    image: {
      url: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=800&q=80',
      alt: 'Dryer section alignment at Orient Paper',
    },
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
    image: {
      url: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80',
      alt: 'Drive coupling alignment NR Agarwal',
    },
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
      'Pre-installation anchor bolt pattern verification and foundation survey.',
    image: {
      url: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=800&q=80',
      alt: 'Foundation bolt survey TNNPL',
    },
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
    image: {
      url: 'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?auto=format&fit=crop&w=800&q=80',
      alt: 'Plant layout survey West Coast Paper',
    },
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
    image: {
      url: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3780?auto=format&fit=crop&w=800&q=80',
      alt: 'Calendar stack alignment Emami Paper',
    },
  },
  {
    id: 9,
    title: 'Equipment Leveling Operation',
    company: 'Quantum Paper',
    location: 'Gujarat',
    date: '2024-04-20',
    category: 'installation',
    categoryLabel: 'Installation',
    featured: false,
    description:
      'Precision equipment leveling using optical levels before alignment work.',
    image: {
      url: 'https://images.unsplash.com/photo-1581092795360-fd1aa04c4d26?auto=format&fit=crop&w=800&q=80',
      alt: 'Equipment leveling Quantum Paper',
    },
  },
  {
    id: 10,
    title: 'Press Section Installation',
    company: 'Khanna Paper',
    location: 'Punjab',
    date: '2023-10-12',
    category: 'installation',
    categoryLabel: 'Installation',
    featured: false,
    description:
      'Press section machinery installation with integrated alignment verification.',
    image: {
      url: 'https://images.unsplash.com/photo-1518611507436-f9221403eca8?auto=format&fit=crop&w=800&q=80',
      alt: 'Press section installation Khanna Paper',
    },
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
    image: {
      url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80',
      alt: 'Packaging line alignment Nithya Packaging',
    },
  },
  {
    id: 12,
    title: 'Heavy Equipment Erection',
    company: 'Sharma Fabricators & Erectors',
    location: 'Pan-India',
    date: '2023-11-02',
    category: 'installation',
    categoryLabel: 'Installation',
    featured: false,
    description:
      'Alignment support during heavy industrial equipment erection project.',
    image: {
      url: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80',
      alt: 'Heavy equipment erection alignment',
    },
  },
];

export default GALLERY_SEED;
