"""Add admin_login_email to company_information.

Revision ID: 005_admin_login_email
Revises: 004_password_reset_enhanced
Create Date: 2026-07-08
"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "005_admin_login_email"
down_revision: Union[str, None] = "004_password_reset_enhanced"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "company_information",
        sa.Column("admin_login_email", sa.String(length=255), nullable=True),
    )

    # Backfill from the primary admin user when available.
    op.execute(
        """
        UPDATE company_information
        SET admin_login_email = (
            SELECT u.email
            FROM users u
            WHERE u.is_superuser = true
            ORDER BY u.id ASC
            LIMIT 1
        )
        WHERE admin_login_email IS NULL
        """
    )

    # Fallback for empty databases without a user row yet.
    op.execute(
        """
        UPDATE company_information
        SET admin_login_email = 'yusufmohmmad7300@gmail.com'
        WHERE admin_login_email IS NULL OR admin_login_email = ''
        """
    )

    op.alter_column("company_information", "admin_login_email", nullable=False)
    op.create_unique_constraint(
        "uq_company_information_admin_login_email",
        "company_information",
        ["admin_login_email"],
    )
    op.create_index(
        "ix_company_information_admin_login_email",
        "company_information",
        ["admin_login_email"],
        unique=False,
    )


def downgrade() -> None:
    op.drop_index("ix_company_information_admin_login_email", table_name="company_information")
    op.drop_constraint(
        "uq_company_information_admin_login_email",
        "company_information",
        type_="unique",
    )
    op.drop_column("company_information", "admin_login_email")
