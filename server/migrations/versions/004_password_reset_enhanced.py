"""Enhance password_reset_tokens with email and used flag.

Revision ID: 004_password_reset_enhanced
Revises: 003_auth_profile
Create Date: 2026-07-08
"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "004_password_reset_enhanced"
down_revision: Union[str, None] = "003_auth_profile"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "password_reset_tokens",
        sa.Column("email", sa.String(length=255), nullable=True),
    )
    op.add_column(
        "password_reset_tokens",
        sa.Column("used", sa.Boolean(), nullable=False, server_default=sa.text("false")),
    )
    op.execute(
        """
        UPDATE password_reset_tokens prt
        SET email = u.email
        FROM users u
        WHERE prt.user_id = u.id AND prt.email IS NULL
        """
    )
    op.execute(
        "UPDATE password_reset_tokens SET used = true WHERE used_at IS NOT NULL"
    )
    op.alter_column("password_reset_tokens", "email", nullable=False)


def downgrade() -> None:
    op.drop_column("password_reset_tokens", "used")
    op.drop_column("password_reset_tokens", "email")
