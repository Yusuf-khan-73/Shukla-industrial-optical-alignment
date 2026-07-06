"""
Database seeding — admin user and initial content.
Location: server/services/seed.py
"""
from datetime import date

from sqlalchemy.orm import Session

from config.settings import settings
from core.security import get_password_hash
from models.client import Client
from models.company import CompanyInformation
from models.gallery import Gallery, GalleryImage
from models.hero import HeroSlide
from models.project import Project, ProjectImage
from models.service import Service
from models.site_settings import SiteSettings
from models.testimonial import Testimonial
from models.user import User


def seed_admin(db: Session) -> None:
    existing = db.query(User).filter(User.email == settings.admin_email).first()
    if existing:
        return
    db.add(
        User(
            email=settings.admin_email,
            hashed_password=get_password_hash(settings.admin_password),
            full_name="Site Administrator",
            is_active=True,
            is_superuser=True,
        )
    )
    db.commit()


def seed_company_and_settings(db: Session) -> None:
    if not db.query(CompanyInformation).first():
        db.add(
            CompanyInformation(
                company_name="SHUKLA INDUSTRIAL OPTICAL ALIGNMENT",
                tagline="Precision • Accuracy • Reliability",
                description=(
                    "Leading provider of Industrial Optical Alignment, Machinery Installation, "
                    "Industrial Surveying, and Paper Mill Projects across India with 18+ years "
                    "of proven expertise."
                ),
                phones=["+91 9510900608", "+91 8707305703"],
                email="sioaw98@yahoo.com",
                address={
                    "line1": "India",
                    "city": "",
                    "state": "",
                    "pincode": "",
                    "country": "India",
                    "full": "India — Address editable via Admin Panel",
                },
                working_hours={
                    "days": "Monday - Saturday",
                    "time": "09:00 AM - 07:00 PM",
                    "emergency": "24x7 Emergency Support Available",
                },
                stats=[
                    {"value": 18, "suffix": "+", "label": "Years Experience"},
                    {"value": 500, "suffix": "+", "label": "Projects Completed"},
                    {"value": 100, "suffix": "+", "label": "Happy Clients"},
                    {"value": 24, "suffix": "x7", "label": "Support Available"},
                ],
            )
        )

    if not db.query(SiteSettings).first():
        db.add(
            SiteSettings(
                map_embed_url=(
                    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3671.0!2d72.8!3d23.0!"
                    "2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDAwJzAwLjAiTiA3"
                    "MsKwNDgnMDAuMCJF!5e0!3m2!1sen!2sin!4v1"
                ),
                social_links={
                    "whatsapp": "https://wa.me/919510900608",
                    "facebook": "#",
                    "instagram": "#",
                    "linkedin": "#",
                    "youtube": "#",
                },
                seo_defaults={
                    "title": "Shukla Industrial Optical Alignment | Precision • Accuracy • Reliability",
                    "description": (
                        "18+ years of Industrial Optical Alignment, Machinery Installation, "
                        "Industrial Surveying, and Paper Mill Projects across India."
                    ),
                    "keywords": (
                        "industrial optical alignment, theodolite alignment, machinery installation, "
                        "paper mill projects, laser alignment, India"
                    ),
                },
            )
        )
    db.commit()


def seed_hero_slides(db: Session) -> None:
    if db.query(HeroSlide).count() > 0:
        return
    slides = [
        (
            "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1920&q=80",
            "Industrial optical alignment at paper mill",
            "Precision Optical Alignment for Paper Mills",
        ),
        (
            "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=1920&q=80",
            "Theodolite survey on industrial site",
            "Theodolite-Based Industrial Surveying",
        ),
        (
            "https://images.unsplash.com/photo-1565043589221-1a6fd9f4c837?auto=format&fit=crop&w=1920&q=80",
            "Machinery installation project",
            "Machinery Installation & Leveling",
        ),
    ]
    for idx, (url, alt, caption) in enumerate(slides):
        db.add(HeroSlide(image_url=url, alt_text=alt, caption=caption, sort_order=idx, is_active=True))
    db.commit()


def seed_clients(db: Session) -> None:
    if db.query(Client).count() > 0:
        return
    paper_clients = [
        ("JK Paper", "JK", "paper", "Paper Mill"),
        ("Ballarpur Industries", "BI", "paper", "Paper Mill"),
        ("Emami Paper", "EP", "paper", "Paper Mill"),
        ("Century Paper", "CP", "paper", "Paper Mill"),
        ("ITC Tribeni", "IT", "paper", "Paper Mill"),
        ("Orient Paper", "OP", "paper", "Paper Mill"),
        ("NR Agarwal", "NA", "paper", "Paper Mill"),
        ("Mehali Paper", "MP", "paper", "Paper Mill"),
        ("Satia Paper", "SP", "paper", "Paper Mill"),
        ("Quantum Paper", "QP", "paper", "Paper Mill"),
        ("Khanna Paper", "KP", "paper", "Paper Mill"),
        ("Tamil Nadu Newsprint", "TN", "paper", "Paper Mill"),
        ("Andhra Pradesh Paper", "AP", "paper", "Paper Mill"),
        ("West Coast Paper", "WC", "paper", "Paper Mill"),
        ("Bindal Duplex", "BD", "paper", "Duplex Board"),
        ("Pakka Ltd", "PL", "paper", "Paper Mill"),
        ("Silverton Paper", "SI", "paper", "Paper Mill"),
        ("Aryan Paper", "AR", "paper", "Paper Mill"),
        ("Best Paper", "BP", "paper", "Paper Mill"),
        ("Tulsi Paper", "TP", "paper", "Paper Mill"),
        ("Nithya Packaging", "NP", "paper", "Packaging"),
    ]
    eng_clients = [
        ("Sharma Fabricators & Erectors", "SF", "engineering", "Engineering"),
        ("Saloni Engineering", "SE", "engineering", "Engineering"),
    ]
    for idx, (name, initials, cat, label) in enumerate(paper_clients + eng_clients):
        db.add(
            Client(
                name=name,
                initials=initials,
                category=cat,
                category_label=label,
                featured=idx < 8,
                sort_order=idx,
                is_active=True,
            )
        )
    db.commit()


def seed_services(db: Session) -> None:
    if db.query(Service).count() > 0:
        return
    services = [
        ("Industrial Optical Alignment", "industrial-optical-alignment", "bi-crosshair", True),
        ("Theodolite Alignment", "theodolite-alignment", "bi-compass", True),
        ("Machinery Installation", "machinery-installation", "bi-gear-wide-connected", True),
        ("Industrial Surveying", "industrial-surveying", "bi-rulers", False),
        ("Equipment Leveling", "equipment-leveling", "bi-arrows-collapse", False),
        ("Machine Alignment", "machine-alignment", "bi-bullseye", False),
        ("Plant Installation", "plant-installation", "bi-building-gear", False),
        ("Laser Alignment Consultation", "laser-alignment-consultation", "bi-lightning", False),
        ("Foundation Alignment", "foundation-alignment", "bi-layers", False),
    ]
    for idx, (title, slug, icon, _featured) in enumerate(services):
        db.add(
            Service(
                title=title,
                slug=slug,
                short_description=f"Professional {title.lower()} services for paper mills and industrial plants.",
                description=f"Comprehensive {title.lower()} delivered by Shukla Industrial with 18+ years of field expertise.",
                icon=icon,
                benefits=["OEM tolerance compliance", "Full documentation", "Experienced technicians"],
                faqs=[{"question": f"What is {title}?", "answer": f"Our {title.lower()} service ensures precision alignment."}],
                image_url="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80",
                sort_order=idx,
                is_active=True,
            )
        )
    db.commit()


def seed_projects(db: Session) -> None:
    if db.query(Project).count() > 0:
        return
    projects = [
        {
            "title": "JK Paper Unit — Full Paper Machine Alignment",
            "slug": "jk-paper-full-alignment",
            "client": "JK Paper",
            "location": "Songadh, Gujarat",
            "industry": "paper-mill",
            "industry_label": "Paper Mill",
            "completion_date": date(2024, 11, 15),
            "service_type": "Industrial Optical Alignment",
            "featured": True,
            "short_description": "Complete optical alignment of paper machine sections including press, dryer, and calendar groups.",
            "description": "Executed comprehensive industrial optical alignment for JK Paper's manufacturing unit.",
            "images": [
                ("https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80", "JK Paper machine alignment"),
            ],
        },
        {
            "title": "Century Paper — Dryer Section Theodolite Survey",
            "slug": "century-paper-dryer-survey",
            "client": "Century Paper",
            "location": "Kalyan, Maharashtra",
            "industry": "paper-mill",
            "industry_label": "Paper Mill",
            "completion_date": date(2024, 8, 22),
            "service_type": "Theodolite Alignment",
            "featured": True,
            "short_description": "Theodolite-based centerline survey and alignment of multi-cylinder dryer section.",
            "description": "Precision theodolite survey establishing dryer section centerlines and elevation benchmarks.",
            "images": [
                ("https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=800&q=80", "Theodolite survey at Century Paper"),
            ],
        },
        {
            "title": "ITC Tribeni — Machinery Installation Project",
            "slug": "itc-tribeni-machinery-install",
            "client": "ITC Tribeni",
            "location": "Tribeni, West Bengal",
            "industry": "paper-mill",
            "industry_label": "Paper Mill",
            "completion_date": date(2024, 6, 10),
            "service_type": "Machinery Installation",
            "featured": True,
            "short_description": "Turnkey machinery erection, leveling, and alignment for new production line equipment.",
            "description": "Managed complete machinery installation including foundation bolt surveys and equipment leveling.",
            "images": [
                ("https://images.unsplash.com/photo-1518611507436-f9221403eca8?auto=format&fit=crop&w=800&q=80", "Machinery installation at ITC Tribeni"),
            ],
        },
    ]
    for idx, pdata in enumerate(projects):
        project = Project(
            title=pdata["title"],
            slug=pdata["slug"],
            client=pdata["client"],
            location=pdata["location"],
            industry=pdata["industry"],
            industry_label=pdata["industry_label"],
            completion_date=pdata["completion_date"],
            service_type=pdata["service_type"],
            short_description=pdata["short_description"],
            description=pdata["description"],
            featured=pdata["featured"],
            sort_order=idx,
            is_active=True,
        )
        for i, (url, alt) in enumerate(pdata["images"]):
            project.images.append(ProjectImage(image_url=url, alt_text=alt, sort_order=i))
        db.add(project)
    db.commit()


def seed_gallery(db: Session) -> None:
    if db.query(Gallery).count() > 0:
        return
    items = [
        ("Paper Machine Roller Alignment", "JK Paper", "Songadh, Gujarat", "2024-11-10", "alignment", "Optical Alignment", True),
        ("Theodolite Centerline Survey", "Century Paper", "Kalyan, Maharashtra", "2024-08-18", "surveying", "Surveying", True),
        ("Machinery Erection & Leveling", "ITC Tribeni", "Tribeni, West Bengal", "2024-06-05", "installation", "Installation", True),
    ]
    urls = [
        "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1565043589221-1a6fd9f4c837?auto=format&fit=crop&w=800&q=80",
    ]
    for idx, (title, company, location, dt, cat, label, featured) in enumerate(items):
        g = Gallery(
            title=title,
            company=company,
            location=location,
            date=dt,
            category=cat,
            category_label=label,
            description=f"Field work documentation — {title}.",
            featured=featured,
            sort_order=idx,
            is_active=True,
        )
        g.images.append(GalleryImage(image_url=urls[idx], alt_text=title, sort_order=0))
        db.add(g)
    db.commit()


def seed_testimonials(db: Session) -> None:
    if db.query(Testimonial).count() > 0:
        return
    items = [
        ("R.K. Sharma", "Plant Manager", "JK Paper", "Exceptional alignment work with precise documentation.", 5, "RS"),
        ("A. Mehta", "Maintenance Head", "Century Paper", "Reliable theodolite surveys and professional team.", 5, "AM"),
        ("S. Banerjee", "Project Engineer", "ITC Tribeni", "On-time machinery installation with OEM tolerances met.", 5, "SB"),
    ]
    for idx, (name, desig, company, quote, rating, initials) in enumerate(items):
        db.add(
            Testimonial(
                name=name,
                designation=desig,
                company=company,
                quote=quote,
                rating=rating,
                initials=initials,
                featured=True,
                sort_order=idx,
                is_active=True,
            )
        )
    db.commit()


def run_all_seeds(db: Session) -> None:
    seed_admin(db)
    seed_company_and_settings(db)
    seed_hero_slides(db)
    seed_clients(db)
    seed_services(db)
    seed_projects(db)
    seed_gallery(db)
    seed_testimonials(db)
