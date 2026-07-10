"""Contact inquiry number and email notification tracking

Revision ID: 006_contact_inquiry_emails
Revises: 005_admin_login_email
Create Date: 2026-07-09

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "006_contact_inquiry_emails"
down_revision: Union[str, None] = "005_admin_login_email"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "contact_messages",
        sa.Column("inquiry_number", sa.String(length=50), nullable=True),
    )
    op.add_column(
        "contact_messages",
        sa.Column(
            "admin_email_sent",
            sa.Boolean(),
            nullable=False,
            server_default=sa.false(),
        ),
    )
    op.add_column(
        "contact_messages",
        sa.Column(
            "customer_email_sent",
            sa.Boolean(),
            nullable=False,
            server_default=sa.false(),
        ),
    )
    op.add_column(
        "contact_messages",
        sa.Column("email_error", sa.Text(), nullable=True),
    )
    op.create_index(
        op.f("ix_contact_messages_inquiry_number"),
        "contact_messages",
        ["inquiry_number"],
        unique=True,
    )


def downgrade() -> None:
    op.drop_index(op.f("ix_contact_messages_inquiry_number"), table_name="contact_messages")
    op.drop_column("contact_messages", "email_error")
    op.drop_column("contact_messages", "customer_email_sent")
    op.drop_column("contact_messages", "admin_email_sent")
    op.drop_column("contact_messages", "inquiry_number")