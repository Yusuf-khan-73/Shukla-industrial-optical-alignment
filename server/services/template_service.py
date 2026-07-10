"""Responsive HTML email templates for contact inquiries."""
from __future__ import annotations

from typing import Any

from config.settings import settings


class TemplateService:
    def build_admin_notification(self, message: Any, company_email: str) -> dict[str, str]:
        html = f"""<!DOCTYPE html>
<html lang=\"en\">
<head><meta charset=\"UTF-8\" /><meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" /><title>New Inquiry Received</title></head>
<body style=\"margin:0;padding:0;background:#f4f6fb;font-family:Arial,Helvetica,sans-serif;\">
  <table role=\"presentation\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" style=\"background:#f4f6fb;padding:24px;\">
    <tr><td align=\"center\">
      <table role=\"presentation\" width=\"100%\" style=\"max-width:640px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 8px 30px rgba(0,0,0,0.08);\">
        <tr><td style=\"background:linear-gradient(135deg,#0f3d6b,#1f6fb2);padding:28px 24px;text-align:center;color:#fff;\">
          <h1 style=\"margin:0 0 8px;font-size:24px;\">New Inquiry Received</h1>
          <p style=\"margin:0;font-size:14px;opacity:0.95;\">{settings.company_name}</p>
        </td></tr>
        <tr><td style=\"padding:24px;\">
          <p style=\"margin:0 0 12px;font-size:16px;\">A new inquiry has been received from your website.</p>
          <table role=\"presentation\" width=\"100%\" style=\"border-collapse:collapse;font-size:14px;\">
            <tr><td style=\"padding:8px 0;border-bottom:1px solid #e6ecf3;font-weight:bold;width:40%;\">Inquiry Number</td><td style=\"padding:8px 0;border-bottom:1px solid #e6ecf3;\">{message.inquiry_number}</td></tr>
            <tr><td style=\"padding:8px 0;border-bottom:1px solid #e6ecf3;font-weight:bold;\">Name</td><td style=\"padding:8px 0;border-bottom:1px solid #e6ecf3;\">{message.name}</td></tr>
            <tr><td style=\"padding:8px 0;border-bottom:1px solid #e6ecf3;font-weight:bold;\">Phone</td><td style=\"padding:8px 0;border-bottom:1px solid #e6ecf3;\">{message.phone}</td></tr>
            <tr><td style=\"padding:8px 0;border-bottom:1px solid #e6ecf3;font-weight:bold;\">Email</td><td style=\"padding:8px 0;border-bottom:1px solid #e6ecf3;\">{message.email}</td></tr>
            <tr><td style=\"padding:8px 0;border-bottom:1px solid #e6ecf3;font-weight:bold;\">Company</td><td style=\"padding:8px 0;border-bottom:1px solid #e6ecf3;\">{message.company_name or '-'}</td></tr>
            <tr><td style=\"padding:8px 0;border-bottom:1px solid #e6ecf3;font-weight:bold;\">City</td><td style=\"padding:8px 0;border-bottom:1px solid #e6ecf3;\">{message.city}</td></tr>
            <tr><td style=\"padding:8px 0;border-bottom:1px solid #e6ecf3;font-weight:bold;\">Service</td><td style=\"padding:8px 0;border-bottom:1px solid #e6ecf3;\">{message.service_required}</td></tr>
            <tr><td style=\"padding:8px 0;border-bottom:1px solid #e6ecf3;font-weight:bold;\">Date</td><td style=\"padding:8px 0;border-bottom:1px solid #e6ecf3;\">{message.created_at.strftime('%d %b %Y %H:%M:%S') if message.created_at else '-'}</td></tr>
            <tr><td style=\"padding:8px 0;border-bottom:1px solid #e6ecf3;font-weight:bold;\">IP Address</td><td style=\"padding:8px 0;border-bottom:1px solid #e6ecf3;\">{message.ip_address or '-'}</td></tr>
            <tr><td style=\"padding:8px 0;border-bottom:1px solid #e6ecf3;font-weight:bold;\">Browser</td><td style=\"padding:8px 0;border-bottom:1px solid #e6ecf3;\">{message.browser or '-'}</td></tr>
            <tr><td style=\"padding:8px 0;border-bottom:1px solid #e6ecf3;font-weight:bold;\">Source</td><td style=\"padding:8px 0;border-bottom:1px solid #e6ecf3;\">{message.source_page or '-'}</td></tr>
          </table>
          <p style=\"margin:16px 0 0;white-space:pre-wrap;font-size:14px;line-height:1.6;\">{message.message}</p>
          <p style=\"margin:24px 0 0;\"><a href=\"{settings.frontend_url}/admin/login\" style=\"display:inline-block;background:#f2b63d;color:#0f1724;text-decoration:none;padding:12px 20px;border-radius:8px;font-weight:bold;\">Open Admin Dashboard</a></p>
        </td></tr>
        <tr><td style=\"padding:16px 24px 24px;background:#f8fafc;font-size:12px;color:#64748b;\">Email sent to: {company_email}</td></tr>
      </table>
    </td></tr>
  </table>
</body></html>"""
        text = (
            f"New inquiry received\n"
            f"Inquiry Number: {message.inquiry_number}\n"
            f"Name: {message.name}\n"
            f"Email: {message.email}\n"
            f"Service: {message.service_required}\n"
            f"Message: {message.message}"
        )
        return {"html": html, "text": text}

    def build_customer_acknowledgement(self, message: Any) -> dict[str, str]:
        html = f"""<!DOCTYPE html>
<html lang=\"en\">
<head><meta charset=\"UTF-8\" /><meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" /><title>Thank You</title></head>
<body style=\"margin:0;padding:0;background:#f4f6fb;font-family:Arial,Helvetica,sans-serif;\">
  <table role=\"presentation\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" style=\"background:#f4f6fb;padding:24px;\">
    <tr><td align=\"center\">
      <table role=\"presentation\" width=\"100%\" style=\"max-width:640px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 8px 30px rgba(0,0,0,0.08);\">
        <tr><td style=\"background:linear-gradient(135deg,#0f3d6b,#1f6fb2);padding:28px 24px;text-align:center;color:#fff;\">
          <h1 style=\"margin:0 0 8px;font-size:24px;\">Thank You for Contacting Us</h1>
          <p style=\"margin:0;font-size:14px;opacity:0.95;\">{settings.company_name}</p>
        </td></tr>
        <tr><td style=\"padding:24px;\">
          <p style=\"margin:0 0 12px;font-size:16px;\">Dear {message.name},</p>
          <p style=\"margin:0 0 12px;font-size:15px;line-height:1.6;\">We have successfully received your inquiry. Our technical team will review your request and contact you within 24 hours.</p>
          <table role=\"presentation\" width=\"100%\" style=\"border-collapse:collapse;font-size:14px;\">
            <tr><td style=\"padding:8px 0;border-bottom:1px solid #e6ecf3;font-weight:bold;width:40%;\">Inquiry Number</td><td style=\"padding:8px 0;border-bottom:1px solid #e6ecf3;\">{message.inquiry_number}</td></tr>
            <tr><td style=\"padding:8px 0;border-bottom:1px solid #e6ecf3;font-weight:bold;\">Service</td><td style=\"padding:8px 0;border-bottom:1px solid #e6ecf3;\">{message.service_required}</td></tr>
            <tr><td style=\"padding:8px 0;border-bottom:1px solid #e6ecf3;font-weight:bold;\">Submitted Date</td><td style=\"padding:8px 0;border-bottom:1px solid #e6ecf3;\">{message.created_at.strftime('%d %b %Y %H:%M:%S') if message.created_at else '-'}</td></tr>
          </table>
          <p style=\"margin:24px 0 0;font-size:14px;line-height:1.6;\">Support: {settings.company_phone} | {settings.company_email}</p>
          <p style=\"margin:8px 0 0;font-size:14px;line-height:1.6;\">Working Hours: Monday - Saturday</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>"""
        text = (
            f"Dear {message.name},\n\n"
            f"Thank you for contacting {settings.company_name}.\n"
            f"Inquiry Number: {message.inquiry_number}\n"
            f"Service: {message.service_required}\n"
            f"Submitted Date: {message.created_at if message.created_at else '-'}"
        )
        return {"html": html, "text": text}
