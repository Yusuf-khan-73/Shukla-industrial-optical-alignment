const express = require('express');
const { authenticate } = require('../middleware/auth');
const contactController = require('../controllers/contactController');

const router = express.Router();

router.post('/contact', contactController.submitContact);

router.get(
  '/admin/contact-messages',
  authenticate,
  contactController.listContactMessages
);
router.patch(
  '/admin/contact-messages/:item_id',
  authenticate,
  contactController.markContactRead
);
router.delete(
  '/admin/contact-messages/:item_id',
  authenticate,
  contactController.deleteContactMessage
);

module.exports = router;
