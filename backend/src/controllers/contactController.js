const { asyncHandler, AppError } = require('../middleware/errorHandler');
const prisma = require('../prisma/client');
const { serializeContactAdmin } = require('../utils/serializers');
const {
  validate,
  contactCreateSchema,
  contactReadUpdateSchema,
} = require('../validators');
const {
  generateInquiryNumber,
  sendContactAdminNotification,
  sendContactCustomerThankYou,
} = require('../services/email');

function parseQueryBool(value) {
  if (value === undefined || value === null || value === '') return undefined;
  if (value === true || value === 'true') return true;
  if (value === false || value === 'false') return false;
  return undefined;
}

const submitContact = asyncHandler(async (req, res) => {
  const payload = validate(contactCreateSchema, req.body);

  // STEP 1: commit inquiry first
  let record = await prisma.contactMessage.create({ data: payload });
  console.info(`Inquiry created | id=${record.id}`);

  // STEP 2: success response prepared before optional work
  const response = {
    id: record.id,
    message: 'Thank you! Your inquiry has been received. We will contact you shortly.',
    inquiryNumber: null,
  };

  // STEP 3: best-effort inquiry number + emails
  try {
    const inquiryNumber = await generateInquiryNumber();
    record = await prisma.contactMessage.update({
      where: { id: record.id },
      data: { inquiry_number: inquiryNumber },
    });
    response.inquiryNumber = inquiryNumber;

    const emailKwargs = {
      inquiry_number: inquiryNumber,
      name: record.name,
      phone: record.phone,
      email: record.email,
      company_name: record.company_name,
      city: record.city,
      service_required: record.service_required,
      message: record.message,
    };

    const adminSent = await sendContactAdminNotification(emailKwargs);
    const customerSent = await sendContactCustomerThankYou(emailKwargs);

    console.info(
      `Inquiry ${inquiryNumber} | admin_email=${adminSent ? 'sent' : 'failed'} | customer_email=${customerSent ? 'sent' : 'failed'}`
    );

    await prisma.contactMessage.update({
      where: { id: record.id },
      data: {
        admin_email_sent: adminSent,
        customer_email_sent: customerSent,
        email_error:
          adminSent && customerSent
            ? null
            : 'SMTP send failed for one or more notifications',
      },
    });
  } catch (err) {
    console.error(`Email/inquiry-number step failed | id=${record.id}`, err);
  }

  res.status(201).json(response);
});

const listContactMessages = asyncHandler(async (req, res) => {
  const unreadOnly = parseQueryBool(req.query.unread_only) === true;
  const where = unreadOnly ? { is_read: false } : {};

  const items = await prisma.contactMessage.findMany({
    where,
    orderBy: { created_at: 'desc' },
  });

  res.json(items.map(serializeContactAdmin));
});

const markContactRead = asyncHandler(async (req, res) => {
  const itemId = Number(req.params.item_id);
  const message = await prisma.contactMessage.findFirst({ where: { id: itemId } });
  if (!message) throw new AppError(404, 'Message not found');

  const payload = validate(contactReadUpdateSchema, req.body);
  const updated = await prisma.contactMessage.update({
    where: { id: itemId },
    data: { is_read: payload.is_read },
  });

  res.json(serializeContactAdmin(updated));
});

const deleteContactMessage = asyncHandler(async (req, res) => {
  const itemId = Number(req.params.item_id);
  const message = await prisma.contactMessage.findFirst({ where: { id: itemId } });
  if (!message) throw new AppError(404, 'Message not found');
  await prisma.contactMessage.delete({ where: { id: itemId } });
  res.status(204).send();
});

module.exports = {
  submitContact,
  listContactMessages,
  markContactRead,
  deleteContactMessage,
};
