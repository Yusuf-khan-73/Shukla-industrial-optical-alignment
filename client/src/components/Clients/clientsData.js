/**
 * Client catalog with categories and display metadata.
 * Location: client/src/components/Clients/clientsData.js
 */
import { CLIENTS_LIST } from '@utils/constants';
import { industrialImage } from '@utils/industrialImages';

const slugify = (name) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const isEngineering = (name) =>
  /fabricator|erector|engineering|saloni/i.test(name);

/** Per-client location and short description for display cards */
const CLIENT_META = {
  'JK Paper': {
    location: 'Songadh, Gujarat',
    description: 'Full paper machine optical alignment and theodolite surveying partner.',
  },
  'Ballarpur Industries': {
    location: 'Ballarpur, Maharashtra',
    description: 'Paper mill machinery alignment and dryer section precision work.',
  },
  'Emami Paper': {
    location: 'West Bengal',
    description: 'Calendar stack and press section optical alignment services.',
  },
  'Century Paper': {
    location: 'Kalyan, Maharashtra',
    description: 'Theodolite centerline survey and dryer section alignment.',
  },
  'ITC Tribeni': {
    location: 'Tribeni, West Bengal',
    description: 'Paper mill machinery optical alignment for production line equipment.',
  },
  'Orient Paper': {
    location: 'Amlai, Madhya Pradesh',
    description: 'Plant-wide optical alignment across paper machine sections.',
  },
  'NR Agarwal': {
    location: 'Gujarat',
    description: 'Duplex board machine drive and coupling alignment.',
  },
  'Mehali Paper': {
    location: 'Gujarat',
    description: 'Industrial survey and paper machine section alignment.',
  },
  'Satia Paper': {
    location: 'Punjab',
    description: 'Precision optical alignment for paper manufacturing equipment.',
  },
  'Quantum Paper': {
    location: 'Gujarat',
    description: 'Equipment leveling and foundation alignment verification.',
  },
  'Khanna Paper': {
    location: 'Punjab',
    description: 'Press section centerline alignment with theodolite verification.',
  },
  'Tamil Nadu Newsprint': {
    location: 'Karur, Tamil Nadu',
    description: 'Foundation bolt survey and pre-delivery alignment checks.',
  },
  'Andhra Pradesh Paper': {
    location: 'Rajahmundry, Andhra Pradesh',
    description: 'Paper mill optical alignment and industrial surveying.',
  },
  'West Coast Paper': {
    location: 'Dandeli, Karnataka',
    description: 'Plant layout survey and expansion project alignment support.',
  },
  'Bindal Duplex': {
    location: 'Morbi, Gujarat',
    description: 'Duplex board plant machinery alignment services.',
  },
  'Pakka Ltd': {
    location: 'Ayodhya, Uttar Pradesh',
    description: 'Sustainable paper mill alignment and geometry verification.',
  },
  'Silverton Paper': {
    location: 'Gujarat',
    description: 'Paper machine roller and drive system alignment.',
  },
  'Aryan Paper': {
    location: 'Gujarat',
    description: 'Industrial optical alignment for packaging paper lines.',
  },
  'Best Paper': {
    location: 'Gujarat',
    description: 'Heavy machinery alignment and theodolite surveying.',
  },
  'Tulsi Paper': {
    location: 'Gujarat',
    description: 'Paper mill equipment positioning and optical alignment.',
  },
  'Nithya Packaging': {
    location: 'India',
    description: 'Converting line and packaging equipment alignment.',
  },
  'Sharma Fabricators & Erectors': {
    location: 'Pan-India',
    description: 'Heavy industrial equipment alignment support partner.',
  },
  'Saloni Engineering': {
    location: 'Pan-India',
    description: 'Steel structure and machinery alignment engineering partner.',
  },
};

export const CLIENT_FILTERS = [
  { id: 'all', label: 'All Clients' },
  { id: 'paper', label: 'Paper Mills' },
  { id: 'engineering', label: 'Engineering Partners' },
];

export const CLIENTS_DATA = CLIENTS_LIST.map((name, index) => {
  const meta = CLIENT_META[name] || {
    location: 'India',
    description: 'Trusted partner for industrial optical alignment and paper mill projects.',
  };

  return {
    id: slugify(name),
    name,
    location: meta.location,
    shortDescription: meta.description,
    image: industrialImage(index),
    imageAlt: `${name} — paper mill and industrial machinery alignment`,
    category: isEngineering(name) ? 'engineering' : 'paper',
    categoryLabel: isEngineering(name) ? 'Engineering Partner' : 'Paper Mill',
    accentHue: (index * 37) % 360,
  };
});

export default CLIENTS_DATA;
