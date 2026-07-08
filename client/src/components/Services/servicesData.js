/**
 * Complete services catalog with descriptions, benefits, FAQs, and images.
 * Location: client/src/components/Services/servicesData.js
 */
import { industrialImage } from '@utils/industrialImages';

export const SERVICES_DATA = [
  {
    slug: 'industrial-optical-alignment',
    title: 'Industrial Optical Alignment',
    icon: 'bi-crosshair',
    shortDescription:
      'Precision optical alignment for paper mill machinery, turbines, and rotating equipment using advanced surveying instruments.',
    description:
      'Our core specialty — industrial optical alignment using precision optical instruments to align shafts, rollers, dryers, calendars, and critical paper mill equipment. We ensure micron-level accuracy that reduces vibration, extends bearing life, and maximizes production uptime across your entire plant.',
    image: industrialImage(0),
    imageAlt: 'Industrial optical alignment of paper mill machinery',
    benefits: [
      'Micron-level precision alignment verified with optical instruments',
      'Reduced vibration and bearing wear on critical equipment',
      'Extended machinery life and lower maintenance costs',
      'Comprehensive alignment reports with as-built documentation',
      'Minimal production downtime with efficient execution',
    ],
    faqs: [
      {
        q: 'What equipment can you align optically?',
        a: 'We align paper machine rollers, dryers, calendars, turbines, compressors, gearboxes, and all rotating industrial equipment requiring shaft-to-shaft precision.',
      },
      {
        q: 'How long does an alignment project take?',
        a: 'Duration depends on scope — single machine alignments may take 1–2 days, while full paper machine alignments can take 1–2 weeks with our experienced team.',
      },
    ],
  },
  {
    slug: 'theodolite-alignment',
    title: 'Theodolite Alignment',
    icon: 'bi-compass',
    shortDescription:
      'High-precision theodolite-based alignment for long-distance machine centers and foundation reference lines.',
    description:
      'Using advanced theodolite surveying equipment, we establish precise machine centerlines, elevation benchmarks, and reference grids across your plant. Essential for paper mill alignment projects, long conveyor runs, and multi-machine alignment requiring angular and linear precision over extended distances.',
    image: industrialImage(1),
    imageAlt: 'Theodolite alignment survey at industrial plant',
    benefits: [
      'Accurate centerline establishment over long distances',
      'Foundation and plinth level verification',
      'Machine grid layout for new alignment projects',
      'Angular and elevation precision to industry standards',
      'Certified survey documentation for project records',
    ],
    faqs: [
      {
        q: 'When is theodolite alignment required?',
        a: 'Theodolite alignment is essential for new plant alignment projects, machine repositioning, foundation surveys, and establishing reference lines for multiple machines along a production line.',
      },
      {
        q: 'What accuracy levels do you achieve?',
        a: 'We achieve angular accuracy within seconds of arc and linear accuracy within ±0.5mm over typical paper mill distances, meeting international alignment standards.',
      },
    ],
  },
  {
    slug: 'machinery-alignment',
    title: 'Machinery Alignment',
    icon: 'bi-gear-wide-connected',
    shortDescription:
      'Precision machinery alignment for paper mills and industrial plants — shafts, rollers, drives, and rotating equipment.',
    description:
      'Specialized machinery alignment services using optical alignment, theodolite, and laser techniques. We align paper machine sections, pulpers, refiners, gearboxes, pumps, and auxiliary plant machinery to manufacturer tolerances — minimizing vibration, wear, and unplanned downtime.',
    image: industrialImage(2),
    imageAlt: 'Precision machinery alignment at industrial manufacturing plant',
    benefits: [
      'Shaft, coupling, and roller alignment to tight tolerances',
      'Reduced vibration, bearing wear, and energy losses',
      'Optical, theodolite, and laser alignment methods',
      'Alignment reports with measured deviation data',
      'Faster commissioning and longer equipment service life',
    ],
    faqs: [
      {
        q: 'Do you align complete paper machine sections?',
        a: 'Yes. We align approach systems, press sections, dryers, calendars, and drives — ensuring centerlines, levels, and squareness across the full machine.',
      },
      {
        q: 'Can you re-align machinery after relocation or overhaul?',
        a: 'Absolutely. We perform post-relocation, post-overhaul, and breakdown alignment for mills, OEM teams, and maintenance contractors across India.',
      },
    ],
  },
  {
    slug: 'industrial-surveying',
    title: 'Industrial Surveying',
    icon: 'bi-map',
    shortDescription:
      'Plant layout surveying, as-built documentation, and spatial measurement for industrial facilities.',
    description:
      'Comprehensive industrial surveying services including plant layout surveys, as-built documentation, floor flatness surveys, column grid surveys, and spatial measurements. Critical for expansion projects, machine relocation planning, and civil construction coordination.',
    image: industrialImage(3),
    imageAlt: 'Industrial surveying at paper mill facility',
    benefits: [
      'Accurate as-built plant documentation',
      'Floor flatness and level surveys',
      'Column grid and foundation surveys',
      '3D spatial data for planning and design',
      'Support for expansion and relocation projects',
    ],
    faqs: [
      {
        q: 'What surveying equipment do you use?',
        a: 'We use precision theodolites, auto levels, laser levels, and digital measuring instruments calibrated to national standards.',
      },
      {
        q: 'Can you survey during plant operations?',
        a: 'Yes, we plan surveys to minimize disruption and can work in active plant environments with appropriate safety protocols.',
      },
    ],
  },
  {
    slug: 'equipment-leveling',
    title: 'Equipment Leveling',
    icon: 'bi-rulers',
    shortDescription:
      'Precision leveling of industrial equipment, foundations, and machine beds for optimal performance.',
    description:
      'Precision equipment leveling using optical levels and precision shims to achieve exact horizontal and vertical positioning. Proper leveling is the foundation of accurate alignment — we ensure every machine sits on a perfectly level base before alignment work begins.',
    image: industrialImage(4),
    imageAlt: 'Precision equipment leveling with optical instruments',
    benefits: [
      'Foundation and machine bed leveling',
      'Precision shim calculations and shim placement',
      'Grout gap verification and documentation',
      'Pre-alignment leveling for accurate results',
      'Level tolerance compliance to OEM specifications',
    ],
    faqs: [
      {
        q: 'Why is leveling important before alignment?',
        a: 'Incorrect leveling introduces errors in alignment readings. Proper leveling ensures alignment measurements are accurate and machines operate without undue stress.',
      },
      {
        q: 'What level tolerances do you work to?',
        a: 'We work to OEM-specified tolerances, typically 0.05mm/m for precision equipment and stricter tolerances for high-speed paper machine components.',
      },
    ],
  },
  {
    slug: 'machine-alignment',
    title: 'Machine Alignment',
    icon: 'bi-tools',
    shortDescription:
      'Shaft, coupling, and bore alignment for rotating machinery using optical and laser methods.',
    description:
      'Specialized machine alignment services for coupled shafts, gearboxes, pumps, and drive systems. We combine optical alignment techniques with laser systems where applicable to achieve coupling alignment within specified tolerances for smooth, efficient operation.',
    image: industrialImage(5),
    imageAlt: 'Machine shaft alignment at industrial facility',
    benefits: [
      'Coupling and shaft alignment to OEM specs',
      'Reduced energy consumption and heat generation',
      'Lower vibration signatures on running equipment',
      'Soft foot detection and correction',
      'Thermal growth compensation planning',
    ],
    faqs: [
      {
        q: 'What types of misalignment do you correct?',
        a: 'We correct angular, offset, and combined misalignment in horizontal and vertical planes for all types of industrial couplings and drive systems.',
      },
      {
        q: 'Do you provide hot alignment services?',
        a: 'Yes, we offer thermal growth studies and hot alignment verification to account for machine expansion during operation.',
      },
    ],
  },
  {
    slug: 'plant-alignment',
    title: 'Plant Alignment',
    icon: 'bi-building',
    shortDescription:
      'Plant-wide optical and theodolite alignment for paper mills and industrial manufacturing facilities.',
    description:
      'Comprehensive plant alignment services across entire production lines — establishing master centerlines, verifying equipment geometry, and aligning all critical machinery to design tolerances. From greenfield paper mills to expansion projects, we ensure every section is precisely aligned for reliable, vibration-free operation.',
    image: industrialImage(6),
    imageAlt: 'Industrial plant alignment project overview',
    benefits: [
      'Plant-wide centerline and benchmark establishment',
      'Multi-section alignment across full production lines',
      'Optical and theodolite alignment to design tolerances',
      'Detailed alignment reports at every project stage',
      'Single-point accountability for plant alignment scope',
    ],
    faqs: [
      {
        q: 'What plant types do you align?',
        a: 'We specialize in paper mills, duplex board plants, packaging units, and general heavy manufacturing facilities across India.',
      },
      {
        q: 'Can you supervise alignment work by other contractors?',
        a: 'Yes. We provide alignment supervision, verification, and sign-off for projects where multiple contractors are involved on site.',
      },
    ],
  },
  {
    slug: 'laser-alignment-consultation',
    title: 'Laser Alignment Consultation',
    icon: 'bi-bullseye',
    shortDescription:
      'Expert consultation on laser alignment systems, methodology, and best practices for your facility.',
    description:
      'Professional consultation services for laser alignment technology selection, methodology development, and team training. We advise on when to use laser vs optical alignment, help establish alignment procedures, and train your maintenance teams on precision alignment best practices.',
    image: industrialImage(7),
    imageAlt: 'Laser alignment consultation for industrial maintenance team',
    benefits: [
      'Alignment methodology and procedure development',
      'Technology selection guidance (laser vs optical)',
      'Maintenance team training programs',
      'Alignment tolerance specification review',
      'Preventive alignment schedule planning',
    ],
    faqs: [
      {
        q: 'Do you sell laser alignment equipment?',
        a: 'We provide independent consultation on equipment selection. Our primary service is professional alignment execution using the best method for each application.',
      },
      {
        q: 'Can you train our in-house maintenance team?',
        a: 'Yes, we offer on-site training programs covering alignment fundamentals, measurement techniques, and documentation practices.',
      },
    ],
  },
  {
    slug: 'foundation-alignment',
    title: 'Foundation Alignment',
    icon: 'bi-layers',
    shortDescription:
      'Foundation bolt positioning, anchor bolt surveys, and base plate alignment for heavy machinery.',
    description:
      'Precision foundation alignment services ensuring anchor bolts, base plates, and equipment foundations are correctly positioned before machinery arrives. We survey and mark foundation centers, verify bolt patterns, and ensure civil work meets mechanical alignment requirements.',
    image: industrialImage(8),
    imageAlt: 'Foundation alignment survey for industrial machinery base',
    benefits: [
      'Anchor bolt pattern verification and marking',
      'Foundation centerline and elevation surveys',
      'Base plate flatness assessment',
      'Early detection of civil work deviations',
      'Prevents costly rework during alignment work',
    ],
    faqs: [
      {
        q: 'When should foundation alignment be done?',
        a: 'Foundation surveys should be completed after civil work and before machinery delivery — ideally 2–4 weeks before alignment work to allow corrections if needed.',
      },
      {
        q: 'What if foundation deviations are found?',
        a: 'We provide detailed deviation reports with recommended corrections, working with your civil contractor to resolve issues before equipment arrives.',
      },
    ],
  },
];

export const getServiceBySlug = (slug) =>
  SERVICES_DATA.find((s) => s.slug === slug);

export default SERVICES_DATA;
