/**
 * Testimonials seed data — fallback until API is live (Module 13).
 * Location: client/src/components/Testimonials/testimonialsData.js
 */

const getInitials = (name) =>
  name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

export const TESTIMONIALS_SEED = [
  {
    id: 1,
    name: 'Rajesh Kumar',
    designation: 'Plant Head',
    company: 'JK Paper',
    rating: 5,
    quote:
      'Shukla Industrial has been our trusted alignment partner for over a decade. Their precision work on our paper machine sections has significantly reduced downtime and improved product quality. Highly recommended.',
    featured: true,
    initials: getInitials('Rajesh Kumar'),
  },
  {
    id: 2,
    name: 'Amit Sharma',
    designation: 'Maintenance Manager',
    company: 'Century Paper',
    rating: 5,
    quote:
      'The theodolite alignment work on our dryer section was executed flawlessly. The team\'s professionalism and detailed documentation made our audit process seamless. True experts in optical alignment.',
    featured: true,
    initials: getInitials('Amit Sharma'),
  },
  {
    id: 3,
    name: 'Pradeep Banerjee',
    designation: 'Project Director',
    company: 'ITC Tribeni',
    rating: 5,
    quote:
      'From foundation surveys to final optical alignment, Shukla Industrial handled our expansion project with exceptional skill. They delivered on schedule and within tolerance specifications every time.',
    featured: true,
    initials: getInitials('Pradeep Banerjee'),
  },
  {
    id: 4,
    name: 'Vikram Singh',
    designation: 'Engineering Head',
    company: 'Orient Paper',
    rating: 5,
    quote:
      'We have relied on Shukla Industrial for plant-wide alignment and theodolite surveying across multiple units. Their 24x7 support during critical shutdowns has been invaluable to our operations.',
    featured: true,
    initials: getInitials('Vikram Singh'),
  },
  {
    id: 5,
    name: 'Sanjay Patel',
    designation: 'Technical Superintendent',
    company: 'NR Agarwal',
    rating: 5,
    quote:
      'Outstanding machine alignment services for our duplex board line. Vibration levels dropped dramatically after their intervention. A team that truly understands paper mill engineering.',
    featured: true,
    initials: getInitials('Sanjay Patel'),
  },
  {
    id: 6,
    name: 'R. Venkatesh',
    designation: 'Chief Engineer',
    company: 'Tamil Nadu Newsprint',
    rating: 5,
    quote:
      'Their foundation alignment survey caught critical deviations before our equipment arrived — saving us weeks of rework. Precision and foresight that sets them apart from others.',
    featured: true,
    initials: getInitials('R Venkatesh'),
  },
  {
    id: 7,
    name: 'Manoj Gupta',
    designation: 'Operations Manager',
    company: 'West Coast Paper',
    rating: 5,
    quote:
      'Professional industrial surveying and alignment services delivered consistently across our Dandeli plant. Shukla Industrial is our go-to partner for all precision engineering needs.',
    featured: false,
    initials: getInitials('Manoj Gupta'),
  },
  {
    id: 8,
    name: 'Deepak Sharma',
    designation: 'Director',
    company: 'Sharma Fabricators & Erectors',
    rating: 5,
    quote:
      'We partner with Shukla Industrial on heavy erection projects nationwide. Their alignment expertise complements our fabrication work perfectly — a reliable engineering alliance.',
    featured: false,
    initials: getInitials('Deepak Sharma'),
  },
];

export default TESTIMONIALS_SEED;
