-- ============================================================
-- Shukla Industrial — Database Reset (DEVELOPMENT ONLY)
-- Location: database/reset.sql
--
-- WARNING: Drops all application tables and data.
-- Usage: psql -U shukla_user -d shukla_industrial -f database/reset.sql
-- Then re-run schema.sql + seed.sql OR: alembic upgrade head + seed script
-- ============================================================

BEGIN;

DROP TABLE IF EXISTS project_images CASCADE;
DROP TABLE IF EXISTS gallery_images CASCADE;
DROP TABLE IF EXISTS service_images CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS gallery CASCADE;
DROP TABLE IF EXISTS clients CASCADE;
DROP TABLE IF EXISTS services CASCADE;
DROP TABLE IF EXISTS testimonials CASCADE;
DROP TABLE IF EXISTS contact_messages CASCADE;
DROP TABLE IF EXISTS hero_slides CASCADE;
DROP TABLE IF EXISTS company_information CASCADE;
DROP TABLE IF EXISTS site_settings CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS alembic_version CASCADE;

COMMIT;
