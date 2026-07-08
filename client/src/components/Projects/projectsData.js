/**
 * Seed project data — used as fallback until API is live (Module 13).
 * Location: client/src/components/Projects/projectsData.js
 */

export const PROJECT_INDUSTRIES = [
  { id: 'all', label: 'All Industries' },
  { id: 'paper-mill', label: 'Paper Mill' },
  { id: 'duplex-board', label: 'Duplex Board' },
  { id: 'packaging', label: 'Packaging' },
  { id: 'engineering', label: 'Engineering' },
];

import { industrialImage } from '@utils/industrialImages';

const img = (n, alt) => ({
  url: industrialImage(n - 1),
  alt,
});

export const PROJECTS_SEED = [
  {
    id: 1,
    title: 'JK Paper Unit — Full Paper Machine Alignment',
    slug: 'jk-paper-full-alignment',
    client: 'JK Paper',
    location: 'Songadh, Gujarat',
    industry: 'paper-mill',
    industryLabel: 'Paper Mill',
    completionDate: '2024-11-15',
    serviceType: 'Industrial Optical Alignment',
    featured: true,
    shortDescription:
      'Complete optical alignment of paper machine sections including press, dryer, and calendar groups.',
    description:
      'Executed comprehensive industrial optical alignment for JK Paper\'s manufacturing unit — covering approach system alignment, press section centerlines, dryer can alignment, and calendar stack precision. Project delivered with full as-built documentation and OEM tolerance compliance.',
    images: [
      img(1, 'JK Paper machine optical alignment at paper mill'),
      img(2, 'Paper mill production line alignment detail'),
    ],
  },
  {
    id: 2,
    title: 'Century Paper — Dryer Section Theodolite Survey',
    slug: 'century-paper-dryer-survey',
    client: 'Century Paper',
    location: 'Kalyan, Maharashtra',
    industry: 'paper-mill',
    industryLabel: 'Paper Mill',
    completionDate: '2024-08-22',
    serviceType: 'Theodolite Alignment',
    featured: true,
    shortDescription:
      'Theodolite-based centerline survey and alignment of multi-cylinder dryer section.',
    description:
      'Precision theodolite survey establishing dryer section centerlines and elevation benchmarks across 40+ cylinders. Delivered reference grid documentation for ongoing maintenance alignment programs.',
    images: [img(2, 'Century Paper dryer section theodolite survey')],
  },
  {
    id: 3,
    title: 'ITC Tribeni — Production Line Optical Alignment',
    slug: 'itc-tribeni-production-line-alignment',
    client: 'ITC Tribeni',
    location: 'Tribeni, West Bengal',
    industry: 'paper-mill',
    industryLabel: 'Paper Mill',
    completionDate: '2024-06-10',
    serviceType: 'Precision Optical Alignment',
    featured: true,
    shortDescription:
      'Precision leveling, centerline survey, and optical alignment for new production line equipment.',
    description:
      'Executed comprehensive optical alignment for ITC Tribeni\'s new production line — including foundation bolt surveys, equipment leveling, and integrated theodolite alignment for all critical components.',
    images: [img(3, 'ITC Tribeni production line optical alignment')],
  },
  {
    id: 4,
    title: 'Orient Paper — Plant-Wide Alignment Project',
    slug: 'orient-paper-plant-alignment',
    client: 'Orient Paper',
    location: 'Amlai, Madhya Pradesh',
    industry: 'paper-mill',
    industryLabel: 'Paper Mill',
    completionDate: '2023-12-05',
    serviceType: 'Plant Alignment',
    featured: true,
    shortDescription:
      'Multi-discipline optical alignment across the paper machine hall and production line.',
    description:
      'Coordinated plant-wide alignment project covering civil-mechanical interface verification, equipment positioning surveys, and final optical alignment verification for Orient Paper\'s expanded production capacity.',
    images: [img(4, 'Orient Paper plant-wide alignment project')],
  },
  {
    id: 5,
    title: 'NR Agarwal — Duplex Board Machine Alignment',
    slug: 'nr-agarwal-duplex-alignment',
    client: 'NR Agarwal',
    location: 'Gujarat',
    industry: 'duplex-board',
    industryLabel: 'Duplex Board',
    completionDate: '2024-03-18',
    serviceType: 'Machine Alignment',
    featured: true,
    shortDescription:
      'Shaft and coupling alignment for duplex board machine drive systems.',
    description:
      'Precision machine alignment for duplex board production line including drive coupling alignment, soft foot correction, and thermal growth compensation planning.',
    images: [img(5, 'NR Agarwal duplex board machine alignment')],
  },
  {
    id: 6,
    title: 'Tamil Nadu Newsprint — Foundation Alignment Survey',
    slug: 'tnnpl-foundation-alignment',
    client: 'Tamil Nadu Newsprint',
    location: 'Karur, Tamil Nadu',
    industry: 'paper-mill',
    industryLabel: 'Paper Mill',
    completionDate: '2023-09-30',
    serviceType: 'Foundation Level Checking',
    featured: true,
    shortDescription:
      'Anchor bolt pattern verification and foundation centerline surveys before equipment delivery.',
    description:
      'Pre-delivery foundation level checking survey identifying and correcting civil work deviations before critical paper machine equipment arrival — saving significant rework costs.',
    images: [img(6, 'TNNPL foundation and steel structure alignment survey')],
  },
  {
    id: 7,
    title: 'West Coast Paper — Industrial Surveying Project',
    slug: 'west-coast-paper-surveying',
    client: 'West Coast Paper',
    location: 'Dandeli, Karnataka',
    industry: 'paper-mill',
    industryLabel: 'Paper Mill',
    completionDate: '2024-01-20',
    serviceType: 'Industrial Surveying',
    featured: false,
    shortDescription:
      'Complete plant layout survey and as-built documentation for expansion planning.',
    description:
      'Industrial surveying project delivering comprehensive as-built plant documentation, floor level surveys, and column grid references for West Coast Paper expansion project.',
    images: [img(7, 'West Coast Paper industrial surveying project')],
  },
  {
    id: 8,
    title: 'Nithya Packaging — Equipment Leveling & Alignment',
    slug: 'nithya-packaging-leveling',
    client: 'Nithya Packaging',
    location: 'India',
    industry: 'packaging',
    industryLabel: 'Packaging',
    completionDate: '2024-05-12',
    serviceType: 'Equipment Leveling',
    featured: false,
    shortDescription:
      'Precision leveling and alignment of packaging line converting equipment.',
    description:
      'Equipment leveling and optical alignment for packaging converting line ensuring smooth operation and reduced vibration across printing and cutting sections.',
    images: [img(8, 'Nithya Packaging equipment leveling and alignment')],
  },
  {
    id: 9,
    title: 'Sharma Fabricators — Heavy Equipment Alignment Support',
    slug: 'sharma-fabricators-alignment',
    client: 'Sharma Fabricators & Erectors',
    location: 'Pan-India',
    industry: 'engineering',
    industryLabel: 'Engineering',
    completionDate: '2023-11-08',
    serviceType: 'Equipment Alignment',
    featured: false,
    shortDescription:
      'Alignment support for heavy equipment positioning projects at multiple industrial sites.',
    description:
      'Provided precision alignment services supporting Sharma Fabricators on heavy equipment positioning projects — ensuring machinery met strict centerline and elevation specifications.',
    images: [img(9, 'Sharma Fabricators heavy equipment alignment support')],
  },
  {
    id: 10,
    title: 'Emami Paper — Laser Alignment Consultation',
    slug: 'emami-paper-laser-consult',
    client: 'Emami Paper',
    location: 'West Bengal',
    industry: 'paper-mill',
    industryLabel: 'Paper Mill',
    completionDate: '2024-09-05',
    serviceType: 'Laser Alignment Consultation',
    featured: false,
    shortDescription:
      'Alignment methodology development and maintenance team training program.',
    description:
      'Laser alignment consultation including procedure development, tolerance specification review, and on-site training for Emami Paper maintenance engineering team.',
    images: [img(10, 'Emami Paper industrial alignment consultation')],
  },
];

export default PROJECTS_SEED;
