const prisma = require('../prisma/client');
const settings = require('../config/settings');
const { getPasswordHash } = require('../utils/security');
const {
  DEFAULT_ADMIN_LOGIN_EMAIL,
  DEFAULT_COMPANY_NAME,
  DEFAULT_PUBLIC_EMAIL,
  normalizeEmail,
} = require('./adminLogin');

async function seedAdmin() {
  const company = await prisma.companyInformation.findFirst();
  const adminEmail = normalizeEmail(
    (company && company.admin_login_email) || settings.adminEmail || DEFAULT_ADMIN_LOGIN_EMAIL
  );

  const existingByEmail = await prisma.user.findFirst({
    where: { email: { equals: adminEmail, mode: 'insensitive' } },
  });
  if (existingByEmail) return;

  const existingSuperuser = await prisma.user.findFirst({
    where: { is_superuser: true },
  });
  if (existingSuperuser) return;

  await prisma.user.create({
    data: {
      email: adminEmail,
      hashed_password: await getPasswordHash(settings.adminPassword),
      full_name: 'Site Administrator',
      is_active: true,
      is_superuser: true,
    },
  });
}

async function seedCompanyAndSettings() {
  const existingCompany = await prisma.companyInformation.findFirst();

  if (!existingCompany) {
    await prisma.companyInformation.create({
      data: {
        company_name: DEFAULT_COMPANY_NAME,
        tagline: 'Precision • Accuracy • Reliability',
        description:
          'Leading provider of Industrial Optical Alignment, Theodolite Alignment, Industrial Surveying, and Paper Mill Alignment Projects across India with 18+ years of proven expertise.',
        logo: '',
        phone_1: '+91 9510900608',
        phone_2: '+91 8707305703',
        phones: ['+91 9510900608', '+91 8707305703'],
        email: DEFAULT_PUBLIC_EMAIL,
        admin_login_email: settings.adminEmail || DEFAULT_ADMIN_LOGIN_EMAIL,
        whatsapp_number: '919510900608',
        office_address:
          'A302 Sushanti Co. Op. Housings Society Koppal Road GIDC Vapi Valsad 396195',
        google_map_url:
          'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7521.4!2d72.9261012!3d20.3787777!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be0ce4b2fd124cb%3A0xff6c5955d1b4310d!2sSushanti%20Housing%20Society!5e0!3m2!1sen!2sin!4v1',
        facebook: '#',
        instagram: '#',
        linkedin: '#',
        youtube: '#',
        address: {
          line1: 'A302 Sushanti Co. Op. Housings Society',
          line2: 'Koppal Road GIDC Vapi',
          city: 'Vapi',
          state: 'Gujarat',
          pincode: '396195',
          country: 'India',
          full: 'A302 Sushanti Co. Op. Housings Society Koppal Road GIDC Vapi Valsad 396195',
        },
        working_hours: {
          days: 'Monday – Saturday',
          time: '09:00 AM – 07:00 PM',
          emergency: '24×7 Emergency Support Available',
        },
        stats: [
          { value: 18, suffix: '+', label: 'Years Experience' },
          { value: 500, suffix: '+', label: 'Projects Completed' },
          { value: 100, suffix: '+', label: 'Happy Clients' },
          { value: 24, suffix: 'x7', label: 'Support Available' },
        ],
      },
    });
  } else if (!existingCompany.admin_login_email) {
    await prisma.companyInformation.update({
      where: { id: existingCompany.id },
      data: { admin_login_email: settings.adminEmail || DEFAULT_ADMIN_LOGIN_EMAIL },
    });
  }

  const existingSettings = await prisma.siteSettings.findFirst();
  if (!existingSettings) {
    await prisma.siteSettings.create({
      data: {
        map_embed_url:
          'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3671.0!2d72.8!3d23.0!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDAwJzAwLjAiTiA3MsKwNDgnMDAuMCJF!5e0!3m2!1sen!2sin!4v1',
        social_links: {
          whatsapp: 'https://wa.me/919510900608',
          facebook: '#',
          instagram: '#',
          linkedin: '#',
          youtube: '#',
        },
        seo_defaults: {
          title: 'Shukla Industrial Optical Alignment | Precision • Accuracy • Reliability',
          description:
            '18+ years of Industrial Optical Alignment, Theodolite Alignment, Industrial Surveying, and Paper Mill Alignment Projects across India.',
          keywords:
            'industrial optical alignment, theodolite alignment, machine alignment, shaft alignment, industrial surveying, precision measurement, paper mill alignment, India',
        },
      },
    });
  }
}

async function seedHeroSlides() {
  const count = await prisma.heroSlide.count();
  if (count > 0) return;

  const slides = [
    [
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1920&q=80',
      'Industrial optical alignment at paper mill',
      'Precision Optical Alignment for Paper Mills',
    ],
    [
      'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=1920&q=80',
      'Theodolite survey on industrial site',
      'Theodolite-Based Industrial Surveying',
    ],
    [
      'https://images.unsplash.com/photo-1565043589221-1a6fd9f4c837?auto=format&fit=crop&w=1920&q=80',
      'Precision machinery alignment at industrial plant',
      'Machine Alignment & Leveling',
    ],
  ];

  await prisma.heroSlide.createMany({
    data: slides.map(([image_url, alt_text, caption], idx) => ({
      image_url,
      alt_text,
      caption,
      sort_order: idx,
      is_active: true,
    })),
  });
}

async function seedClients() {
  const count = await prisma.client.count();
  if (count > 0) return;

  const paperClients = [
    ['JK Paper', 'JK', 'paper', 'Paper Mill'],
    ['Ballarpur Industries', 'BI', 'paper', 'Paper Mill'],
    ['Emami Paper', 'EP', 'paper', 'Paper Mill'],
    ['Century Paper', 'CP', 'paper', 'Paper Mill'],
    ['ITC Tribeni', 'IT', 'paper', 'Paper Mill'],
    ['Orient Paper', 'OP', 'paper', 'Paper Mill'],
    ['NR Agarwal', 'NA', 'paper', 'Paper Mill'],
    ['Mehali Paper', 'MP', 'paper', 'Paper Mill'],
    ['Satia Paper', 'SP', 'paper', 'Paper Mill'],
    ['Quantum Paper', 'QP', 'paper', 'Paper Mill'],
    ['Khanna Paper', 'KP', 'paper', 'Paper Mill'],
    ['Tamil Nadu Newsprint', 'TN', 'paper', 'Paper Mill'],
    ['Andhra Pradesh Paper', 'AP', 'paper', 'Paper Mill'],
    ['West Coast Paper', 'WC', 'paper', 'Paper Mill'],
    ['Bindal Duplex', 'BD', 'paper', 'Duplex Board'],
    ['Pakka Ltd', 'PL', 'paper', 'Paper Mill'],
    ['Silverton Paper', 'SI', 'paper', 'Paper Mill'],
    ['Aryan Paper', 'AR', 'paper', 'Paper Mill'],
    ['Best Paper', 'BP', 'paper', 'Paper Mill'],
    ['Tulsi Paper', 'TP', 'paper', 'Paper Mill'],
    ['Nithya Packaging', 'NP', 'paper', 'Packaging'],
  ];
  const engClients = [
    ['Sharma Fabricators & Erectors', 'SF', 'engineering', 'Engineering'],
    ['Saloni Engineering', 'SE', 'engineering', 'Engineering'],
  ];

  const all = [...paperClients, ...engClients];
  await prisma.client.createMany({
    data: all.map(([name, initials, category, category_label], idx) => ({
      name,
      initials,
      category,
      category_label,
      featured: idx < 8,
      sort_order: idx,
      is_active: true,
    })),
  });
}

async function seedServices() {
  const count = await prisma.service.count();
  if (count > 0) return;

  const services = [
    ['Industrial Optical Alignment', 'industrial-optical-alignment', 'bi-crosshair'],
    ['Precision Optical Alignment', 'precision-optical-alignment', 'bi-crosshair2'],
    ['Theodolite Alignment', 'theodolite-alignment', 'bi-compass'],
    ['Machine Alignment', 'machine-alignment', 'bi-gear-wide-connected'],
    ['Shaft Alignment', 'shaft-alignment', 'bi-bullseye'],
    ['Equipment Alignment', 'equipment-alignment', 'bi-arrows-collapse'],
    ['Foundation Level Checking', 'foundation-level-checking', 'bi-layers'],
    ['Industrial Surveying', 'industrial-surveying', 'bi-rulers'],
    ['Precision Measurement', 'precision-measurement', 'bi-rulers'],
    ['Alignment Inspection', 'alignment-inspection', 'bi-search'],
    ['Alignment Calibration', 'alignment-calibration', 'bi-sliders'],
    ['Industrial Geometry Verification', 'industrial-geometry-verification', 'bi-building-gear'],
  ];

  for (let idx = 0; idx < services.length; idx += 1) {
    const [title, slug, icon] = services[idx];
    await prisma.service.create({
      data: {
        title,
        slug,
        short_description: `Professional ${title.toLowerCase()} services for paper mills and industrial plants.`,
        description: `Comprehensive ${title.toLowerCase()} delivered by Shukla Industrial with 18+ years of field expertise.`,
        icon,
        benefits: ['OEM tolerance compliance', 'Full documentation', 'Experienced technicians'],
        faqs: [
          {
            question: `What is ${title}?`,
            answer: `Our ${title.toLowerCase()} service ensures precision alignment.`,
          },
        ],
        image_url:
          'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80',
        sort_order: idx,
        is_active: true,
      },
    });
  }
}

async function seedProjects() {
  const count = await prisma.project.count();
  if (count > 0) return;

  const projects = [
    {
      title: 'JK Paper Unit — Full Paper Machine Alignment',
      slug: 'jk-paper-full-alignment',
      client: 'JK Paper',
      location: 'Songadh, Gujarat',
      industry: 'paper-mill',
      industry_label: 'Paper Mill',
      completion_date: new Date('2024-11-15'),
      service_type: 'Industrial Optical Alignment',
      featured: true,
      short_description:
        'Complete optical alignment of paper machine sections including press, dryer, and calendar groups.',
      description: "Executed comprehensive industrial optical alignment for JK Paper's manufacturing unit.",
      images: [
        [
          'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80',
          'JK Paper machine alignment',
        ],
      ],
    },
    {
      title: 'Century Paper — Dryer Section Theodolite Survey',
      slug: 'century-paper-dryer-survey',
      client: 'Century Paper',
      location: 'Kalyan, Maharashtra',
      industry: 'paper-mill',
      industry_label: 'Paper Mill',
      completion_date: new Date('2024-08-22'),
      service_type: 'Theodolite Alignment',
      featured: true,
      short_description:
        'Theodolite-based centerline survey and alignment of multi-cylinder dryer section.',
      description:
        'Precision theodolite survey establishing dryer section centerlines and elevation benchmarks.',
      images: [
        [
          'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=800&q=80',
          'Theodolite survey at Century Paper',
        ],
      ],
    },
    {
      title: 'ITC Tribeni — Production Line Optical Alignment',
      slug: 'itc-tribeni-production-line-alignment',
      client: 'ITC Tribeni',
      location: 'Tribeni, West Bengal',
      industry: 'paper-mill',
      industry_label: 'Paper Mill',
      completion_date: new Date('2024-06-10'),
      service_type: 'Precision Optical Alignment',
      featured: true,
      short_description:
        'Precision leveling, centerline survey, and optical alignment for new production line equipment.',
      description:
        'Executed comprehensive optical alignment including foundation bolt surveys and equipment leveling.',
      images: [
        [
          'https://images.unsplash.com/photo-1518611507436-f9221403eca8?auto=format&fit=crop&w=800&q=80',
          'Production line optical alignment at ITC Tribeni',
        ],
      ],
    },
  ];

  for (let idx = 0; idx < projects.length; idx += 1) {
    const pdata = projects[idx];
    await prisma.project.create({
      data: {
        title: pdata.title,
        slug: pdata.slug,
        client: pdata.client,
        location: pdata.location,
        industry: pdata.industry,
        industry_label: pdata.industry_label,
        completion_date: pdata.completion_date,
        service_type: pdata.service_type,
        short_description: pdata.short_description,
        description: pdata.description,
        featured: pdata.featured,
        sort_order: idx,
        is_active: true,
        images: {
          create: pdata.images.map(([image_url, alt_text], i) => ({
            image_url,
            alt_text,
            sort_order: i,
          })),
        },
      },
    });
  }
}

async function seedGallery() {
  const count = await prisma.gallery.count();
  if (count > 0) return;

  const items = [
    [
      'Paper Machine Roller Alignment',
      'JK Paper',
      'Songadh, Gujarat',
      '2024-11-10',
      'alignment',
      'Optical Alignment',
      true,
    ],
    [
      'Theodolite Centerline Survey',
      'Century Paper',
      'Kalyan, Maharashtra',
      '2024-08-18',
      'surveying',
      'Surveying',
      true,
    ],
    [
      'Production Line Leveling & Alignment',
      'ITC Tribeni',
      'Tribeni, West Bengal',
      '2024-06-05',
      'alignment',
      'Optical Alignment',
      true,
    ],
  ];
  const urls = [
    'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1565043589221-1a6fd9f4c837?auto=format&fit=crop&w=800&q=80',
  ];

  for (let idx = 0; idx < items.length; idx += 1) {
    const [title, company, location, date, category, category_label, featured] = items[idx];
    await prisma.gallery.create({
      data: {
        title,
        company,
        location,
        date,
        category,
        category_label,
        description: `Field work documentation — ${title}.`,
        featured,
        sort_order: idx,
        is_active: true,
        images: {
          create: [{ image_url: urls[idx], alt_text: title, sort_order: 0 }],
        },
      },
    });
  }
}

async function seedTestimonials() {
  const count = await prisma.testimonial.count();
  if (count > 0) return;

  const items = [
    ['R.K. Sharma', 'Plant Manager', 'JK Paper', 'Exceptional alignment work with precise documentation.', 5, 'RS'],
    ['A. Mehta', 'Maintenance Head', 'Century Paper', 'Reliable theodolite surveys and professional team.', 5, 'AM'],
    ['S. Banerjee', 'Project Engineer', 'ITC Tribeni', 'On-time optical alignment with all tolerances met.', 5, 'SB'],
  ];

  await prisma.testimonial.createMany({
    data: items.map(([name, designation, company, quote, rating, initials], idx) => ({
      name,
      designation,
      company,
      quote,
      rating,
      initials,
      featured: true,
      sort_order: idx,
      is_active: true,
    })),
  });
}

async function runAllSeeds() {
  await seedCompanyAndSettings();
  await seedAdmin();
  await seedHeroSlides();
  await seedClients();
  await seedServices();
  await seedProjects();
  await seedGallery();
  await seedTestimonials();
}

module.exports = {
  seedAdmin,
  seedCompanyAndSettings,
  seedHeroSlides,
  seedClients,
  seedServices,
  seedProjects,
  seedGallery,
  seedTestimonials,
  runAllSeeds,
};
