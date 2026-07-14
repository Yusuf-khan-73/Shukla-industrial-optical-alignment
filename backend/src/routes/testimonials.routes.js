const express = require('express');
const { authenticate } = require('../middleware/auth');
const testimonialsController = require('../controllers/testimonialsController');

const router = express.Router();

router.get('/testimonials', testimonialsController.listTestimonials);

router.get('/admin/testimonials', authenticate, testimonialsController.adminListTestimonials);
router.post('/admin/testimonials', authenticate, testimonialsController.createTestimonial);
router.put(
  '/admin/testimonials/:item_id',
  authenticate,
  testimonialsController.updateTestimonial
);
router.delete(
  '/admin/testimonials/:item_id',
  authenticate,
  testimonialsController.deleteTestimonial
);

module.exports = router;
