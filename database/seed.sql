-- ============================================================
-- Shukla Industrial — Seed Data
-- Location: database/seed.sql
-- Module 14 — initial admin, company info, and sample content
--
-- Idempotent: safe to re-run (skips on unique conflicts).
-- Default admin password: ChangeMe@123 (change after first login)
-- ============================================================

BEGIN;

-- ------------------------------------------------------------
-- Admin user
-- bcrypt hash for: ChangeMe@123
-- ------------------------------------------------------------
INSERT INTO users (email, hashed_password, full_name, is_active, is_superuser)
VALUES (
    'admin@shuklaindustrial.com',
    '$2b$12$i0CN7MUMknUUAHq69ZpGbuaA4.7DpzPL8Wrq8P7rQ6fB2ScVOCzZS',
    'Site Administrator',
    TRUE,
    TRUE
)
ON CONFLICT (email) DO NOTHING;

-- ------------------------------------------------------------
-- Company information
-- ------------------------------------------------------------
INSERT INTO company_information (
    company_name, tagline, description, phones, email, address, working_hours, stats
)
SELECT
    'SHUKLA INDUSTRIAL OPTICAL ALIGNMENT',
    'Precision • Accuracy • Reliability',
    'Leading provider of Industrial Optical Alignment, Machinery Installation, Industrial Surveying, and Paper Mill Projects across India with 18+ years of proven expertise.',
    '["+91 9510900608", "+91 8707305703"]'::jsonb,
    'sioaw98@yahoo.com',
    '{"line1": "India", "city": "", "state": "", "pincode": "", "country": "India", "full": "India — Address editable via Admin Panel"}'::jsonb,
    '{"days": "Monday - Saturday", "time": "09:00 AM - 07:00 PM", "emergency": "24x7 Emergency Support Available"}'::jsonb,
    '[
        {"value": 18, "suffix": "+", "label": "Years Experience"},
        {"value": 500, "suffix": "+", "label": "Projects Completed"},
        {"value": 100, "suffix": "+", "label": "Happy Clients"},
        {"value": 24, "suffix": "x7", "label": "Support Available"}
    ]'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM company_information LIMIT 1);

-- ------------------------------------------------------------
-- Site settings
-- ------------------------------------------------------------
INSERT INTO site_settings (map_embed_url, social_links, seo_defaults)
SELECT
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3671.0!2d72.8!3d23.0!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDAwJzAwLjAiTiA3MsKwNDgnMDAuMCJF!5e0!3m2!1sen!2sin!4v1',
    '{"whatsapp": "https://wa.me/919510900608", "facebook": "#", "instagram": "#", "linkedin": "#", "youtube": "#"}'::jsonb,
    '{
        "title": "Shukla Industrial Optical Alignment | Precision • Accuracy • Reliability",
        "description": "18+ years of Industrial Optical Alignment, Machinery Installation, Industrial Surveying, and Paper Mill Projects across India.",
        "keywords": "industrial optical alignment, theodolite alignment, machinery installation, paper mill projects, laser alignment, India"
    }'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM site_settings LIMIT 1);

-- ------------------------------------------------------------
-- Hero slides
-- ------------------------------------------------------------
INSERT INTO hero_slides (image_url, alt_text, caption, sort_order, is_active)
SELECT v.image_url, v.alt_text, v.caption, v.sort_order, TRUE
FROM (VALUES
    ('https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1920&q=80', 'Industrial optical alignment at paper mill', 'Precision Optical Alignment for Paper Mills', 0),
    ('https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=1920&q=80', 'Theodolite survey on industrial site', 'Theodolite-Based Industrial Surveying', 1),
    ('https://images.unsplash.com/photo-1565043589221-1a6fd9f4c837?auto=format&fit=crop&w=1920&q=80', 'Machinery installation project', 'Machinery Installation & Leveling', 2)
) AS v(image_url, alt_text, caption, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM hero_slides LIMIT 1);

-- ------------------------------------------------------------
-- Clients (23)
-- ------------------------------------------------------------
INSERT INTO clients (name, initials, category, category_label, featured, sort_order, is_active)
SELECT v.name, v.initials, v.category, v.category_label, v.featured, v.sort_order, TRUE
FROM (VALUES
    ('JK Paper', 'JK', 'paper', 'Paper Mill', TRUE, 0),
    ('Ballarpur Industries', 'BI', 'paper', 'Paper Mill', TRUE, 1),
    ('Emami Paper', 'EP', 'paper', 'Paper Mill', TRUE, 2),
    ('Century Paper', 'CP', 'paper', 'Paper Mill', TRUE, 3),
    ('ITC Tribeni', 'IT', 'paper', 'Paper Mill', TRUE, 4),
    ('Orient Paper', 'OP', 'paper', 'Paper Mill', TRUE, 5),
    ('NR Agarwal', 'NA', 'paper', 'Paper Mill', TRUE, 6),
    ('Mehali Paper', 'MP', 'paper', 'Paper Mill', TRUE, 7),
    ('Satia Paper', 'SP', 'paper', 'Paper Mill', FALSE, 8),
    ('Quantum Paper', 'QP', 'paper', 'Paper Mill', FALSE, 9),
    ('Khanna Paper', 'KP', 'paper', 'Paper Mill', FALSE, 10),
    ('Tamil Nadu Newsprint', 'TN', 'paper', 'Paper Mill', FALSE, 11),
    ('Andhra Pradesh Paper', 'AP', 'paper', 'Paper Mill', FALSE, 12),
    ('West Coast Paper', 'WC', 'paper', 'Paper Mill', FALSE, 13),
    ('Bindal Duplex', 'BD', 'paper', 'Duplex Board', FALSE, 14),
    ('Pakka Ltd', 'PL', 'paper', 'Paper Mill', FALSE, 15),
    ('Silverton Paper', 'SI', 'paper', 'Paper Mill', FALSE, 16),
    ('Aryan Paper', 'AR', 'paper', 'Paper Mill', FALSE, 17),
    ('Best Paper', 'BP', 'paper', 'Paper Mill', FALSE, 18),
    ('Tulsi Paper', 'TP', 'paper', 'Paper Mill', FALSE, 19),
    ('Nithya Packaging', 'NP', 'paper', 'Packaging', FALSE, 20),
    ('Sharma Fabricators & Erectors', 'SF', 'engineering', 'Engineering', FALSE, 21),
    ('Saloni Engineering', 'SE', 'engineering', 'Engineering', FALSE, 22)
) AS v(name, initials, category, category_label, featured, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM clients LIMIT 1);

-- ------------------------------------------------------------
-- Services (9)
-- ------------------------------------------------------------
INSERT INTO services (title, slug, short_description, description, icon, benefits, faqs, image_url, sort_order, is_active)
SELECT v.title, v.slug, v.short_desc, v.description, v.icon, v.benefits, v.faqs, v.image_url, v.sort_order, TRUE
FROM (VALUES
    (
        'Industrial Optical Alignment', 'industrial-optical-alignment',
        'Professional industrial optical alignment services for paper mills and industrial plants.',
        'Comprehensive industrial optical alignment delivered by Shukla Industrial with 18+ years of field expertise.',
        'bi-crosshair',
        '["OEM tolerance compliance", "Full documentation", "Experienced technicians"]'::jsonb,
        '[{"question": "What is Industrial Optical Alignment?", "answer": "Our industrial optical alignment service ensures precision alignment of paper machine and plant equipment."}]'::jsonb,
        'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80', 0
    ),
    (
        'Theodolite Alignment', 'theodolite-alignment',
        'Professional theodolite alignment services for paper mills and industrial plants.',
        'Comprehensive theodolite alignment delivered by Shukla Industrial with 18+ years of field expertise.',
        'bi-compass',
        '["OEM tolerance compliance", "Full documentation", "Experienced technicians"]'::jsonb,
        '[{"question": "What is Theodolite Alignment?", "answer": "Our theodolite alignment service ensures precision centerline establishment."}]'::jsonb,
        'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80', 1
    ),
    (
        'Machinery Installation', 'machinery-installation',
        'Professional machinery installation services for paper mills and industrial plants.',
        'Comprehensive machinery installation delivered by Shukla Industrial with 18+ years of field expertise.',
        'bi-gear-wide-connected',
        '["OEM tolerance compliance", "Full documentation", "Experienced technicians"]'::jsonb,
        '[{"question": "What is Machinery Installation?", "answer": "Our machinery installation service ensures proper erection and leveling."}]'::jsonb,
        'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80', 2
    ),
    (
        'Industrial Surveying', 'industrial-surveying',
        'Professional industrial surveying services for paper mills and industrial plants.',
        'Comprehensive industrial surveying delivered by Shukla Industrial with 18+ years of field expertise.',
        'bi-rulers',
        '["OEM tolerance compliance", "Full documentation", "Experienced technicians"]'::jsonb,
        '[{"question": "What is Industrial Surveying?", "answer": "Our industrial surveying service ensures accurate plant measurements."}]'::jsonb,
        'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80', 3
    ),
    (
        'Equipment Leveling', 'equipment-leveling',
        'Professional equipment leveling services for paper mills and industrial plants.',
        'Comprehensive equipment leveling delivered by Shukla Industrial with 18+ years of field expertise.',
        'bi-arrows-collapse',
        '["OEM tolerance compliance", "Full documentation", "Experienced technicians"]'::jsonb,
        '[{"question": "What is Equipment Leveling?", "answer": "Our equipment leveling service ensures proper machine foundation setup."}]'::jsonb,
        'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80', 4
    ),
    (
        'Machine Alignment', 'machine-alignment',
        'Professional machine alignment services for paper mills and industrial plants.',
        'Comprehensive machine alignment delivered by Shukla Industrial with 18+ years of field expertise.',
        'bi-bullseye',
        '["OEM tolerance compliance", "Full documentation", "Experienced technicians"]'::jsonb,
        '[{"question": "What is Machine Alignment?", "answer": "Our machine alignment service ensures running equipment precision."}]'::jsonb,
        'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80', 5
    ),
    (
        'Plant Installation', 'plant-installation',
        'Professional plant installation services for paper mills and industrial plants.',
        'Comprehensive plant installation delivered by Shukla Industrial with 18+ years of field expertise.',
        'bi-building-gear',
        '["OEM tolerance compliance", "Full documentation", "Experienced technicians"]'::jsonb,
        '[{"question": "What is Plant Installation?", "answer": "Our plant installation service covers turnkey project execution."}]'::jsonb,
        'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80', 6
    ),
    (
        'Laser Alignment Consultation', 'laser-alignment-consultation',
        'Professional laser alignment consultation services for paper mills and industrial plants.',
        'Comprehensive laser alignment consultation delivered by Shukla Industrial with 18+ years of field expertise.',
        'bi-lightning',
        '["OEM tolerance compliance", "Full documentation", "Experienced technicians"]'::jsonb,
        '[{"question": "What is Laser Alignment Consultation?", "answer": "Our consultation service guides laser alignment best practices."}]'::jsonb,
        'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80', 7
    ),
    (
        'Foundation Alignment', 'foundation-alignment',
        'Professional foundation alignment services for paper mills and industrial plants.',
        'Comprehensive foundation alignment delivered by Shukla Industrial with 18+ years of field expertise.',
        'bi-layers',
        '["OEM tolerance compliance", "Full documentation", "Experienced technicians"]'::jsonb,
        '[{"question": "What is Foundation Alignment?", "answer": "Our foundation alignment service ensures bolt pattern accuracy."}]'::jsonb,
        'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80', 8
    )
) AS v(title, slug, short_desc, description, icon, benefits, faqs, image_url, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM services LIMIT 1);

-- ------------------------------------------------------------
-- Projects (3 sample)
-- ------------------------------------------------------------
INSERT INTO projects (
    title, slug, client, location, industry, industry_label,
    completion_date, service_type, short_description, description, featured, sort_order, is_active
)
SELECT v.title, v.slug, v.client, v.location, v.industry, v.industry_label,
       v.completion_date::date, v.service_type, v.short_description, v.description, v.featured, v.sort_order, TRUE
FROM (VALUES
    (
        'JK Paper Unit — Full Paper Machine Alignment', 'jk-paper-full-alignment',
        'JK Paper', 'Songadh, Gujarat', 'paper-mill', 'Paper Mill',
        '2024-11-15', 'Industrial Optical Alignment',
        'Complete optical alignment of paper machine sections including press, dryer, and calendar groups.',
        'Executed comprehensive industrial optical alignment for JK Paper''s manufacturing unit — covering approach system alignment, press section centerlines, dryer can alignment, and calendar stack precision.',
        TRUE, 0
    ),
    (
        'Century Paper — Dryer Section Theodolite Survey', 'century-paper-dryer-survey',
        'Century Paper', 'Kalyan, Maharashtra', 'paper-mill', 'Paper Mill',
        '2024-08-22', 'Theodolite Alignment',
        'Theodolite-based centerline survey and alignment of multi-cylinder dryer section.',
        'Precision theodolite survey establishing dryer section centerlines and elevation benchmarks across 40+ cylinders.',
        TRUE, 1
    ),
    (
        'ITC Tribeni — Machinery Installation Project', 'itc-tribeni-machinery-install',
        'ITC Tribeni', 'Tribeni, West Bengal', 'paper-mill', 'Paper Mill',
        '2024-06-10', 'Machinery Installation',
        'Turnkey machinery erection, leveling, and alignment for new production line equipment.',
        'Managed complete machinery installation including foundation bolt surveys, equipment leveling, and integrated optical alignment.',
        TRUE, 2
    )
) AS v(title, slug, client, location, industry, industry_label, completion_date, service_type, short_description, description, featured, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM projects LIMIT 1);

INSERT INTO project_images (project_id, image_url, alt_text, sort_order)
SELECT p.id, v.image_url, v.alt_text, 0
FROM projects p
JOIN (VALUES
    ('jk-paper-full-alignment', 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80', 'JK Paper machine alignment project'),
    ('century-paper-dryer-survey', 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=800&q=80', 'Theodolite survey at Century Paper'),
    ('itc-tribeni-machinery-install', 'https://images.unsplash.com/photo-1518611507436-f9221403eca8?auto=format&fit=crop&w=800&q=80', 'Machinery installation at ITC Tribeni')
) AS v(slug, image_url, alt_text) ON p.slug = v.slug
WHERE NOT EXISTS (SELECT 1 FROM project_images LIMIT 1);

-- ------------------------------------------------------------
-- Gallery (3 sample)
-- ------------------------------------------------------------
INSERT INTO gallery (title, company, location, date, category, category_label, description, featured, sort_order, is_active)
SELECT v.title, v.company, v.location, v.date, v.category, v.category_label, v.description, v.featured, v.sort_order, TRUE
FROM (VALUES
    ('Paper Machine Roller Alignment', 'JK Paper', 'Songadh, Gujarat', '2024-11-10', 'alignment', 'Optical Alignment',
     'Precision optical alignment of paper machine press section rollers using theodolite reference lines.', TRUE, 0),
    ('Theodolite Centerline Survey', 'Century Paper', 'Kalyan, Maharashtra', '2024-08-18', 'surveying', 'Surveying',
     'Theodolite-based centerline establishment for dryer section cylinder alignment.', TRUE, 1),
    ('Machinery Erection & Leveling', 'ITC Tribeni', 'Tribeni, West Bengal', '2024-06-05', 'installation', 'Installation',
     'Heavy machinery erection with precision leveling before final optical alignment.', TRUE, 2)
) AS v(title, company, location, date, category, category_label, description, featured, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM gallery LIMIT 1);

INSERT INTO gallery_images (gallery_id, image_url, alt_text, sort_order)
SELECT g.id, v.image_url, v.alt_text, 0
FROM gallery g
JOIN (VALUES
    ('Paper Machine Roller Alignment', 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80', 'Paper machine roller optical alignment at JK Paper'),
    ('Theodolite Centerline Survey', 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=800&q=80', 'Theodolite survey at Century Paper mill'),
    ('Machinery Erection & Leveling', 'https://images.unsplash.com/photo-1565043589221-1a6fd9f4c837?auto=format&fit=crop&w=800&q=80', 'Machinery installation at ITC Tribeni')
) AS v(title, image_url, alt_text) ON g.title = v.title
WHERE NOT EXISTS (SELECT 1 FROM gallery_images LIMIT 1);

-- ------------------------------------------------------------
-- Testimonials (3 sample)
-- ------------------------------------------------------------
INSERT INTO testimonials (name, designation, company, quote, rating, initials, featured, sort_order, is_active)
SELECT v.name, v.designation, v.company, v.quote, v.rating, v.initials, TRUE, v.sort_order, TRUE
FROM (VALUES
    ('R.K. Sharma', 'Plant Manager', 'JK Paper', 'Exceptional alignment work with precise documentation and on-time delivery. Highly recommended for paper mill projects.', 5, 'RS', 0),
    ('A. Mehta', 'Maintenance Head', 'Century Paper', 'Reliable theodolite surveys and a very professional team. They understand OEM tolerances thoroughly.', 5, 'AM', 1),
    ('S. Banerjee', 'Project Engineer', 'ITC Tribeni', 'On-time machinery installation with all alignment tolerances met. Excellent communication throughout the project.', 5, 'SB', 2)
) AS v(name, designation, company, quote, rating, initials, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM testimonials LIMIT 1);

-- ------------------------------------------------------------
-- Reset sequences after explicit seed inserts
-- ------------------------------------------------------------
SELECT setval(pg_get_serial_sequence('users', 'id'), COALESCE((SELECT MAX(id) FROM users), 1));
SELECT setval(pg_get_serial_sequence('clients', 'id'), COALESCE((SELECT MAX(id) FROM clients), 1));
SELECT setval(pg_get_serial_sequence('services', 'id'), COALESCE((SELECT MAX(id) FROM services), 1));
SELECT setval(pg_get_serial_sequence('projects', 'id'), COALESCE((SELECT MAX(id) FROM projects), 1));
SELECT setval(pg_get_serial_sequence('project_images', 'id'), COALESCE((SELECT MAX(id) FROM project_images), 1));
SELECT setval(pg_get_serial_sequence('gallery', 'id'), COALESCE((SELECT MAX(id) FROM gallery), 1));
SELECT setval(pg_get_serial_sequence('gallery_images', 'id'), COALESCE((SELECT MAX(id) FROM gallery_images), 1));
SELECT setval(pg_get_serial_sequence('testimonials', 'id'), COALESCE((SELECT MAX(id) FROM testimonials), 1));
SELECT setval(pg_get_serial_sequence('hero_slides', 'id'), COALESCE((SELECT MAX(id) FROM hero_slides), 1));

COMMIT;
