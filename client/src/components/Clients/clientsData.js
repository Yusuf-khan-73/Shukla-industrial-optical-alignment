/**
 * Client catalog with categories and display metadata.
 * Location: client/src/components/Clients/clientsData.js
 */
import { CLIENTS_LIST } from '@utils/constants';

const slugify = (name) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const getInitials = (name) => {
  const words = name.replace(/&/g, ' ').split(/\s+/).filter(Boolean);
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return words
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
};

const isEngineering = (name) =>
  /fabricator|erector|engineering|saloni/i.test(name);

export const CLIENT_FILTERS = [
  { id: 'all', label: 'All Clients' },
  { id: 'paper', label: 'Paper Mills' },
  { id: 'engineering', label: 'Engineering Partners' },
];

export const CLIENTS_DATA = CLIENTS_LIST.map((name, index) => ({
  id: slugify(name),
  name,
  initials: getInitials(name),
  category: isEngineering(name) ? 'engineering' : 'paper',
  categoryLabel: isEngineering(name) ? 'Engineering Partner' : 'Paper Mill',
  accentHue: (index * 37) % 360,
}));

export default CLIENTS_DATA;
