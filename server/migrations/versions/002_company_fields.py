"""Extend company_information with flat contact and social fields.

Revision ID: 002_company_fields
Revises: 001_initial
Create Date: 2026-07-08
"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "002_company_fields"
down_revision: Union[str, None] = "001_initial"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("company_information", sa.Column("logo", sa.String(length=500), nullable=True, server_default=""))
    op.add_column("company_information", sa.Column("phone_1", sa.String(length=30), nullable=True, server_default=""))
    op.add_column("company_information", sa.Column("phone_2", sa.String(length=30), nullable=True, server_default=""))
    op.add_column("company_information", sa.Column("whatsapp_number", sa.String(length=20), nullable=True, server_default=""))
    op.add_column("company_information", sa.Column("office_address", sa.Text(), nullable=True, server_default=""))
    op.add_column("company_information", sa.Column("google_map_url", sa.String(length=1000), nullable=True, server_default=""))
    op.add_column("company_information", sa.Column("facebook", sa.String(length=500), nullable=True, server_default=""))
    op.add_column("company_information", sa.Column("instagram", sa.String(length=500), nullable=True, server_default=""))
    op.add_column("company_information", sa.Column("linkedin", sa.String(length=500), nullable=True, server_default=""))
    op.add_column("company_information", sa.Column("youtube", sa.String(length=500), nullable=True, server_default=""))

    op.execute("""
        UPDATE company_information
        SET
            phone_1 = COALESCE(phones->>0, ''),
            phone_2 = COALESCE(phones->>1, ''),
            whatsapp_number = COALESCE(REGEXP_REPLACE(phones->>0, '[^0-9]', '', 'g'), ''),
            office_address = COALESCE(address->>'full', address->>'line1', '')
        WHERE id IS NOT NULL
    """)


def downgrade() -> None:
    op.drop_column("company_information", "youtube")
    op.drop_column("company_information", "linkedin")
    op.drop_column("company_information", "instagram")
    op.drop_column("company_information", "facebook")
    op.drop_column("company_information", "google_map_url")
    op.drop_column("company_information", "office_address")
    op.drop_column("company_information", "whatsapp_number")
    op.drop_column("company_information", "phone_2")
    op.drop_column("company_information", "phone_1")
    op.drop_column("company_information", "logo")
