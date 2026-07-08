-- ============================================================
-- Shukla Industrial Optical Alignment — PostgreSQL Schema
-- Location: database/schema.sql
-- Module 14 — mirrors Alembic migration 001_initial
--
-- Used for manual PostgreSQL setup (psql) or pgAdmin.
-- ============================================================

BEGIN;

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------
-- users
-- ------------------------------------------------------------
CREATE TABLE users (
    id              SERIAL PRIMARY KEY,
    email           VARCHAR(255) NOT NULL UNIQUE,
    hashed_password VARCHAR(255) NOT NULL,
    full_name       VARCHAR(255) NOT NULL DEFAULT 'Admin',
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    is_superuser    BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX ix_users_email ON users (email);

-- ------------------------------------------------------------
-- projects & project_images
-- ------------------------------------------------------------
CREATE TABLE projects (
    id                SERIAL PRIMARY KEY,
    title             VARCHAR(255) NOT NULL,
    slug              VARCHAR(255) NOT NULL UNIQUE,
    client            VARCHAR(255) NOT NULL,
    location          VARCHAR(255) NOT NULL,
    industry          VARCHAR(100) NOT NULL,
    industry_label    VARCHAR(255) NOT NULL,
    completion_date   DATE,
    service_type      VARCHAR(255) NOT NULL,
    short_description TEXT NOT NULL DEFAULT '',
    description       TEXT NOT NULL DEFAULT '',
    featured          BOOLEAN NOT NULL DEFAULT FALSE,
    is_active         BOOLEAN NOT NULL DEFAULT TRUE,
    sort_order        INTEGER NOT NULL DEFAULT 0,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX ix_projects_slug ON projects (slug);
CREATE INDEX ix_projects_industry ON projects (industry);

CREATE TABLE project_images (
    id          SERIAL PRIMARY KEY,
    project_id  INTEGER NOT NULL REFERENCES projects (id) ON DELETE CASCADE,
    image_url   VARCHAR(500) NOT NULL,
    alt_text    VARCHAR(255) NOT NULL DEFAULT '',
    sort_order  INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX ix_project_images_project_id ON project_images (project_id);

-- ------------------------------------------------------------
-- gallery & gallery_images
-- ------------------------------------------------------------
CREATE TABLE gallery (
    id              SERIAL PRIMARY KEY,
    title           VARCHAR(255) NOT NULL,
    company         VARCHAR(255) NOT NULL,
    location        VARCHAR(255) NOT NULL,
    date            VARCHAR(50),
    category        VARCHAR(100) NOT NULL DEFAULT 'general',
    category_label  VARCHAR(100) NOT NULL DEFAULT 'General',
    description     TEXT NOT NULL DEFAULT '',
    featured        BOOLEAN NOT NULL DEFAULT FALSE,
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    sort_order      INTEGER NOT NULL DEFAULT 0,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE gallery_images (
    id          SERIAL PRIMARY KEY,
    gallery_id  INTEGER NOT NULL REFERENCES gallery (id) ON DELETE CASCADE,
    image_url   VARCHAR(500) NOT NULL,
    alt_text    VARCHAR(255) NOT NULL DEFAULT '',
    sort_order  INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX ix_gallery_images_gallery_id ON gallery_images (gallery_id);

-- ------------------------------------------------------------
-- clients
-- ------------------------------------------------------------
CREATE TABLE clients (
    id              SERIAL PRIMARY KEY,
    name            VARCHAR(255) NOT NULL,
    initials        VARCHAR(10) NOT NULL DEFAULT '',
    category        VARCHAR(100) NOT NULL,
    category_label  VARCHAR(100) NOT NULL,
    logo_url        VARCHAR(500),
    website         VARCHAR(500),
    featured        BOOLEAN NOT NULL DEFAULT FALSE,
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    sort_order      INTEGER NOT NULL DEFAULT 0,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX ix_clients_category ON clients (category);

-- ------------------------------------------------------------
-- services & service_images
-- ------------------------------------------------------------
CREATE TABLE services (
    id                SERIAL PRIMARY KEY,
    title             VARCHAR(255) NOT NULL,
    slug              VARCHAR(255) NOT NULL UNIQUE,
    short_description TEXT NOT NULL DEFAULT '',
    description       TEXT NOT NULL DEFAULT '',
    icon              VARCHAR(100) NOT NULL DEFAULT 'bi-gear',
    benefits          JSONB DEFAULT '[]'::jsonb,
    faqs              JSONB DEFAULT '[]'::jsonb,
    image_url         VARCHAR(500),
    is_active         BOOLEAN NOT NULL DEFAULT TRUE,
    sort_order        INTEGER NOT NULL DEFAULT 0,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX ix_services_slug ON services (slug);

CREATE TABLE service_images (
    id          SERIAL PRIMARY KEY,
    service_id  INTEGER NOT NULL REFERENCES services (id) ON DELETE CASCADE,
    image_url   VARCHAR(500) NOT NULL,
    alt_text    VARCHAR(255) NOT NULL DEFAULT '',
    sort_order  INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX ix_service_images_service_id ON service_images (service_id);

-- ------------------------------------------------------------
-- testimonials
-- ------------------------------------------------------------
CREATE TABLE testimonials (
    id           SERIAL PRIMARY KEY,
    name         VARCHAR(255) NOT NULL,
    designation  VARCHAR(255) NOT NULL DEFAULT '',
    company      VARCHAR(255) NOT NULL,
    quote        TEXT NOT NULL,
    rating       INTEGER NOT NULL DEFAULT 5,
    initials     VARCHAR(10) NOT NULL DEFAULT '',
    featured     BOOLEAN NOT NULL DEFAULT FALSE,
    is_active    BOOLEAN NOT NULL DEFAULT TRUE,
    sort_order   INTEGER NOT NULL DEFAULT 0,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------
-- contact_messages
-- ------------------------------------------------------------
CREATE TABLE contact_messages (
    id               SERIAL PRIMARY KEY,
    name             VARCHAR(255) NOT NULL,
    phone            VARCHAR(50) NOT NULL,
    email            VARCHAR(255) NOT NULL,
    company_name     VARCHAR(255) NOT NULL DEFAULT '',
    city             VARCHAR(255) NOT NULL DEFAULT '',
    service_required VARCHAR(255) NOT NULL DEFAULT '',
    message          TEXT NOT NULL,
    is_read          BOOLEAN NOT NULL DEFAULT FALSE,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX ix_contact_messages_is_read ON contact_messages (is_read);
CREATE INDEX ix_contact_messages_created_at ON contact_messages (created_at DESC);

-- ------------------------------------------------------------
-- hero_slides
-- ------------------------------------------------------------
CREATE TABLE hero_slides (
    id          SERIAL PRIMARY KEY,
    image_url   VARCHAR(500) NOT NULL,
    alt_text    VARCHAR(255) NOT NULL DEFAULT '',
    caption     VARCHAR(500),
    sort_order  INTEGER NOT NULL DEFAULT 0,
    is_active   BOOLEAN NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------
-- company_information (singleton)
-- ------------------------------------------------------------
CREATE TABLE company_information (
    id               SERIAL PRIMARY KEY,
    company_name     VARCHAR(255) NOT NULL,
    tagline          VARCHAR(255) NOT NULL DEFAULT '',
    description      TEXT NOT NULL DEFAULT '',
    logo             VARCHAR(500) DEFAULT '',
    phone_1          VARCHAR(30) DEFAULT '',
    phone_2          VARCHAR(30) DEFAULT '',
    phones           JSONB DEFAULT '[]'::jsonb,
    email            VARCHAR(255) NOT NULL DEFAULT '',
    admin_login_email VARCHAR(255) NOT NULL UNIQUE,
    whatsapp_number  VARCHAR(20) DEFAULT '',
    office_address   TEXT DEFAULT '',
    google_map_url   VARCHAR(1000) DEFAULT '',
    facebook         VARCHAR(500) DEFAULT '',
    instagram        VARCHAR(500) DEFAULT '',
    linkedin         VARCHAR(500) DEFAULT '',
    youtube          VARCHAR(500) DEFAULT '',
    address          JSONB DEFAULT '{}'::jsonb,
    working_hours    JSONB DEFAULT '{}'::jsonb,
    stats            JSONB DEFAULT '[]'::jsonb,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------
-- site_settings (singleton)
-- ------------------------------------------------------------
CREATE TABLE site_settings (
    id             SERIAL PRIMARY KEY,
    map_embed_url  VARCHAR(1000) NOT NULL DEFAULT '',
    social_links   JSONB DEFAULT '{}'::jsonb,
    seo_defaults   JSONB DEFAULT '{}'::jsonb,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------
-- Alembic version tracking (keeps migrations in sync with schema.sql)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS alembic_version (
    version_num VARCHAR(32) NOT NULL,
    CONSTRAINT alembic_version_pkc PRIMARY KEY (version_num)
);

INSERT INTO alembic_version (version_num)
VALUES ('002_company_fields')
ON CONFLICT (version_num) DO NOTHING;

COMMIT;
