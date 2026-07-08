"""
SMTP email service for password reset.
Location: server/services/email.py
"""
import logging
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.utils import formataddr

from config.settings import settings

logger = logging.getLogger(__name__)


def _sender_address() -> str:
    from_email = settings.smtp_from_email or settings.smtp_user
    from_name = settings.smtp_from_name or settings.company_name
    return formataddr((from_name, from_email))


def send_email(to_email: str, subject: str, html_body: str, text_body: str) -> bool:
    if not settings.smtp_host or not settings.smtp_user or not settings.smtp_password:
        logger.warning("SMTP not configured — email not sent to %s", to_email)
        if settings.debug:
            logger.info("DEV reset email to=%s subject=%s\n%s", to_email, subject, text_body)
            return True
        return False

    message = MIMEMultipart("alternative")
    message["Subject"] = subject
    message["From"] = _sender_address()
    message["To"] = to_email
    message.attach(MIMEText(text_body, "plain", "utf-8"))
    message.attach(MIMEText(html_body, "html", "utf-8"))

    try:
        with smtplib.SMTP(settings.smtp_host, settings.smtp_port, timeout=30) as server:
            if settings.smtp_use_tls:
                server.starttls()
            server.login(settings.smtp_user, settings.smtp_password)
            server.sendmail(settings.smtp_from_email or settings.smtp_user, [to_email], message.as_string())
        logger.info("Password reset email sent to %s", to_email)
        return True
    except Exception:
        logger.exception("Failed to send email to %s", to_email)
        return False


def _password_reset_html(reset_url: str) -> str:
    logo_url = f"{settings.frontend_url.rstrip('/')}/logo.png"
    company = settings.company_name
    phone = settings.company_phone
    email = settings.company_email
    website = settings.company_website
    minutes = settings.password_reset_expire_minutes

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Password Reset</title>
</head>
<body style="margin:0;padding:0;background:#f4f6f8;font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4f6f8;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 8px 32px rgba(27,43,58,0.12);">
          <tr>
            <td style="background:linear-gradient(135deg,#1a3a5c 0%,#2d5a87 100%);padding:28px 32px;text-align:center;">
              <img src="{logo_url}" alt="{company}" width="72" height="72" style="display:block;margin:0 auto 12px;border-radius:12px;background:#fff;padding:8px;" />
              <p style="margin:0;color:#ffffff;font-size:13px;letter-spacing:0.08em;text-transform:uppercase;font-weight:600;">{company}</p>
            </td>
          </tr>
          <tr>
            <td style="padding:36px 32px 24px;">
              <h1 style="margin:0 0 16px;font-size:24px;color:#1a3a5c;font-weight:700;">Password Reset Request</h1>
              <p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:#4a5568;">Hello,</p>
              <p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:#4a5568;">We received a request to reset your account password.</p>
              <p style="margin:0 0 28px;font-size:15px;line-height:1.7;color:#4a5568;">If you made this request, click the button below.</p>
              <table role="presentation" cellspacing="0" cellpadding="0" style="margin:0 auto 28px;">
                <tr>
                  <td style="border-radius:8px;background:linear-gradient(135deg,#c9a227 0%,#d4b84a 100%);">
                    <a href="{reset_url}" target="_blank" style="display:inline-block;padding:16px 36px;font-size:16px;font-weight:700;color:#1a3a2a;text-decoration:none;border-radius:8px;">Reset Password</a>
                  </td>
                </tr>
              </table>
              <p style="margin:0 0 12px;font-size:13px;line-height:1.6;color:#718096;">This link will expire in <strong>{minutes} minutes</strong>.</p>
              <p style="margin:0;font-size:13px;line-height:1.6;color:#718096;">If you did not request a password reset, you can safely ignore this email. No changes will be made to your account.</p>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 32px 32px;background:#f8fafc;border-top:1px solid #e2e8f0;">
              <p style="margin:0 0 8px;font-size:14px;color:#1a3a5c;font-weight:600;">Regards,</p>
              <p style="margin:0 0 16px;font-size:14px;color:#1a3a5c;font-weight:700;">{company}</p>
              <p style="margin:0 0 4px;font-size:13px;color:#4a5568;">Phone: {phone}</p>
              <p style="margin:0 0 4px;font-size:13px;color:#4a5568;">Email: <a href="mailto:{email}" style="color:#2d5a87;">{email}</a></p>
              <p style="margin:0;font-size:13px;color:#4a5568;">Website: <a href="https://{website}" style="color:#2d5a87;">{website}</a></p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>"""


def _password_reset_text(reset_url: str) -> str:
    company = settings.company_name
    minutes = settings.password_reset_expire_minutes
    return (
        f"Password Reset Request — {company}\n\n"
        "Hello,\n\n"
        "We received a request to reset your account password.\n"
        "If you made this request, open the link below:\n\n"
        f"{reset_url}\n\n"
        f"This link will expire in {minutes} minutes.\n\n"
        "If you did not request a password reset, you can safely ignore this email.\n"
        "No changes will be made to your account.\n\n"
        f"Regards,\n{company}\n"
        f"Phone: {settings.company_phone}\n"
        f"Email: {settings.company_email}\n"
        f"Website: {settings.company_website}\n"
    )


def send_password_reset_email(to_email: str, reset_url: str) -> bool:
    subject = f"Reset Your Password | {settings.company_name}"
    return send_email(
        to_email,
        subject,
        _password_reset_html(reset_url),
        _password_reset_text(reset_url),
    )
