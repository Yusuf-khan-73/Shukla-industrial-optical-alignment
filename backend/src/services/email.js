const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');
const prisma = require('../prisma/client');
const settings = require('../config/settings');

const TEMPLATES_DIR = path.resolve(__dirname, '../../templates');

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function senderAddress() {
  const fromEmail = settings.smtpFromEmail || settings.smtpUser;
  const fromName = settings.smtpFromName || settings.companyName;
  return `"${fromName.replace(/"/g, '')}" <${fromEmail}>`;
}

async function sendEmail(toEmail, subject, htmlBody, textBody) {
  console.info(`Sending email to: ${toEmail}`);

  const host = settings.smtpHost;
  const user = settings.smtpUser;
  // Gmail App Passwords are often shown with spaces — strip them.
  const pass = String(settings.smtpPassword || '').replace(/\s+/g, '');

  if (!host || !user || !pass) {
    console.warn('SMTP configuration missing (SMTP_HOST / SMTP_USERNAME / SMTP_PASSWORD)');
    return false;
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port: settings.smtpPort,
      secure: settings.smtpUseSsl, // false for port 587
      requireTLS: settings.smtpUseTls && !settings.smtpUseSsl,
      auth: {
        user,
        pass,
      },
      connectionTimeout: 30000,
      greetingTimeout: 30000,
      socketTimeout: 30000,
    });

    await transporter.sendMail({
      from: senderAddress(),
      to: toEmail,
      subject,
      text: textBody,
      html: htmlBody,
    });

    console.info(`Email sent successfully to: ${toEmail}`);
    return true;
  } catch (err) {
    // Do not log full error objects (may include auth payloads).
    console.error(
      'SMTP ERROR:',
      err.code || 'SEND_FAILED',
      err.responseCode || '',
      err.message || 'unknown error'
    );
    return false;
  }
}

function passwordResetHtml(resetUrl) {
  return `<!DOCTYPE html>
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
                <h1 style="color: #2d5a87; margin: 0; font-size: 28px;">${settings.companyName}</h1>
                <p style="color: #666; margin: 5px 0 0 0; font-size: 14px;">Precision · Accuracy · Performance</p>
            </td>
        </tr>
        <tr>
            <td style="padding: 30px;">
                <h2 style="color: #2d5a87; margin-top: 0;">Password Reset Request</h2>
                <p style="color: #333; line-height: 1.6;">
                    We received a request to reset your password for your account at <strong>${settings.companyName}</strong>.
                </p>
                <p style="color: #333; line-height: 1.6;">To reset your password, click the button below:</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${resetUrl}"
                       style="background: #2d5a87; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
                       Reset Password
                    </a>
                </div>
                <p style="color: #666; font-size: 14px; line-height: 1.6;">
                    This link will expire in <strong>${settings.passwordResetExpireMinutes}</strong> minutes.
                </p>
                <p style="color: #666; font-size: 14px; line-height: 1.6;">
                    If you didn't request this password reset, please ignore this email.
                </p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
                <p style="color: #666; font-size: 13px; line-height: 1.6; margin-bottom: 5px;">Best regards,</p>
                <p style="color: #2d5a87; font-size: 16px; font-weight: bold; margin-top: 0;">${settings.companyName}</p>
                <p style="color: #999; font-size: 12px; margin-top: 10px;">
                    <a href="${settings.companyWebsite}" style="color: #2d5a87; text-decoration: none;">${settings.companyWebsite}</a>
                </p>
            </td>
        </tr>
        <tr>
            <td style="padding: 20px; text-align: center; background-color: #f8f9fa; border-top: 1px solid #eee;">
                <p style="color: #999; font-size: 12px; margin: 0;">
                    &copy; ${new Date().getFullYear()} ${settings.companyName}. All rights reserved.
                </p>
            </td>
        </tr>
    </table>
</body>
</html>`;
}

function passwordResetText(resetUrl) {
  return `
${settings.companyName}
==============================

Password Reset Request
----------------------

We received a request to reset your password.

To reset your password, copy and paste this link in your browser:
${resetUrl}

This link will expire in ${settings.passwordResetExpireMinutes} minutes.

If you didn't request this password reset, please ignore this email.

Best regards,
${settings.companyName}
`;
}

async function sendPasswordResetEmail(toEmail, resetUrl) {
  return sendEmail(
    toEmail,
    `Reset Password | ${settings.companyName}`,
    passwordResetHtml(resetUrl),
    passwordResetText(resetUrl)
  );
}

async function generateInquiryNumber() {
  const year = new Date().getUTCFullYear();
  const prefix = `INQ-${year}-`;

  const last = await prisma.contactMessage.findFirst({
    where: { inquiry_number: { startsWith: prefix } },
    orderBy: { inquiry_number: 'desc' },
  });

  let nextNumber = 1;
  if (last?.inquiry_number) {
    try {
      nextNumber = Number(last.inquiry_number.split('-').pop()) + 1;
    } catch {
      nextNumber = 1;
    }
  }

  return `${prefix}${String(nextNumber).padStart(6, '0')}`;
}

async function resolveAdminNotificationEmail() {
  try {
    const company = await prisma.companyInformation.findFirst();
    if (company?.email) return company.email;
  } catch (err) {
    console.error('Company email fetch error:', err);
  }
  return settings.companyEmail;
}

function loadTemplate(filename) {
  return fs.readFileSync(path.join(TEMPLATES_DIR, filename), 'utf8');
}

function renderTemplate(templateText, context) {
  let rendered = templateText;
  for (const [key, value] of Object.entries(context)) {
    rendered = rendered.split(`{{${key}}}`).join(value ? escapeHtml(String(value)) : '');
  }
  return rendered;
}

function contactEmailContext(fields) {
  const now = new Date();
  return {
    INQUIRY_NUMBER: fields.inquiry_number,
    CUSTOMER_NAME: fields.name,
    CUSTOMER_PHONE: fields.phone,
    CUSTOMER_EMAIL: fields.email,
    CUSTOMER_COMPANY: fields.company_name || '-',
    CUSTOMER_CITY: fields.city,
    SERVICE_REQUIRED: fields.service_required,
    CUSTOMER_MESSAGE: fields.message,
    INQUIRY_DATE: now.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      timeZone: 'UTC',
    }),
    INQUIRY_TIME: now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: 'UTC',
    }) + ' UTC',
    COMPANY_NAME: settings.companyName,
    COMPANY_PHONE: settings.companyPhone,
    COMPANY_EMAIL: settings.companyEmail,
    COMPANY_WEBSITE: settings.companyWebsite,
    ADMIN_DASHBOARD_URL: settings.adminDashboardUrl,
    SUPPORT_PHONE_1: '9510900608',
    SUPPORT_PHONE_2: '8707305703',
    YEAR: String(now.getUTCFullYear()),
  };
}

async function sendContactAdminNotification(fields) {
  try {
    const toEmail = await resolveAdminNotificationEmail();
    const context = contactEmailContext(fields);
    const htmlBody = renderTemplate(loadTemplate('admin_notification.html'), context);
    const textBody = `
New Inquiry Received
===================

Inquiry Number: ${fields.inquiry_number}
Name: ${fields.name}
Phone: ${fields.phone}
Email: ${fields.email}
Company: ${fields.company_name}
City: ${fields.city}
Service: ${fields.service_required}

Message:
${fields.message}
`;
    return sendEmail(toEmail, `New Inquiry | ${settings.companyName}`, htmlBody, textBody);
  } catch (err) {
    console.error('Admin notification error:', err);
    return false;
  }
}

async function sendContactCustomerThankYou(fields) {
  try {
    const context = contactEmailContext(fields);
    const htmlBody = renderTemplate(loadTemplate('customer_thank_you.html'), context);
    const textBody = `
Dear ${fields.name},

Thank you for contacting ${settings.companyName}.

Your inquiry has been received.

Inquiry Number: ${fields.inquiry_number}
Service: ${fields.service_required}

Our team will contact you soon.

Support: ${settings.companyPhone}

Regards,
${settings.companyName}
`;
    return sendEmail(
      fields.email,
      `Thank You | ${settings.companyName}`,
      htmlBody,
      textBody
    );
  } catch (err) {
    console.error('Customer email error:', err);
    return false;
  }
}

module.exports = {
  sendEmail,
  sendPasswordResetEmail,
  generateInquiryNumber,
  sendContactAdminNotification,
  sendContactCustomerThankYou,
};
