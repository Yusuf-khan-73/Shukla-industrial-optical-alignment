"""
SMTP Email Service
Location: server/services/email.py
"""

import html as _html
import logging
import smtplib
from datetime import datetime, timezone
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.utils import formataddr
from pathlib import Path
from sqlalchemy.orm import Session
from config.settings import settings

logger = logging.getLogger(__name__)

TEMPLATES_DIR = (
    Path(__file__)
    .resolve()
    .parent
    .parent
    / "templates"
)


# ======================================================
# Sender Address
# ======================================================

def _sender_address():
    """Get formatted sender address with name and email."""
    from_email = settings.smtp_from_email or settings.smtp_user
    from_name = settings.smtp_from_name or settings.company_name
    
    return formataddr((from_name, from_email))


# ======================================================
# Main Email Function
# ======================================================

def send_email(to_email: str, subject: str, html_body: str, text_body: str) -> bool:
    """
    Send email with both HTML and plain text versions.
    
    Args:
        to_email: Recipient email address
        subject: Email subject
        html_body: HTML version of email content
        text_body: Plain text version of email content
    
    Returns:
        bool: True if email sent successfully, False otherwise
    """
    logger.info("Sending email to: %s", to_email)
    
    # Validate SMTP configuration
    if not all([settings.smtp_host, settings.smtp_user, settings.smtp_password]):
        logger.warning("SMTP configuration missing")
        return False
    
    # Create message
    message = MIMEMultipart("alternative")
    message["Subject"] = subject
    message["From"] = _sender_address()
    message["To"] = to_email
    
    # Attach text and HTML versions
    message.attach(MIMEText(text_body, "plain", "utf-8"))
    message.attach(MIMEText(html_body, "html", "utf-8"))
    
    try:
        # Connect to SMTP server
        if settings.smtp_use_ssl:
            server = smtplib.SMTP_SSL(
                settings.smtp_host,
                settings.smtp_port,
                timeout=30
            )
        else:
            server = smtplib.SMTP(
                settings.smtp_host,
                settings.smtp_port,
                timeout=30
            )
        
        with server:
            server.ehlo()
            
            if settings.smtp_use_tls:
                server.starttls()
                server.ehlo()
            
            server.login(settings.smtp_user, settings.smtp_password)
            server.sendmail(
                settings.smtp_from_email or settings.smtp_user,
                [to_email],
                message.as_string()
            )
        
        logger.info("Email sent successfully to: %s", to_email)
        return True
    
    except Exception as e:
        logger.error("SMTP ERROR: %s", str(e), exc_info=True)
        return False


# ======================================================
# Password Reset Email
# ======================================================

def _password_reset_html(reset_url: str) -> str:
    """Generate HTML for password reset email."""
    return f"""
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset</title>
</head>
<body style="font-family: Arial, Helvetica, sans-serif; margin: 0; padding: 20px; background-color: #f4f4f4;">
    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <tr>
            <td style="padding: 30px; text-align: center; border-bottom: 1px solid #eee;">
                <h1 style="color: #2d5a87; margin: 0; font-size: 28px;">{settings.company_name}</h1>
                <p style="color: #666; margin: 5px 0 0 0; font-size: 14px;">Precision · Accuracy · Performance</p>
            </td>
        </tr>
        <tr>
            <td style="padding: 30px;">
                <h2 style="color: #2d5a87; margin-top: 0;">Password Reset Request</h2>
                
                <p style="color: #333; line-height: 1.6;">
                    We received a request to reset your password for your account at <strong>{settings.company_name}</strong>.
                </p>
                
                <p style="color: #333; line-height: 1.6;">
                    To reset your password, click the button below:
                </p>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="{reset_url}" 
                       style="background: #2d5a87; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
                       Reset Password
                    </a>
                </div>
                
                <p style="color: #666; font-size: 14px; line-height: 1.6;">
                    This link will expire in <strong>{settings.password_reset_expire_minutes}</strong> minutes.
                </p>
                
                <p style="color: #666; font-size: 14px; line-height: 1.6;">
                    If you didn't request this password reset, please ignore this email.
                </p>
                
                <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
                
                <p style="color: #666; font-size: 13px; line-height: 1.6; margin-bottom: 5px;">
                    Best regards,
                </p>
                <p style="color: #2d5a87; font-size: 16px; font-weight: bold; margin-top: 0;">
                    {settings.company_name}
                </p>
                <p style="color: #999; font-size: 12px; margin-top: 10px;">
                    <a href="{settings.company_website}" style="color: #2d5a87; text-decoration: none;">{settings.company_website}</a>
                </p>
            </td>
        </tr>
        <tr>
            <td style="padding: 20px; text-align: center; background-color: #f8f9fa; border-top: 1px solid #eee;">
                <p style="color: #999; font-size: 12px; margin: 0;">
                    &copy; {datetime.now().year} {settings.company_name}. All rights reserved.
                </p>
            </td>
        </tr>
    </table>
</body>
</html>
"""

def _password_reset_text(reset_url: str) -> str:
    """Generate plain text for password reset email."""
    return f"""
{settings.company_name}
==============================

Password Reset Request
----------------------

We received a request to reset your password.

To reset your password, copy and paste this link in your browser:
{reset_url}

This link will expire in {settings.password_reset_expire_minutes} minutes.

If you didn't request this password reset, please ignore this email.

Best regards,
{settings.company_name}
"""

def send_password_reset_email(to_email: str, reset_url: str) -> bool:
    """Send password reset email."""
    return send_email(
        to_email,
        f"Reset Password | {settings.company_name}",
        _password_reset_html(reset_url),
        _password_reset_text(reset_url)
    )


# ======================================================
# Contact Inquiry Email System
# ======================================================

def generate_inquiry_number(db: Session) -> str:
    """
    Generate inquiry number in format: INQ-YYYY-000001
    
    Args:
        db: Database session
    
    Returns:
        str: Generated inquiry number
    """
    from models.contact import ContactMessage
    
    year = datetime.now(timezone.utc).year
    prefix = f"INQ-{year}-"
    
    last = (
        db.query(ContactMessage)
        .filter(ContactMessage.inquiry_number.like(f"{prefix}%"))
        .order_by(ContactMessage.inquiry_number.desc())
        .first()
    )
    
    next_number = 1
    if last and last.inquiry_number:
        try:
            next_number = int(last.inquiry_number.split("-")[-1]) + 1
        except Exception:
            next_number = 1
    
    return f"{prefix}{next_number:06d}"


# ======================================================
# Admin Email Resolve
# ======================================================

def _resolve_admin_notification_email(db: Session = None) -> str:
    """Get admin email address for notifications."""
    try:
        from models.company import CompanyInformation
        
        if db:
            company = db.query(CompanyInformation).first()
            if company and company.email:
                return company.email
    except Exception as e:
        logger.error("Company email fetch error: %s", str(e))
    
    return settings.company_email


# ======================================================
# Template Functions
# ======================================================

def _load_template(filename: str) -> str:
    """Load template file from templates directory."""
    path = TEMPLATES_DIR / filename
    return path.read_text(encoding="utf-8")

def _render_template(template_text: str, context: dict) -> str:
    """Render template with context variables."""
    rendered = template_text
    
    for key, value in context.items():
        rendered = rendered.replace(
            "{{" + key + "}}",
            _html.escape(str(value)) if value else ""
        )
    
    return rendered


# ======================================================
# Common Context
# ======================================================

def _contact_email_context(
    *,
    inquiry_number: str,
    name: str,
    phone: str,
    email: str,
    company_name: str,
    city: str,
    service_required: str,
    message: str
) -> dict:
    """Build context for contact emails."""
    now = datetime.now(timezone.utc)
    
    return {
        "INQUIRY_NUMBER": inquiry_number,
        "CUSTOMER_NAME": name,
        "CUSTOMER_PHONE": phone,
        "CUSTOMER_EMAIL": email,
        "CUSTOMER_COMPANY": company_name or "-",
        "CUSTOMER_CITY": city,
        "SERVICE_REQUIRED": service_required,
        "CUSTOMER_MESSAGE": message,
        "INQUIRY_DATE": now.strftime("%d %b %Y"),
        "INQUIRY_TIME": now.strftime("%I:%M %p UTC"),
        "COMPANY_NAME": settings.company_name,
        "COMPANY_PHONE": settings.company_phone,
        "COMPANY_EMAIL": settings.company_email,
        "COMPANY_WEBSITE": settings.company_website,
        "ADMIN_DASHBOARD_URL": settings.admin_dashboard_url,
        "SUPPORT_PHONE_1": "9510900608",
        "SUPPORT_PHONE_2": "8707305703",
        "YEAR": now.strftime("%Y")
    }


# ======================================================
# Admin Notification Email
# ======================================================

def send_contact_admin_notification(
    *,
    inquiry_number: str,
    name: str,
    phone: str,
    email: str,
    company_name: str,
    city: str,
    service_required: str,
    message: str,
    db: Session = None
) -> bool:
    """Send admin notification email for new contact inquiry."""
    try:
        to_email = _resolve_admin_notification_email(db)
        
        context = _contact_email_context(
            inquiry_number=inquiry_number,
            name=name,
            phone=phone,
            email=email,
            company_name=company_name,
            city=city,
            service_required=service_required,
            message=message
        )
        
        html_body = _render_template(
            _load_template("admin_notification.html"),
            context
        )
        
        text_body = f"""
New Inquiry Received
===================

Inquiry Number: {inquiry_number}
Name: {name}
Phone: {phone}
Email: {email}
Company: {company_name}
City: {city}
Service: {service_required}

Message:
{message}
"""
        
        return send_email(
            to_email,
            f"New Inquiry | {settings.company_name}",
            html_body,
            text_body
        )
    
    except Exception as e:
        logger.error("Admin notification error: %s", str(e), exc_info=True)
        return False


# ======================================================
# Customer Thank You Email
# ======================================================

def send_contact_customer_thank_you(
    *,
    inquiry_number: str,
    name: str,
    phone: str,
    email: str,
    company_name: str,
    city: str,
    service_required: str,
    message: str
) -> bool:
    """Send thank you email to customer after inquiry."""
    try:
        context = _contact_email_context(
            inquiry_number=inquiry_number,
            name=name,
            phone=phone,
            email=email,
            company_name=company_name,
            city=city,
            service_required=service_required,
            message=message
        )
        
        html_body = _render_template(
            _load_template("customer_thank_you.html"),
            context
        )
        
        text_body = f"""
Dear {name},

Thank you for contacting {settings.company_name}.

Your inquiry has been received.

Inquiry Number: {inquiry_number}
Service: {service_required}

Our team will contact you soon.

Support: {settings.company_phone}

Regards,
{settings.company_name}
"""
        
        return send_email(
            email,
            f"Thank You | {settings.company_name}",
            html_body,
            text_body
        )
    
    except Exception as e:
        logger.error("Customer email error: %s", str(e), exc_info=True)
        return False