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
      {
        url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80',
        alt: 'JK Paper machine alignment project',
      },
      {
        url: 'https://images.unsplash.com/photo-1565043589221-1a6fd9f4c837?auto=format&fit=crop&w=800&q=80',
        alt: 'Paper machine section installation',
      },
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
    images: [
      {
        url: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=800&q=80',
        alt: 'Theodolite survey at Century Paper',
      },
    ],
  },
  {
    id: 3,
    title: 'ITC Tribeni — Machinery Installation Project',
    slug: 'itc-tribeni-machinery-install',
    client: 'ITC Tribeni',
    location: 'Tribeni, West Bengal',
    industry: 'paper-mill',
    industryLabel: 'Paper Mill',
    completionDate: '2024-06-10',
    serviceType: 'Machinery Installation',
    featured: true,
    shortDescription:
      'Turnkey machinery erection, leveling, and alignment for new production line equipment.',
    description:
      'Managed complete machinery installation including foundation bolt surveys, equipment leveling, and integrated optical alignment for new production line components at ITC Tribeni unit.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1518611507436-f9221403eca8?auto=format&fit=crop&w=800&q=80',
        alt: 'ITC Tribeni machinery installation',
      },
    ],
  },
  {
    id: 4,
    title: 'Orient Paper — Plant Installation & Alignment',
    slug: 'orient-paper-plant-install',
    client: 'Orient Paper',
    location: 'Amlai, Madhya Pradesh',
    industry: 'paper-mill',
    industryLabel: 'Paper Mill',
    completionDate: '2023-12-05',
    serviceType: 'Plant Installation',
    featured: true,
    shortDescription:
      'Multi-discipline plant installation with precision alignment across paper machine hall.',
    description:
      'Coordinated plant installation project covering civil-mechanical interface, equipment positioning, and final optical alignment verification for Orient Paper\'s expanded production capacity.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=800&q=80',
        alt: 'Orient Paper plant installation',
      },
    ],
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
    images: [
      {
        url: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80',
        alt: 'NR Agarwal duplex board alignment',
      },
    ],
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
    serviceType: 'Foundation Alignment',
    featured: true,
    shortDescription:
      'Anchor bolt pattern verification and foundation centerline surveys before equipment delivery.',
    description:
      'Pre-installation foundation alignment survey identifying and correcting civil work deviations before critical paper machine equipment arrival — saving significant rework costs.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=800&q=80',
        alt: 'TNNPL foundation alignment survey',
      },
    ],
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
    images: [
      {
        url: 'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?auto=format&fit=crop&w=800&q=80',
        alt: 'West Coast Paper industrial survey',
      },
    ],
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
    images: [
      {
        url: 'https://images.unsplash.com/photo-1581092795360-fd1aa04c4d26?auto=format&fit=crop&w=800&q=80',
        alt: 'Nithya Packaging equipment alignment',
      },
    ],
  },
  {
    id: 9,
    title: 'Sharma Fabricators — Heavy Equipment Erection Alignment',
    slug: 'sharma-fabricators-erection',
    client: 'Sharma Fabricators & Erectors',
    location: 'Pan-India',
    industry: 'engineering',
    industryLabel: 'Engineering',
    completionDate: '2023-11-08',
    serviceType: 'Machinery Installation',
    featured: false,
    shortDescription:
      'Alignment support for heavy equipment erection projects at multiple industrial sites.',
    description:
      'Provided precision alignment services supporting Sharma Fabricators on heavy equipment erection projects — ensuring installed machinery met strict centerline and elevation specifications.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3780?auto=format&fit=crop&w=800&q=80',
        alt: 'Sharma Fabricators erection alignment',
      },
    ],
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
    images: [
      {
        url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80',
        alt: 'Emami Paper alignment consultation',
      },
    ],
  },
];

export default PROJECTS_SEED;
